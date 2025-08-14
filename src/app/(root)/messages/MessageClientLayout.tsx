"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { currentToken } from "@/redux/features/auth/authSlice";

export default function MessageClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const token = useSelector(currentToken);

    useEffect(() => {
        // Client-side fallback protection
        if (!token) {
            router.push("/?redirect=/message");
        }
    }, [token, router]);

    if (!token) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
