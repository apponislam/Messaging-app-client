import { ModeToggle } from "@/components/darkModeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/forms/user-login-form";
import { RegistrationForm } from "@/components/forms/user-registration-form";

export default function Home() {
    return (
        <div className="container mx-auto">
            <div className="min-h-screen flex flex-col">
                {/* Header with ModeToggle (no border) */}
                <header className="py-4 px-6 flex justify-between items-center">
                    <h1 className="text-xl font-m-300 italic">Messaging App</h1>
                    <ModeToggle />
                </header>

                {/* Centered tabs */}
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-[400px] bg-card rounded-lg shadow-sm border p-6">
                        <Tabs defaultValue="login">
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="login">Log In</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="pt-4">
                                <LoginForm />
                            </TabsContent>
                            <TabsContent value="register" className="pt-4">
                                <RegistrationForm />
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
}
