// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { Loader2 } from "lucide-react";
// import { currentToken } from "@/redux/features/auth/authSlice";

// export default function MessageClientLayout({ children }: { children: React.ReactNode }) {
//     const router = useRouter();
//     const token = useSelector(currentToken);

//     useEffect(() => {
//         // Client-side fallback protection
//         if (!token) {
//             router.push("/?redirect=/message");
//         }
//     }, [token, router]);

//     if (!token) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//         );
//     }

//     return <>{children}</>;
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { currentToken } from "@/redux/features/auth/authSlice";
import { useRefreshTokenMutation } from "@/redux/features/auth/authApi";

export default function MessageClientLayout({ children, hasRefreshToken }: { children: React.ReactNode; hasRefreshToken: boolean }) {
    const router = useRouter();
    const token = useSelector(currentToken);
    const [refreshToken] = useRefreshTokenMutation();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // If no token but we have refresh token, try to refresh
                if (!token && hasRefreshToken) {
                    const { data } = await refreshToken().unwrap();
                    if (!data?.accessToken) {
                        throw new Error("Refresh failed");
                    }
                    // Token refreshed successfully, will update via Redux
                    return;
                }

                // If no token and no refresh token, redirect immediately
                if (!token && !hasRefreshToken) {
                    throw new Error("No authentication");
                }
            } catch (error) {
                console.log(error);
                router.push("/?redirect=/message");
            } finally {
                setIsCheckingAuth(false);
            }
        };

        // Give it a small delay to allow for initial token load
        const timer = setTimeout(checkAuth, 300);
        return () => clearTimeout(timer);
    }, [token, hasRefreshToken, router, refreshToken]);

    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
