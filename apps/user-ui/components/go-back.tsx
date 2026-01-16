"use client"; // This directive marks the file as a Client Component

import { Button } from "@repo/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Button onClick={handleBack} variant="outline" size="lg" className="gap-2">
      <ArrowLeft className="w-4 h-4" />
      Go Back
    </Button>
  );
}
