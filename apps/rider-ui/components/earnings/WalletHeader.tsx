"use client";

import { ArrowLeft, DollarSign } from "lucide-react";

export default function WalletHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-background-light dark:bg-background-dark">
      <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark">
        <ArrowLeft />
      </button>

      <h2 className="text-lg font-bold">My Funds</h2>

      <button className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm">
        <DollarSign className="text-primary" />
      </button>
    </header>
  );
}
