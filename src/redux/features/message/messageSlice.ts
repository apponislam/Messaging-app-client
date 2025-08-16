import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
};

export type TMessage = {
    _id: string;
    sender: TUser;
    receiver: TUser;
    content: string;
    createdAt: string;
    updatedAt?: string;
};

export type TMessageApiResponse = {
    success: boolean;
    message: string;
    data: TMessage[];
};

type TMessageState = {
    messages: TMessage[];
    lastApiResponse?: TMessageApiResponse;
};

const initialState: TMessageState = {
    messages: [],
    lastApiResponse: undefined,
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessagesFromApi: (state, action: PayloadAction<TMessageApiResponse>) => {
            state.lastApiResponse = action.payload;
            state.messages = action.payload.data || [];
        },
        addMessage: (state, action: PayloadAction<TMessage>) => {
            const index = state.messages.findIndex((m) => m._id === action.payload._id || (m._id.startsWith("temp-") && m.sender._id === action.payload.sender._id && m.content === action.payload.content));
            if (index >= 0) {
                state.messages[index] = action.payload;
            } else {
                state.messages.push(action.payload);
            }
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter((m) => m._id !== action.payload);
        },
        clearMessages: (state) => {
            state.messages = [];
            state.lastApiResponse = undefined;
        },
    },
});

export const { setMessagesFromApi, addMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;

// Selectors
export const selectMessages = (state: RootState) => state.messages.messages;
export const selectLastApiResponse = (state: RootState) => state.messages.lastApiResponse;
