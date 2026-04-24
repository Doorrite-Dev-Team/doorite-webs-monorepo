"use client";

import React from "react";
import { useUser } from "@/hooks/use-user";
import { Ticket, Copy, UserPlus } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import Link from "next/link";

export function ReferralCard() {
  const { user } = useUser();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Referral code copied!");
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  if (!user) {
    return (
      <div className="px-4 sm:px-6 my-6">
        <Link
          href="/sign-up"
          className={cn(
            "flex items-center justify-between",
            "bg-gradient-to-r from-blue-600 to-indigo-700",
            "rounded-2xl px-5 py-4 shadow-md shadow-blue-200/60",
            "hover:shadow-lg hover:shadow-blue-200/80 active:scale-[0.98]",
            "transition-all duration-200 touch-manipulation",
          )}
        >
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <UserPlus className="w-4 h-4 text-white" />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                Get Rewards
              </span>
            </div>
            <p className="text-white font-bold text-lg leading-tight">
              Join Doorite and earn
              <br />
              free deliveries
            </p>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shrink-0">
            <Ticket className="w-5 h-5 text-white" />
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 my-6">
      <div
        className={cn(
          "flex items-center justify-between",
          "bg-gradient-to-r from-purple-600 to-indigo-700",
          "rounded-2xl px-5 py-4 shadow-md shadow-purple-200/60",
          "transition-all duration-200",
        )}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Ticket className="w-4 h-4 text-white" />
            <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
              Your Referral Code
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-white font-mono font-bold text-xl">
              {user.referralCode || "N/A"}
            </p>
            <button
              onClick={() => copyToClipboard(user.referralCode || "")}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              aria-label="Copy referral code"
            >
              <Copy className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-xs font-medium leading-tight">
            Invite friends for
            <br />
            free orders!
          </p>
        </div>
      </div>
    </div>
  );
}
