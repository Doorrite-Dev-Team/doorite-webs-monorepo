"use client";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Image from "next/image";
import { X, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { useUploadThing } from "@/libs/uploadthing";

export interface ImageUploadRef {
  upload: () => Promise<string | null>;
  rollback: () => Promise<void>;
  hasPendingFile: () => boolean;
}

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  title?: string;
  onRemove?: (url: string) => Promise<void>;
}

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ value, onChange, title = "Logo", onRemove }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { startUpload } = useUploadThing("businessLogo");

    useEffect(() => {
      if (!selectedFile) {
        setPreview(value ?? null);
      }
    }, [value, selectedFile]);

    useEffect(() => {
      return () => {
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      };
    }, [preview]);

    useImperativeHandle(ref, () => ({
      upload: async () => {
        if (!selectedFile) return null;

        setIsUploading(true);
        try {
          const res = await startUpload([selectedFile]);
          if (!res || res.length === 0) {
            throw new Error("Upload returned no response");
          }
          const file = res[0];
          if (!file) {
            throw new Error("Upload returned no file");
          }
          const url = file.ufsUrl ?? file.url;
          if (!url) {
            throw new Error("Upload returned no URL");
          }
          setUploadedUrl(url);
          onChange(url);
          setSelectedFile(null);
          return url;
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Upload failed";
          toast.error(`Upload failed: ${msg}`);
          return null;
        } finally {
          setIsUploading(false);
        }
      },
      rollback: async () => {
        const target =
          uploadedUrl || (value && value !== uploadedUrl ? value : null);
        if (target && onRemove) {
          try {
            await onRemove(target);
          } catch (error) {
            console.error("Rollback failed:", error);
          }
        }
        setUploadedUrl(null);
        setSelectedFile(null);
        setPreview(null);
        onChange(null);
      },
      hasPendingFile: () => selectedFile !== null,
    }));

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    };

    const handleRemove = async () => {
      if (uploadedUrl && onRemove) {
        setIsUploading(true);
        try {
          await onRemove(uploadedUrl);
        } catch (error) {
          toast.error("Failed to remove image from server", {
            description: error as string,
          });
          setIsUploading(false);
          return;
        }
      }

      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      setSelectedFile(null);
      setUploadedUrl(null);
      setPreview(null);
      onChange(null);
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
      toast.success(`${title} removed`);
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
                        Uploading...
                      </span>
                    </>
                  ) : selectedFile ? (
                    <>
                      <Upload className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Ready to upload
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-700">
                        {title} ready
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {selectedFile
                    ? "Will upload when you save"
                    : isUploading
                      ? "Please wait, while image is Uploading..."
                      : "Saved image"}
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
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 hover:bg-green-50/50 transition-colors cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Upload your {title.toLowerCase()}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Click to select a file
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="pointer-events-none"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>

              <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 4MB</p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>
    );
  },
);

ImageUpload.displayName = "ImageUpload";
