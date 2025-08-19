"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { currentToken } from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const accessToken = useSelector(currentToken);

    useEffect(() => {
        if (accessToken && pathname === "/") {
            router.replace("/messages");
        }
    }, [accessToken, pathname, router]);

    return <>{children}</>;
}
