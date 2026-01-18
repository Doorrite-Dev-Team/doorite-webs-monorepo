// app/not-found.tsx
import Link from "next/link";
import { Home, UtensilsCrossed } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import BackButton from "@/components/navigations/go-back";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Icon */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary/5 rounded-full animate-pulse" />
          </div>
          <div className="relative flex items-center justify-center py-8">
            <UtensilsCrossed className="w-20 h-20 text-primary/70" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="space-y-3">
          <h1 className="text-7xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/home">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <BackButton />
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Looking for something?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/vendor" className="text-primary hover:underline">
              Browse Restaurants
            </Link>
            <Link href="/order" className="text-primary hover:underline">
              My Orders
            </Link>
            <Link href="/account" className="text-primary hover:underline">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
