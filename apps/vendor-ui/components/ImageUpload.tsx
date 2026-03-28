"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { X, Loader2, Image as ImageIcon, Check, Upload } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { UploadButton, UploadDropzone } from "@/libs/uploadthing";

// ✅ Type for the ref to expose the cleanup method
export interface ImageUploadRef {
  rollback: () => Promise<void>;
}

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  title?: string;
  // ✅ NEW: Server action to delete file (Required for ACID/Cleanup)
  onRemove?: (url: string) => Promise<void>;
}

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ value, onChange, title = "Logo", onRemove }, ref) => {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [uploadMode, setUploadMode] = useState<"button" | "dropzone">(
      "dropzone",
    );

    useEffect(() => {
      setPreview(value ?? null);
    }, [value]);

    /**
     * ✅ EXPOSE DELETE / ROLLBACK
     * This allows the parent component to trigger a delete if their own
     * database transaction fails.
     */
    useImperativeHandle(ref, () => ({
      rollback: async () => {
        if (preview && onRemove) {
          try {
            await onRemove(preview);
            setPreview(null);
            onChange(null);
            // Don't toast on rollback, as the parent error will likely take precedence
          } catch (error) {
            console.error("Rollback failed:", error);
          }
        }
      },
    }));

    const handleRemove = async () => {
      // ✅ ACID: Delete from server immediately when user clicks remove
      if (preview && onRemove) {
        setIsUploading(true);
        try {
          await onRemove(preview);
        } catch (error) {
          toast.error("Failed to remove image from server", {
            description: error as string,
          });
          setIsUploading(false);
          return;
        }
      }

      setPreview(null);
      onChange(null);
      setIsUploading(false);
      toast.success(`${title} removed`);
    };

    const handleUploadComplete = (res: any[] | undefined) => {
      setIsUploading(false);

      if (!res || res.length === 0) {
        toast.error("Upload completed but no file returned.");
        return;
      }

      const url = res[0].ufsUrl ?? res[0].url ?? null;
      if (!url) {
        toast.error("Upload returned unexpected response.");
        return;
      }

      setPreview(url);
      onChange(url);
      toast.success(`${title} uploaded successfully`);
    };

    return (
      <div className="space-y-3">
        {preview ? (
          <div className="relative border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0">
                <Image
                  src={preview}
                  alt={`${title} preview`}
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
                        Processing...
                      </span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {title} uploaded
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Your {title.toLowerCase()} is ready
                </p>
              </div>

              {!isUploading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="mt-3">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full animate-pulse w-2/3" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {uploadMode === "dropzone" ? (
              <UploadDropzone
                endpoint="businessLogo"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={(error: Error) => {
                  setIsUploading(false);
                  toast.error(`Upload failed: ${error.message}`);
                }}
                onUploadBegin={() => setIsUploading(true)}
                className="ut-button:bg-green-600 ut-button:hover:bg-green-700 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-green-500 hover:bg-green-50/50 transition-colors"
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
                      {isUploading
                        ? "Uploading..."
                        : `Upload your ${title.toLowerCase()}`}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Click the button below to select a file
                    </p>
                  </div>

                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={(error: Error) => {
                      setIsUploading(false);
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                    onUploadBegin={() => setIsUploading(true)}
                    className="ut-button:bg-green-600 ut-button:hover:bg-green-700"
                    content={{
                      button({ ready, isUploading: u }) {
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

                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() =>
                  setUploadMode(
                    uploadMode === "dropzone" ? "button" : "dropzone",
                  )
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
  },
);

ImageUpload.displayName = "ImageUpload";
