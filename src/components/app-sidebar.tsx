"use client";
import { Users } from "lucide-react";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetMyProfileQuery } from "@/redux/features/user/userApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { memo, useMemo } from "react";
import { User } from "@/types/user";

// Memoized UserItem component to prevent unnecessary re-renders
const UserItem = memo(({ user }: { user: User }) => {
    const getInitials = (name?: string | null) => {
        if (!name) return "?";
        return name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0]?.toUpperCase() ?? "")
            .join("")
            .slice(0, 2);
    };

    return (
        <SidebarMenuItem key={user._id} className="hover:bg-muted/50 rounded-lg">
            <SidebarMenuButton asChild className="p-1 my-1 px-2 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus:outline-none focus-visible:ring-0 rounded-lg">
                <Link href={`/messages/${user._id}`} className="flex items-center gap-3 w-full h-auto">
                    <Avatar className="h-9 w-9 border-2 border-primary/10">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                    </div>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
});

UserItem.displayName = "UserItem";

export function AppSidebar() {
    const { data: usersResponse, isLoading, isError } = useGetAllUsersQuery({});
    const { data: currentUserResponse } = useGetMyProfileQuery({});

    // Memoize filtered users to prevent unnecessary recalculations
    const filteredUsers = useMemo(() => {
        if (!usersResponse?.data || !currentUserResponse?.data) return [];
        return usersResponse.data.filter((user: User) => user._id !== currentUserResponse.data._id);
    }, [usersResponse, currentUserResponse]);

    // Memoize skeleton items to maintain stable references
    const skeletonItems = useMemo(
        () =>
            Array(8)
                .fill(0)
                .map((_, i) => (
                    <SidebarMenuItem key={`skeleton-${i}`} className="px-3 py-2">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-32" />
                                <Skeleton className="h-2.5 w-24" />
                            </div>
                        </div>
                    </SidebarMenuItem>
                )),
        []
    );

    return (
        <Sidebar className="border-r ">
            <SidebarContent className="p-4 bg-white dark:bg-black">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 py-2 text-sm font-semibold flex items-center">
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-primary">Contacts</span>
                        <span className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs">{filteredUsers.length}</span>
                    </SidebarGroupLabel>

                    <SidebarGroupContent className="mt-2">
                        <SidebarMenu>
                            {isLoading ? (
                                skeletonItems
                            ) : isError ? (
                                <SidebarMenuItem className="px-3 py-4 text-center">
                                    <div className="text-sm text-muted-foreground">Failed to load contacts</div>
                                </SidebarMenuItem>
                            ) : (
                                filteredUsers.map((user: User) => <UserItem key={user._id} user={user} />)
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
