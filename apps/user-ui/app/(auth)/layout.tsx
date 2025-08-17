// app/(home)/layout.tsx or wherever your HomeLayout sits
import React from "react";
import Header from "../../components/tabHeader";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full">
      <Header />

      {/* Give main enough top padding so content doesn't hide under fixed header */}
      <main className="pt-24 pb-24 max-w-5xl mx-auto px-4">{children}</main>
    </div>
  );
};

export default HomeLayout;
