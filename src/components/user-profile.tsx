"use client";
import { useAppDispatch } from "@/redux/hooks";
import { logOut } from "@/redux/features/auth/authSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyProfileQuery } from "@/redux/features/user/userApi";
import Link from "next/link";

export function UserDropdown() {
    const { data: apiResponse, isLoading, isError } = useGetMyProfileQuery({});
    const dispatch = useAppDispatch();

    // Extract user data from the API response
    const user = apiResponse?.data;
    const userName = user?.name || "User";
    const userEmail = user?.email || "";
    const avatarUrl = user?.avatarUrl || "";

    const handleLogout = () => {
        dispatch(logOut());
    };

    const getInitials = (name?: string | null) => {
        if (!name) return "?";
        return name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0]?.toUpperCase() ?? "")
            .join("")
            .slice(0, 2);
    };

    if (isLoading) {
        return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    if (isError || !user) {
        return (
            <Button variant="outline" asChild>
                <Link href="/">Login</Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0" aria-label="User menu">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl} alt={`${userName}'s avatar`} />
                        <AvatarFallback delayMs={600}>{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount sideOffset={8}>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none truncate">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
