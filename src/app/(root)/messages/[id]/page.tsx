"use client";
import { use, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useGetMyProfileQuery, useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { useGetMessagesWithUserQuery, useSendMessageMutation } from "@/redux/features/message/messageApi";
import { connectSocket, disconnectSocket, socket } from "@/app/socket/socket";
// import { getAuthToken } from "@/app/utils/auth";
import { useSelector } from "react-redux";
import { currentToken } from "@/redux/features/auth/authSlice";
// import { CallButton } from "@/components/callButton";

interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
}

interface ApiMessage {
    _id: string;
    sender: User;
    receiver: User;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

interface UIMessage {
    id: string;
    text: string;
    sender: "me" | "them";
    timestamp: string;
    user: User;
}

export default function MessagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: currentUser } = useGetMyProfileQuery({});
    const currentUserId = currentUser?.data?._id;
    const [newMessage, setNewMessage] = useState("");
    const router = useRouter();

    // 1. Add this state to track real-time messages
    const [liveMessages, setLiveMessages] = useState<ApiMessage[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // 2. Keep your existing query
    const { data: apiResponse, isLoading, isError, refetch } = useGetMessagesWithUserQuery(id);
    const apiMessages: ApiMessage[] = apiResponse?.data || [];
    const [sendMessage] = useSendMessageMutation();

    const token = useSelector(currentToken);
    useEffect(() => {
        // const token = getAuthToken();

        const handleConnect = () => {
            // console.log("Socket connected!");
        };

        const handleConnectError = (err: Error) => {
            console.log("Socket connection error:", err.message);
        };

        if (token) {
            connectSocket();
            socket.on("connect", handleConnect);
            socket.on("connect_error", handleConnectError);
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            disconnectSocket();
        };
    }, [token]);

    // 2. Real-time message handling
    useEffect(() => {
        const handleNewMessage = (message: ApiMessage) => {
            // Add to live messages immediately
            setLiveMessages((prev) => [...prev, message]);

            // Optional: Refetch to sync with server
            if (message.sender._id === id || message.receiver._id === id) {
                refetch();
            }
        };

        socket.on("newMessage", handleNewMessage);
        // socket.on("newNotification", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
            // socket.off("newNotification", handleNewMessage);
        };
    }, [id, refetch]);

    // Auto-scroll to bottom

    // const token = getAuthToken();
    // console.log(token);

    // console.log("socket connected", socket.connected);

    // 4. Combine API and live messages (no duplicates)
    const allMessages = [...apiMessages, ...liveMessages.filter((liveMsg) => !apiMessages.some((apiMsg) => apiMsg._id === liveMsg._id))];

    // 5. Keep your existing send function
    const handleSend = async () => {
        if (newMessage.trim() && currentUserId) {
            try {
                await sendMessage({
                    receiver: id,
                    content: newMessage,
                }).unwrap();
                setNewMessage("");
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
    };

    // 6. Keep your existing UI conversion
    const messages: UIMessage[] = allMessages.map((msg) => ({
        id: msg._id,
        text: msg.content,
        sender: msg.sender._id === currentUserId ? "me" : "them",
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        user: msg.sender._id === currentUserId ? msg.receiver : msg.sender,
    }));

    useEffect(() => {
        if (messages.length > 0) {
            // For initial load, scroll immediately without animation
            if (isInitialLoad) {
                messagesEndRef.current?.scrollIntoView();
                setIsInitialLoad(false);
            }
            // For subsequent updates, use smooth scrolling
            else {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [messages, isInitialLoad]);

    // console.log(messages);

    // Get other user data
    const { data: otherUserResponse } = useGetUserByIdQuery(id, {
        skip: !id, // Skip if no conversation ID
    });

    // Determine the other user
    const otherUser = otherUserResponse?.data || (apiMessages[0]?.sender._id === currentUserId ? apiMessages[0]?.receiver : apiMessages[0]?.sender);

    if (isLoading) return <div className="flex-1 flex items-center justify-center">Loading...</div>;
    if (isError) return <div className="flex-1 flex items-center justify-center">Error loading messages</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="border-b p-4 flex items-center justify-between sticky top-0 bg-background z-10">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={otherUser?.avatarUrl} />
                        <AvatarFallback>
                            {otherUser?.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-medium">{otherUser?.name || "Unknown"}</h2>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* <CallButton recipientId={id} type="audio" /> */}
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-3">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message input */}
            <div className="sticky bottom-0 bg-background border-t p-4">
                <div className="flex gap-2">
                    <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                    <Button onClick={handleSend} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface MessageBubbleProps {
    message: UIMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
    return (
        <div className={`flex items-end gap-2 ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            {message.sender === "them" && (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={message.user.avatarUrl} />
                    <AvatarFallback>
                        {message.user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={`max-w-[75%] rounded-lg p-3 ${message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{message.timestamp}</p>
            </div>

            {message.sender === "me" && (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={message.user.avatarUrl} />
                    <AvatarFallback>
                        {message.user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}
