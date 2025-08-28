// app/(home)/layout.tsx or wherever your HomeLayout sits
import Header from "@/components/tab-header";
import TabNavication from "@/components/tab-navication";
import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full">
      <Header />

      {/* Give main enough top padding so content doesn't hide under fixed header */}
      <main className="py-4 max-w-5xl mx-auto px-4">{children}</main>

      {/* Tab nav (assumes it's fixed to bottom) */}
      <TabNavication />
    </div>
  );
};

export default HomeLayout;
