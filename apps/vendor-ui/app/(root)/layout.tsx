import { SocketProvider } from "@/providers/socket";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/configs/api";
import { redirect } from "next/navigation";

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
    <div>
      <SocketProvider token={token}>{children}</SocketProvider>
    </div>
  );
}
