import type { Metadata } from "next";
import "../../globals.css";

import { redirect } from "next/navigation";
import { getAdminProfile } from "@/hooks/profile/useAdminProfile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Login",
    description: "Admin login page",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAdminLogin } = await getAdminProfile();

    if (isAdminLogin) {
        redirect("/");
    }

    return (
        <html lang="en">
            <body>
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}