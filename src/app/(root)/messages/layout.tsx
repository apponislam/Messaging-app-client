// app/message/layout.tsx

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import MessageClientLayout from "./MessageClientLayout";

export default async function MessageLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Server-side redirect if no refresh token
    if (!refreshToken) {
        redirect("/?redirect=/message");
    }

    return <MessageClientLayout>{children}</MessageClientLayout>;
}
