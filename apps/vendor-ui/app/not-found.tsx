"use client";

import { Home, SearchX } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <SearchX className="w-6 h-6 text-amber-600" />
            </div>
            <CardTitle className="text-xl">Page not found</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => router.back()}
              className="flex-1"
              variant="outline"
            >
              Go Back
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1"
              variant="default"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}