// src/components/LogoUpload.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Loader2, Image as ImageIcon, Check, Upload } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

interface LogoUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploadMode, setUploadMode] = useState<"button" | "dropzone">(
    "dropzone",
  );

  // Keep local preview in sync with the incoming prop `value`
  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    setIsUploading(false);
    toast.success("Logo removed");
  };

  // helper to handle upload results in one place
  const handleUploadComplete = (res: any[] | undefined) => {
    // always clear uploading state
    setIsUploading(false);

    if (!res || res.length === 0) {
      toast.error("Upload completed but no file returned.");
      console.debug("Upload result empty:", res);
      return;
    }

    // `ufsUrl` was used previously; keep the same extraction
    const url = res[0].ufsUrl ?? res[0].url ?? null;
    if (!url) {
      toast.error("Upload returned unexpected response.");
      console.debug("Upload response shape:", res[0]);
      return;
    }

    setPreview(url);
    onChange(url);
    toast.success("Logo uploaded successfully");
    console.debug("Upload complete, URL:", url);
  };

  return (
    <div className="space-y-3">
      {/* Preview Area */}
      {preview ? (
        <div className="relative border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0">
              <Image
                src={preview}
                alt="Business logo preview"
                fill
                className="object-contain p-2"
                sizes="80px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                    <span className="text-sm font-medium text-gray-700">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Logo uploaded
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Your business logo is ready
              </p>
            </div>

            {!isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="mt-3">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full animate-pulse w-2/3" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {uploadMode === "dropzone" ? (
            <UploadDropzone
              endpoint="businessLogo"
              onClientUploadComplete={(res) => {
                handleUploadComplete(res);
              }}
              onUploadError={(error: Error) => {
                console.debug("UploadDropzone error:", error);
                setIsUploading(false);
                toast.error(`Upload failed: ${error.message}`);
              }}
              onUploadBegin={() => {
                setIsUploading(true);
              }}
              className="ut-button:bg-green-600 ut-button:hover:bg-green-700 ut-button:ut-readying:bg-green-600/50 ut-label:text-gray-700 ut-allowed-content:text-gray-500 ut-button:ring-green-600 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-green-500 hover:bg-green-50/50 transition-colors"
              config={{
                mode: "auto",
              }}
            />
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 hover:bg-green-50/50 transition-colors">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {isUploading ? "Uploading..." : "Upload your business logo"}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Click the button below to select a file
                  </p>
                </div>

                {/* UploadButton: render consistent JSX for the button label to avoid ambiguous "Getting ready..." */}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    handleUploadComplete(res);
                  }}
                  onUploadError={(error: Error) => {
                    console.debug("UploadButton error:", error);
                    setIsUploading(false);
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                  onUploadBegin={() => {
                    setIsUploading(true);
                  }}
                  className="ut-button:bg-green-600 ut-button:hover:bg-green-700 ut-button:w-auto ut-button:px-4 ut-button:py-2 ut-button:text-sm ut-button:font-medium ut-allowed-content:hidden"
                  content={{
                    button({ ready, isUploading: u }) {
                      // return JSX so the button always shows a clear label
                      return (
                        <span className="flex items-center gap-2">
                          {u ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          <span>
                            {u
                              ? "Uploading..."
                              : ready
                                ? "Choose File"
                                : "Initializing..."}
                          </span>
                        </span>
                      );
                    },
                  }}
                />

                <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}

          {/* Toggle Upload Mode */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() =>
                setUploadMode(uploadMode === "dropzone" ? "button" : "dropzone")
              }
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {uploadMode === "dropzone"
                ? "Use button upload instead"
                : "Use drag & drop instead"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
