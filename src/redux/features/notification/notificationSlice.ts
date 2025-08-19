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
//     apiNotifications: TNotification[];
//     socketNotifications: TNotification[];
//     unreadCount: number;
//     lastFetched: number | null;
// };

// const initialState: TNotificationState = {
//     apiNotifications: [],
//     socketNotifications: [],
//     unreadCount: 0,
//     lastFetched: null,
// };

// const notificationSlice = createSlice({
//     name: "notifications",
//     initialState,
//     reducers: {
//         setNotificationsFromApi: (state, action: PayloadAction<TNotificationApiResponse>) => {
//             state.apiNotifications = action.payload.data || [];
//             state.unreadCount = calculateUnreadCount([...state.apiNotifications, ...state.socketNotifications]);
//             state.lastFetched = Date.now();
//         },
//         addNotification: (state, action: PayloadAction<TNotification>) => {
//             // Check in both arrays more thoroughly
//             const exists = [...state.apiNotifications, ...state.socketNotifications].some((n) => n._id === action.payload._id && n.createdAt === action.payload.createdAt);

//             if (!exists) {
//                 state.socketNotifications = [action.payload, ...state.socketNotifications.filter((n) => n._id !== action.payload._id)];
//                 if (!action.payload.read) {
//                     state.unreadCount = calculateUnreadCount([...state.apiNotifications, ...state.socketNotifications]);
//                 }
//             }
//         },
//         markAsRead: (state, action: PayloadAction<string>) => {
//             let found = false;

//             state.socketNotifications = state.socketNotifications.map((n) => {
//                 if (n._id === action.payload && !n.read) {
//                     found = true;
//                     return { ...n, read: true };
//                 }
//                 return n;
//             });

//             state.apiNotifications = state.apiNotifications.map((n) => {
//                 if (n._id === action.payload && !n.read) {
//                     found = true;
//                     return { ...n, read: true };
//                 }
//                 return n;
//             });

//             if (found) {
//                 state.unreadCount = calculateUnreadCount([...state.apiNotifications, ...state.socketNotifications]);
//             }
//         },
//         markAllAsRead: (state) => {
//             state.socketNotifications = state.socketNotifications.map((n) => ({ ...n, read: true }));
//             state.apiNotifications = state.apiNotifications.map((n) => ({ ...n, read: true }));
//             state.unreadCount = 0;
//         },
//         clearNotifications: (state) => {
//             state.apiNotifications = [];
//             state.socketNotifications = [];
//             state.unreadCount = 0;
//             state.lastFetched = null;
//         },
//     },
// });

// const calculateUnreadCount = (notifications: TNotification[]): number => {
//     return notifications.filter((n) => !n.read).length;
// };

// export const { setNotificationsFromApi, addNotification, markAsRead, clearNotifications, markAllAsRead } = notificationSlice.actions;

// export const selectAllNotifications = (state: RootState): TNotification[] => {
//     return [...state.notifications.socketNotifications, ...state.notifications.apiNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
// };

// export const selectUnreadCount = (state: RootState): number => state.notifications.unreadCount;
// export const selectLastFetched = (state: RootState): number | null => state.notifications.lastFetched;

// export default notificationSlice.reducer;

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
    apiNotifications: TNotification[];
    socketNotifications: TNotification[];
    unreadCount: number;
    lastFetched: number | null;
};

const initialState: TNotificationState = {
    apiNotifications: [],
    socketNotifications: [],
    unreadCount: 0,
    lastFetched: null,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotificationsFromApi: (state, action: PayloadAction<TNotificationApiResponse>) => {
            state.apiNotifications = action.payload.data || [];
            state.unreadCount = calculateUnreadCount([...state.apiNotifications, ...state.socketNotifications]);
            state.lastFetched = Date.now();
        },
        addNotification: (state, action: PayloadAction<TNotification>) => {
            const exists = [...state.apiNotifications, ...state.socketNotifications].some((n) => n._id === action.payload._id && n.createdAt === action.payload.createdAt);
            if (!exists) {
                state.socketNotifications = [action.payload, ...state.socketNotifications];
                state.unreadCount = calculateUnreadCount([...state.apiNotifications, ...state.socketNotifications]);
            }
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            state.socketNotifications = state.socketNotifications.map((n) => (n._id === action.payload ? { ...n, read: true } : n));
            state.apiNotifications = state.apiNotifications.map((n) => (n._id === action.payload ? { ...n, read: true } : n));
            state.unreadCount = calculateUnreadCount([...state.apiNotifications, ...state.socketNotifications]);
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
            state.lastFetched = null;
        },
    },
});

const calculateUnreadCount = (notifications: TNotification[]): number => {
    return notifications.filter((n) => !n.read).length;
};

export const { setNotificationsFromApi, addNotification, markAsRead, clearNotifications, markAllAsRead } = notificationSlice.actions;

export const selectAllNotifications = (state: RootState): TNotification[] => {
    const combined = [...state.notifications.socketNotifications, ...state.notifications.apiNotifications];
    const unique = combined.filter((n, index, self) => index === self.findIndex((n2) => n2._id === n._id && n2.createdAt === n.createdAt));
    return unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const selectUnreadCount = (state: RootState): number => state.notifications.unreadCount;
export const selectLastFetched = (state: RootState): number | null => state.notifications.lastFetched;

export default notificationSlice.reducer;
