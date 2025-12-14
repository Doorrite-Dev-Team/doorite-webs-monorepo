"use client";

import * as React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Share2, Copy, Check } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card"; // Added CardHeader/Title for better structure
import { toast } from "@repo/ui/components/sonner";
import { Skeleton } from "@repo/ui/components/skeleton"; // Assuming a Skeleton component exists in your repo/ui

interface QRCodeGeneratorProps {
  value: string; // The verification code fetched from the server /orders/:orderId/verification
  orderId?: string;
  size?: number;
  title?: string;
  description?: string;
  showActions?: boolean;
  isLoading?: boolean; // New prop to indicate if the data is being fetched by the parent
}

export default function QRCodeGenerator({
  value,
  orderId,
  size = 256,
  title = "Scan QR Code",
  description,
  showActions = true,
  isLoading = false, // Default to false
}: QRCodeGeneratorProps) {
  const [copied, setCopied] = React.useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

  // Download QR code as PNG
  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) {
      toast.error("Error", {
        description: "Could not find QR canvas for download.",
      });
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${orderId || "delivery"}.png`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Downloaded", {
        description: "QR code saved to your device",
      });
    }, "image/png"); // Explicitly specify image type
  };

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      if (!value) throw new Error("Verification value is missing.");

      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast.success("Copied", {
        description: "Verification code copied to clipboard",
      });
    } catch (error) {
      const errorMessage = (error as Error).message || "Unknown error";
      toast.error("Error", {
        description: `Failed to copy code: ${errorMessage}`,
      });
    }
  };

  // Share QR code
  const handleShare = async () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) {
      toast.error("Error", {
        description: "Could not find QR canvas for sharing.",
      });
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `qr-code-${orderId || "delivery"}.png`, {
          type: "image/png",
        });

        // Use the Web Share API if available and can share files
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Delivery Verification QR Code",
            text: `Verification code: ${value}`,
            files: [file],
          });

          toast.success("Shared", {
            description: "QR code shared successfully",
          });
        } else {
          // Fallback to download if Web Share API is not supported or cannot share files
          toast.info("Sharing not supported", {
            description: "Falling back to download.",
          });
          handleDownload();
        }
      }, "image/png"); // Explicitly specify image type
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Share Failed", {
        description: "An error occurred during sharing.",
      });
    }
  };

  // Render Skeleton while loading
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 sm:p-8 space-y-6 flex flex-col items-center">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
          <div className="inline-block p-6 bg-white rounded-2xl border-4 border-gray-100 shadow-sm">
            <Skeleton
              style={{ width: size, height: size }}
              className="rounded-lg"
            />
          </div>
          <Skeleton className="h-4 w-1/3" />
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t w-full">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render content once loaded
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center space-y-6">
          {/* Title and Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>

          {/* QR Code Display */}
          <div className="inline-block p-6 bg-white rounded-2xl border-4 border-gray-100 shadow-sm">
            {/* The QR code wrapper ref is here */}
            <div ref={qrRef}>
              <QRCodeCanvas
                value={value}
                size={size}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo.png", // Optional: Add your logo in the center
                  height: size * 0.15,
                  width: size * 0.15,
                  excavate: true,
                }}
              />
            </div>
          </div>

          {/* Verification Code Display and Copy Button */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">
              Verification Code
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-3xl font-bold text-primary tracking-wider bg-primary/5 px-6 py-3 rounded-lg">
                {value}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-2"
                aria-label={copied ? "Copied" : "Copy verification code"}
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>

              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="text-left space-y-2 p-4 bg-blue-50 rounded-lg text-sm">
            <p className="font-semibold text-blue-900">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Show this QR code to the delivery rider</li>
              <li>The rider will scan it to confirm delivery</li>
              <li>Your order will be marked as delivered</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
