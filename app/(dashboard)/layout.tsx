import type { Metadata } from "next";
import "../globals.css";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { redirect } from "next/navigation";
import { getAdminProfile } from "@/hooks/profile/useAdminProfile";
import AppSidebar from "@/components/sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "dashboard",
    description: "dashboard upload / analyze operation",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAdminLogin } = await getAdminProfile();

    if (!isAdminLogin) {
        redirect("/login");
    }

    return (
        <html lang="en">
            <body>
                <SidebarProvider>
                    <AppSidebar />
                    <main>
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider>
            </body>
        </html>
    );
}