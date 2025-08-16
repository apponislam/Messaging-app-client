// messageApi.ts
import { baseApi } from "../../api/baseApi";
import { TMessage } from "./messageSlice";

export type TMessageApiResponse = {
    success: boolean;
    message: string;
    data: TMessage[];
};

const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMessagesWithUser: builder.query<TMessageApiResponse, string>({
            query: (userId) => `/message/${userId}`,
            providesTags: ["Messages"],
        }),
        sendMessage: builder.mutation<TMessage, { receiver: string; content: string }>({
            query: (body) => ({
                url: "/message",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Messages"],
        }),
    }),
});

export const { useGetMessagesWithUserQuery, useSendMessageMutation } = messageApi;
