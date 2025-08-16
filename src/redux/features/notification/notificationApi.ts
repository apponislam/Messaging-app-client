import { baseApi } from "../../api/baseApi";
import { TNotification } from "./notificationSlice";

export type TNotificationApiResponse = {
    success: boolean;
    message: string;
    data: TNotification[];
};

const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyNotifications: builder.query<TNotificationApiResponse, void>({
            query: () => "/notification",
            providesTags: ["Notification"],
        }),
        markAsRead: builder.mutation<TNotification, string>({
            query: (id) => ({
                url: `/notification/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const { useGetMyNotificationsQuery, useMarkAsReadMutation } = notificationApi;
