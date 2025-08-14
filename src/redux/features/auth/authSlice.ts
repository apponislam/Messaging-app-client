import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
};

type TAuthState = {
    user: null | TUser;
    token: null | string;
};

const initialState: TAuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const currentToken = (state: RootState) => state.auth.token;
export const currentUser = (state: RootState) => state.auth.user;
