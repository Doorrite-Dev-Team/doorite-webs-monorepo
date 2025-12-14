import Header from "@/components/tab-header";
import BottomNav from "@/components/mobile-bottom-nav";

import React from "react";
export const dynamic = "force-dynamic";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex">
      {/* Sidebar for desktop */}
      {/* <aside className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 border-r bg-white z-40">
        <TabNavigation />
      </aside> */}
      <BottomNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* ✅ No toggleSidebar prop anymore */}
        <Header />

        {/* Spacer for fixed header */}
        <div className="h-16" />

        <main className="py-4 px-4 md:ml-64 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
