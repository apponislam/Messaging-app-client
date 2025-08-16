// import { io } from "socket.io-client";

// export const socket = io(process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000", {
//     transports: ["websocket"],
//     withCredentials: true,
// });

// import { io } from "socket.io-client";

// export const socket = io(process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000", {
//     transports: ["websocket"],
//     withCredentials: true,
//     auth: {
//         token: typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "",
//     },
// });

// export const connectSocket = () => socket.connect();
// export const disconnectSocket = () => socket.disconnect();

import { io } from "socket.io-client";
import { getAuthToken } from "../utils/auth";

// Create socket instance without auto-connect
export const socket = io(process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000", {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false,
});

// Modified connection function
export const connectSocket = () => {
    const token = getAuthToken();
    console.log("token", token);
    if (token) {
        socket.auth = { token };
        socket.connect();
    }
};

export const disconnectSocket = () => {
    socket.disconnect();
};
