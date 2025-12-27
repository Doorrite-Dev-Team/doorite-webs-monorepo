// components/LogoUpload.tsx
"use client";

import { UploadDropzone } from "@/libs/utils/uploadthing";
import { X, CheckCircle2, Upload } from "lucide-react";
import Image from "next/image";

interface LogoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export const LogoUpload = ({ value, onChange, disabled }: LogoUploadProps) => {
  const removeImage = () => {
    onChange("");
  };

  if (value) {
    return (
      <div className="relative group">
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="aspect-square w-full max-w-[200px] mx-auto relative rounded-lg overflow-hidden bg-white border border-gray-200">
            <Image
              src={value}
              alt="Business logo preview"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Logo uploaded successfully</span>
          </div>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-50" : ""}>
      <UploadDropzone
        endpoint="businessLogo"
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            onChange(res[0].ufsUrl);
          }
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          alert(`Upload failed: ${error.message}`);
        }}
        appearance={{
          container:
            "border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors",
          uploadIcon: "text-primary",
          label: "text-primary font-medium",
          allowedContent: "text-gray-500 text-sm",
          button:
            "bg-primary text-white hover:bg-primary/90 transition-colors ut-ready:bg-primary ut-uploading:bg-primary/70",
        }}
        content={{
          uploadIcon: <Upload className="w-8 h-8" />,
          label: "Click to upload or drag and drop",
          allowedContent: "PNG, JPG, JPEG or WEBP (max. 4MB)",
          button({ ready, isUploading }) {
            if (isUploading) return "Uploading...";
            if (ready) return "Choose Logo";
            return "Getting ready...";
          },
        }}
      />
    </div>
  );
};
