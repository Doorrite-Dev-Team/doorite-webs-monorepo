// app/(home)/layout.tsx or wherever your HomeLayout sits
import { AppSidebar } from "@/components/navigations/app-sidebar";
import Header from "@/components/navigations/main-header";
import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default HomeLayout;
