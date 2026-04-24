"use client";

import React from "react";
import { Button } from "@repo/ui/components/button";
import { Ticket } from "lucide-react";
import Link from "next/link";

export default function ReferralPromo() {
  return (
    <section className="py-16 px-4 bg-muted/30 rounded-3xl my-12 text-center border border-border">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="p-3 bg-primary/10 rounded-full">
            <Ticket className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Invite Friends, Get Rewards
        </h2>
        <p className="text-muted-foreground text-lg">
          Share your referral code with friends and earn free delivery orders
          whenever they join Doorite.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/sign-up">
            <Button size="lg" className="px-8">
              Join Doorite Now
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground italic">
            Use a friend's code during signup for an instant bonus!
          </p>
        </div>
      </div>
    </section>
  );
}
