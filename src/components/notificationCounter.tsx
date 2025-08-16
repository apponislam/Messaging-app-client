"use client";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetMyNotificationsQuery, useMarkAsReadMutation } from "@/redux/features/notification/notificationApi";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { addNotification, selectUnreadCount, setNotificationsFromApi, TNotification } from "@/redux/features/notification/notificationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { socket } from "@/app/socket/socket";

export function NotificationBell() {
    const dispatch = useAppDispatch();
    const { data: notificationsResponse, refetch } = useGetMyNotificationsQuery();
    const [markAsRead] = useMarkAsReadMutation();
    const unreadCount = useAppSelector(selectUnreadCount);
    const [open, setOpen] = useState(false);

    const notifications = notificationsResponse?.data || [];

    // In your NotificationBell component
    useEffect(() => {
        // Initial fetch
        refetch();

        const handleNewNotification = (notification: TNotification) => {
            dispatch(
                addNotification({
                    ...notification,
                    read: false,
                })
            );

            // Optional: Play notification sound
            // new Audio("/notification.mp3").play().catch(console.error);
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, [dispatch, refetch]);

    console.log("notification", socket);

    // Handle API response
    useEffect(() => {
        if (notificationsResponse) {
            dispatch(setNotificationsFromApi(notificationsResponse));
        }
    }, [notificationsResponse, dispatch]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id).unwrap();
            refetch(); // Refresh notifications after marking as read
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await Promise.all(notifications.filter((n) => !n.read).map((n) => markAsRead(n._id).unwrap()));
            refetch();
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => refetch()}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" forceMount>
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h2 className="text-sm font-medium">Notifications</h2>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs" onClick={handleMarkAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-72">
                    {notifications.length === 0 ? (
                        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No notifications</div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div key={notification._id} className={cn("px-4 py-3 hover:bg-muted/50 cursor-pointer", !notification.read && "bg-muted/30")} onClick={() => handleMarkAsRead(notification._id)}>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">{!notification.read && <span className="block h-2 w-2 rounded-full bg-primary" />}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
