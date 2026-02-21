"use client";

import { FC } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useRouter } from "next/navigation";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const DashboardError: FC<DashboardErrorProps> = ({ error, reset }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            We couldn&apos;t load your dashboard data. This might be a temporary
            issue.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-700 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={reset} className="flex-1" variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/log-in")}
              className="flex-1"
              variant="outline"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardError;
