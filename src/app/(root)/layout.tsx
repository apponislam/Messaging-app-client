import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/darkModeToggle";
import { NotificationBell } from "@/components/notificationCounter";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-profile";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />
                        <h1 className="text-xl font-m-300 italic">Messaging App</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* <Bell /> */}
                        <NotificationBell></NotificationBell>
                        <ModeToggle></ModeToggle>
                        <UserDropdown></UserDropdown>
                    </div>
                </div>
                <>{children}</>
            </main>
        </SidebarProvider>
    );
}
