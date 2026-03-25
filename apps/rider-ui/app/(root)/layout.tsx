import { SocketProvider } from "@/providers/socket";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME } from "@/libs/api-utils";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME.ACCESS)?.value;

    if (!token) {
        redirect("/login");
    }

    return (
        <SocketProvider token={token}>
            {children}
        </SocketProvider>
    );
}
