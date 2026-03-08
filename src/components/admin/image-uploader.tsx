"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  folder?: string;
  maxFiles?: number;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "products",
  maxFiles = 5,
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxFiles - value.length;
      const filesToUpload = acceptedFiles.slice(0, remaining);
      if (filesToUpload.length === 0) return;

      setUploading(true);
      try {
        const uploaded: UploadedImage[] = [];
        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);

          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();
          uploaded.push({ url: data.url, publicId: data.publicId });
        }
        onChange([...value, ...uploaded]);
      } catch (err) {
        console.error(err);
        alert("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, folder, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    disabled: uploading || value.length >= maxFiles,
    multiple: maxFiles > 1,
  });

  const removeImage = async (index: number) => {
    const img = value[index];
    try {
      await fetch(`/api/admin/media/${btoa(img.publicId)}`, { method: "DELETE" });
    } catch {
      // silently fail — remove from UI anyway
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {value.map((img, i) => (
            <div
              key={img.publicId}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-contain p-1"
                sizes="120px"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            (uploading || value.length >= maxFiles) && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              {isDragActive ? (
                <Upload className="h-8 w-8 text-primary" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop files here" : "Drag & drop images"}
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse · JPG, PNG, WebP · up to {maxFiles - value.length} more
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
