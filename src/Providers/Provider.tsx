"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ThemeProvider } from "next-themes";
import store, { persistor } from "@/redux/store";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}
