import { logoFull } from "@repo/ui/assets";
import { Button } from "@repo/ui/components/button";
import React from "react";
import Image from "next/image";
import { CheckCircle, Link } from "lucide-react";

const Success = () => {
  return (
    <div className="w-full max-w-md mx-auto p-6 mt-10 space-y-6">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <Image src={logoFull} alt="Doorite Logo" width={100} height={100} />
          <div className="w-2 h-2 bg-primary rounded-full" />
          <h1 className="font-bold text-2xl">Password Updated!</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-lg font-semibold text-muted-foreground">
            Your password has been successfully updated
          </p>
          <p className="text-sm text-muted-foreground">
            You can now log in to your account with your new password
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-4">
        <Button size="lg" className="w-full" asChild>
          <Link href="/log-in">Continue to Log In</Link>
        </Button>

        <div className="text-center">
          <Link
            href="/landing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
