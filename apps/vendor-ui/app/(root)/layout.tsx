import { SocketProvider } from "@/providers/socket";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/configs/api";
import { redirect } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import UrgentOrderDialog from "@/components/urgent-notification";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doorite Vendor",
  description: "Vendor interface for Doorite",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME.ACCESS)?.value;

  if (!token) {
    redirect("/log-in");
  }

  return (
    <SocketProvider token={token}>
      <Navbar>
        {children}
        <UrgentOrderDialog />
      </Navbar>
    </SocketProvider>
  );
}
