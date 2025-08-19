import { cookies } from "next/headers";
import MessageClientLayout from "./MessageClientLayout";

export default async function MessageLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Server-side check for refresh token only
    return <MessageClientLayout hasRefreshToken={!!refreshToken}>{children}</MessageClientLayout>;
}
