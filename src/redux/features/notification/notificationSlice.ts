// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "../../store";

// export type NotificationType = "message" | "friend_request" | "system";

// export type TNotification = {
//     _id: string;
//     userId: string;
//     type: NotificationType;
//     message: string;
//     read: boolean;
//     createdAt: string;
//     updatedAt?: string;
//     sender?: {
//         _id: string;
//         name: string;
//         avatarUrl?: string;
//     };
//     messageId?: string;
//     requestId?: string;
// };

// export type TNotificationApiResponse = {
//     success: boolean;
//     message: string;
//     data: TNotification[];
// };

// type TNotificationState = {
//     notifications: TNotification[];
//     unreadCount: number;
//     lastApiResponse?: TNotificationApiResponse;
// };

// const initialState: TNotificationState = {
//     notifications: [],
//     unreadCount: 0,
//     lastApiResponse: undefined,
// };

// const notificationSlice = createSlice({
//     name: "notifications",
//     initialState,
//     reducers: {
//         setNotificationsFromApi: (state, action: PayloadAction<TNotificationApiResponse>) => {
//             state.lastApiResponse = action.payload;
//             state.notifications = action.payload.data || [];

//             // Calculate unread count directly from server data
//             state.unreadCount = state.notifications.filter((n) => !n.read).length;
//         },
//         // In your notificationSlice.ts
//         addNotification: (state, action: PayloadAction<TNotification>) => {
//             // Check if notification already exists
//             const existingIndex = state.notifications.findIndex((n) => n._id === action.payload._id);

//             if (existingIndex >= 0) {
//                 // Update existing notification but preserve read status
//                 state.notifications[existingIndex] = {
//                     ...action.payload,
//                     read: state.notifications[existingIndex].read,
//                 };
//             } else {
//                 // Add new notification at the beginning
//                 state.notifications.unshift(action.payload);
//             }

//             // Recalculate unread count
//             state.unreadCount = state.notifications.filter((n) => !n.read).length;
//         },
//         markAsRead: (state, action: PayloadAction<string>) => {
//             const notification = state.notifications.find((n) => n._id === action.payload);
//             if (notification && !notification.read) {
//                 notification.read = true;
//                 state.unreadCount = state.notifications.filter((n) => !n.read).length;
//             }
//         },
//         markAllAsRead: (state) => {
//             state.notifications = state.notifications.map((n) => ({
//                 ...n,
//                 read: true,
//             }));
//             state.unreadCount = 0;
//         },
//         clearNotifications: (state) => {
//             state.notifications = [];
//             state.unreadCount = 0;
//             state.lastApiResponse = undefined;
//         },
//     },
// });

// export const { setNotificationsFromApi, addNotification, markAsRead, clearNotifications, markAllAsRead } = notificationSlice.actions;

// export default notificationSlice.reducer;

// // Selectors
// export const selectNotifications = (state: RootState) => state.notifications.notifications;
// export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
// export const selectLastNotificationResponse = (state: RootState) => state.notifications.lastApiResponse;

// notificationSlice.ts
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
    apiNotifications: TNotification[]; // From API calls
    socketNotifications: TNotification[]; // From socket.io
    unreadCount: number;
};

const initialState: TNotificationState = {
    apiNotifications: [],
    socketNotifications: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotificationsFromApi: (state, action: PayloadAction<TNotificationApiResponse>) => {
            state.apiNotifications = action.payload.data || [];
            state.unreadCount = calculateUnreadCount([...state.apiNotifications, ...state.socketNotifications]);
        },
        addNotification: (state, action: PayloadAction<TNotification>) => {
            // Check if notification exists in either array
            const exists = [...state.apiNotifications, ...state.socketNotifications].some((n) => n._id === action.payload._id);

            if (!exists) {
                state.socketNotifications.unshift(action.payload);
                if (!action.payload.read) {
                    state.unreadCount += 1;
                }
            }
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            let found = false;

            // Check in socket notifications
            state.socketNotifications = state.socketNotifications.map((n) => {
                if (n._id === action.payload && !n.read) {
                    found = true;
                    return { ...n, read: true };
                }
                return n;
            });

            // Check in API notifications
            state.apiNotifications = state.apiNotifications.map((n) => {
                if (n._id === action.payload && !n.read) {
                    found = true;
                    return { ...n, read: true };
                }
                return n;
            });

            if (found) {
                state.unreadCount = calculateUnreadCount([...state.apiNotifications, ...state.socketNotifications]);
            }
        },
        markAllAsRead: (state) => {
            state.socketNotifications = state.socketNotifications.map((n) => ({ ...n, read: true }));
            state.apiNotifications = state.apiNotifications.map((n) => ({ ...n, read: true }));
            state.unreadCount = 0;
        },
        clearNotifications: (state) => {
            state.apiNotifications = [];
            state.socketNotifications = [];
            state.unreadCount = 0;
        },
    },
});

// Helper function to calculate unread count
const calculateUnreadCount = (notifications: TNotification[]): number => {
    return notifications.filter((n) => !n.read).length;
};

export const { setNotificationsFromApi, addNotification, markAsRead, clearNotifications, markAllAsRead } = notificationSlice.actions;

// Selectors
export const selectAllNotifications = (state: RootState): TNotification[] => {
    return [...state.notifications.socketNotifications, ...state.notifications.apiNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const selectUnreadCount = (state: RootState): number => state.notifications.unreadCount;

export default notificationSlice.reducer;
