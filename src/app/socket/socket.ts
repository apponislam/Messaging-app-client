import { io } from "socket.io-client";
import { getAuthToken } from "../utils/auth";

export const socket = io(process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000", {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false,
});

// Modified connection function
export const connectSocket = () => {
    const token = getAuthToken();
    if (token) {
        socket.auth = { token };
        socket.connect();
    }
};

export const disconnectSocket = () => {
    socket.disconnect();
};
