import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/darkModeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="flex items-center justify-between p-3 border-b border">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />
                        <h1 className="text-xl font-m-300 italic">Messaging App</h1>
                    </div>
                    <ModeToggle></ModeToggle>
                </div>
                <div className="p-3">{children}</div>
            </main>
        </SidebarProvider>
    );
}
