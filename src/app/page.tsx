// import { ModeToggle } from "@/components/darkModeToggle";
// import { LoginForm } from "@/components/forms/user-login-form";
// import { RegistrationForm } from "@/components/forms/user-registration-form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function Home() {
//     return (
//         <div className="container mx-auto">
//             <div>
//                 <div className="flex items-center justify-between py-4">
//                     <h1 className="md:text-xl font-m-300 italic">Messaging App</h1>
//                     <ModeToggle></ModeToggle>
//                 </div>
//                 <div>
//                     <Tabs defaultValue="login" className="w-[400px]">
//                         <TabsList>
//                             <TabsTrigger value="login">Account</TabsTrigger>
//                             <TabsTrigger value="register">Register</TabsTrigger>
//                         </TabsList>
//                         <TabsContent value="login">
//                             <LoginForm></LoginForm>
//                         </TabsContent>
//                         <TabsContent value="register">
//                             <RegistrationForm></RegistrationForm>
//                         </TabsContent>
//                     </Tabs>
//                 </div>
//             </div>
//         </div>
//     );
// }
// import { ModeToggle } from "@/components/darkModeToggle";
// import { LoginForm } from "@/components/forms/user-login-form";
// import { RegistrationForm } from "@/components/forms/user-registration-form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function Home() {
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4">
//             <div className="w-full max-w-md">
//                 <div className="bg-card rounded-lg shadow-sm border p-6">
//                     {/* Header */}
//                     <div className="flex items-center justify-between mb-6">
//                         <h1 className="text-xl font-m-300 italic">Messaging App</h1>
//                         <ModeToggle />
//                     </div>

//                     {/* Tabs with card styling */}
//                     <Tabs defaultValue="login">
//                         <TabsList className="grid grid-cols-2 mb-4">
//                             <TabsTrigger value="login">Login</TabsTrigger>
//                             <TabsTrigger value="register">Register</TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="login" className="pt-4">
//                             <div className="space-y-4">
//                                 <LoginForm />
//                             </div>
//                         </TabsContent>

//                         <TabsContent value="register" className="pt-4">
//                             <div className="space-y-4">
//                                 <RegistrationForm />
//                             </div>
//                         </TabsContent>
//                     </Tabs>
//                 </div>
//             </div>
//         </div>
//     );
// }
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
