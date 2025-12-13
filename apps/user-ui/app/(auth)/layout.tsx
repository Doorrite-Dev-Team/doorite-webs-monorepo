// app/(home)/layout.tsx or wherever your HomeLayout sits
import Header from "@/components/tab-header";
import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <Header />

      {/* Give main enough top padding so content doesn't hide under fixed header */}
      <main className="pt-24 pb-24 max-w-md mx-auto px-4">{children}</main>
    </div>
  );
};

export default HomeLayout;
