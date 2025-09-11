import { Button } from "@repo/ui/components/button";
import { CloudUpload, Paperclip, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface FileUploaderProps {
  value: File[] | null;
  onValueChange: (files: File[] | null) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onValueChange,
  maxFiles = 1,
  maxSize = 4 * 1024 * 1024, // 4MB default
  accept = "image/*",
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles: File[] = [];
    const currentFiles = value || [];

    Array.from(newFiles).forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        console.warn(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      // Check if we're under the file limit
      if (currentFiles.length + validFiles.length < maxFiles) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      const updatedFiles = [...currentFiles, ...validFiles];
      onValueChange(updatedFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = value ? value.filter((_, i) => i !== index) : [];
    onValueChange(updatedFiles.length > 0 ? updatedFiles : null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`relative bg-background rounded-lg p-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        className={`outline-dashed outline-1 outline-slate-500 cursor-pointer transition-colors ${
          dragActive ? "outline-blue-500 bg-blue-50" : "hover:outline-slate-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex items-center justify-center flex-col p-8 w-full">
          <CloudUpload className={`w-10 h-10 ${dragActive ? "text-blue-500" : "text-gray-500"}`} />
          <p className="mb-1 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span>
            &nbsp;or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {accept.includes("image") ? "SVG, PNG, JPG or GIF" : "Any file type"}
            {" "}(max {Math.round(maxSize / (1024 * 1024))}MB)
          </p>
          {maxFiles > 1 && (
            <p className="text-xs text-gray-400 mt-1">
              Maximum {maxFiles} files
            </p>
          )}
        </div>
      </div>

      {value && value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Paperclip className="h-4 w-4 stroke-current text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};