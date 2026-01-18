import { SocketProvider } from "@/components/global/socket-init";
import { AppSidebar } from "@/components/navigations/app-sidebar";
import Header from "@/components/navigations/main-header";
import MobileNav from "@/components/navigations/mobile-bottom-nav";
import { getCookieHeader } from "@/libs/api-utils";
import { SidebarInset } from "@repo/ui/components/sidebar";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getCookieHeader(true);

  if (!token) {
    redirect("/log-in");
  }

  return (
    <SocketProvider token={token}>
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>

        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 w-full overflow-x-hidden">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
              {children}
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav />
        </SidebarInset>
      </div>
    </SocketProvider>
  );
}
