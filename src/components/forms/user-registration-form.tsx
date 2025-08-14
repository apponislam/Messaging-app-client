"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    avatarUrl: z.string().url().optional(),
});

export function RegistrationForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [register, { isLoading: isSubmitting }] = useRegisterMutation();
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            avatarUrl: "",
        },
    });

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            // 5MB limit
            toast.error("Image must be less than 5MB");
            return;
        }

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
            formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Upload failed");
            }

            const data = await response.json();
            form.setValue("avatarUrl", data.secure_url);
            toast.success("Avatar uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to upload avatar");
            setPreview(null);
            form.setValue("avatarUrl", "");
        } finally {
            setIsUploading(false);
            URL.revokeObjectURL(previewUrl);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await register(values).unwrap();
            dispatch(
                setUser({
                    user: response.data.user,
                    token: response.data.token,
                })
            );
            toast.success("Account created!", {
                description: "Registration successful",
                duration: 2000,
            });
            // Redirect to login or dashboard
            router.push("/messages");
        } catch (error: unknown) {
            let errorMessage = "Invalid credentials";

            if (typeof error === "object" && error !== null && "data" in error) {
                const apiError = error as { data?: { message?: string } };
                errorMessage = apiError.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Login failed", {
                description: errorMessage,
                duration: 2000,
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="johndoe123" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Avatar</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-4">
                                    {preview && (
                                        <div className="relative h-16 w-16">
                                            <Image src={preview} alt="Preview" className="rounded-full object-cover border" fill sizes="64px" onLoad={() => URL.revokeObjectURL(preview)} unoptimized />
                                            <button
                                                type="button"
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                onClick={() => {
                                                    setPreview(null);
                                                    form.setValue("avatarUrl", "");
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = "";
                                                    }
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    <Button type="button" variant="outline" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
                                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                        {field.value ? "Change" : "Upload"} Avatar
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Register"
                    )}
                </Button>
            </form>
        </Form>
    );
}
