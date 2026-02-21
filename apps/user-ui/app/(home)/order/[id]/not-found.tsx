import Link from "next/link";
import { PackageX, ArrowLeft, Home } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";

export default function OrderNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <PackageX className="w-10 h-10 text-gray-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find the order you&apos;re looking for. It may have
            been cancelled or the link might be incorrect.
          </p>

          <div className="space-y-3">
            <Link href="/order" className="block">
              <Button className="w-full gap-2" size="lg">
                <ArrowLeft className="w-4 h-4" />
                View All Orders
              </Button>
            </Link>

            <Link href="/home" className="block">
              <Button variant="outline" className="w-full gap-2" size="lg">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Need help?{" "}
            <a href="/support" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
