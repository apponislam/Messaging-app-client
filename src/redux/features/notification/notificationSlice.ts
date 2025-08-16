import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type NotificationType = "message" | "friend_request" | "system";

export type TNotification = {
    _id: string;
    userId: string;
    type: NotificationType;
    message: string;
    read: boolean;
    createdAt: string;
    updatedAt?: string;
    sender?: {
        _id: string;
        name: string;
        avatarUrl?: string;
    };
    messageId?: string;
    requestId?: string;
};

export type TNotificationApiResponse = {
    success: boolean;
    message: string;
    data: TNotification[];
};

type TNotificationState = {
    notifications: TNotification[];
    unreadCount: number;
    lastApiResponse?: TNotificationApiResponse;
};

const initialState: TNotificationState = {
    notifications: [],
    unreadCount: 0,
    lastApiResponse: undefined,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotificationsFromApi: (state, action: PayloadAction<TNotificationApiResponse>) => {
            state.lastApiResponse = action.payload;
            state.notifications = action.payload.data || [];

            // Calculate unread count directly from server data
            state.unreadCount = state.notifications.filter((n) => !n.read).length;
        },
        // In your notificationSlice.ts
        addNotification: (state, action: PayloadAction<TNotification>) => {
            // Check if notification already exists
            const existingIndex = state.notifications.findIndex((n) => n._id === action.payload._id);

            if (existingIndex >= 0) {
                // Update existing notification but preserve read status
                state.notifications[existingIndex] = {
                    ...action.payload,
                    read: state.notifications[existingIndex].read,
                };
            } else {
                // Add new notification at the beginning
                state.notifications.unshift(action.payload);
            }

            // Recalculate unread count
            state.unreadCount = state.notifications.filter((n) => !n.read).length;
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find((n) => n._id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount = state.notifications.filter((n) => !n.read).length;
            }
        },
        markAllAsRead: (state) => {
            state.notifications = state.notifications.map((n) => ({
                ...n,
                read: true,
            }));
            state.unreadCount = 0;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.lastApiResponse = undefined;
        },
    },
});

export const { setNotificationsFromApi, addNotification, markAsRead, clearNotifications, markAllAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;

// Selectors
export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectLastNotificationResponse = (state: RootState) => state.notifications.lastApiResponse;
