"use client";

import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/utils";

interface MaterialDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
  accept?: Record<string, string[]>;
  maxSize?: number; // bytes
  label?: string;
  error?: string;
}

export function MaterialDropzone({
  onFileSelect,
  selectedFile,
  accept,
  maxSize,
  label = "Unggah File",
  error,
}: MaterialDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept,
    maxSize,
    maxFiles: 1,
  });

  if (selectedFile) {
    return (
      <div className="relative flex items-center gap-4 rounded-lg border p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <FileIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <span className="truncate text-sm font-medium">{selectedFile.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatBytes(selectedFile.size)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onFileSelect(null)}
          className="rounded-full p-1 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors hover:bg-muted/50",
          isDragActive && "border-primary bg-primary/5",
          error && "border-destructive/50 bg-destructive/5"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Drag & drop atau klik untuk memilih file
          </p>
        </div>
      </div>
      {error && <p className="text-[0.8rem] font-medium text-destructive">{error}</p>}
    </div>
  );
}
