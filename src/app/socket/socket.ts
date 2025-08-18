import { io } from "socket.io-client";
// import { getAuthToken } from "../utils/auth";
import { currentToken } from "@/redux/features/auth/authSlice";
import store from "@/redux/store";

export const socket = io(process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000", {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false,
});

const getToken = () => currentToken(store.getState());
// Modified connection function
export const connectSocket = () => {
    const token = getToken();
    if (token) {
        socket.auth = { token };
        socket.connect();
    }
};

export const disconnectSocket = () => {
    socket.disconnect();
};
