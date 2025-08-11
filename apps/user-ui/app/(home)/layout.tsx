// app/(home)/layout.tsx or wherever your HomeLayout sits
import React from "react";
import Header from "../../components/tabHeader";
import TabNavication from "../../components/tabNavication";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full">
      <Header />

      {/* Give main enough top padding so content doesn't hide under fixed header */}
      <main className="pt-24 pb-24 max-w-5xl mx-auto px-4">{children}</main>

      {/* Tab nav (assumes it's fixed to bottom) */}
      <TabNavication />
    </div>
  );
};

export default HomeLayout;
