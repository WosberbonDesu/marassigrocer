"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Upload, Loader2, Copy, Check } from "lucide-react";
import { AdminTopBar } from "@/components/admin/top-bar";
import { ImageUploader } from "@/components/admin/image-uploader";

interface MediaItem {
  publicId: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

interface UploadedImage {
  url: string;
  publicId: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const fetchMedia = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setMedia(data.resources ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  // When new images are uploaded via the uploader, refresh the list
  useEffect(() => {
    if (uploadedImages.length > 0) {
      fetchMedia();
      setUploadedImages([]);
    }
  }, [uploadedImages]);

  const handleDelete = async (publicId: string) => {
    if (!confirm("Delete this image? It may be used by products or categories.")) return;
    setDeleting(publicId);
    await fetch(`/api/admin/media/${btoa(publicId)}`, { method: "DELETE" });
    setDeleting(null);
    fetchMedia();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  return (
    <>
      <AdminTopBar title="Media Library" />
      <div className="p-6 space-y-6">
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload New Images
          </h3>
          <ImageUploader
            value={uploadedImages}
            onChange={setUploadedImages}
            folder="media"
            maxFiles={10}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-4">All Media ({media.length})</h3>
          {loading ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : media.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No media uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {media.map((item) => (
                <div
                  key={item.publicId}
                  className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
                >
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw"
                  />

                  {/* Overlay actions */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => copyUrl(item.url)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"
                      title="Copy URL"
                    >
                      {copied === item.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.publicId)}
                      disabled={deleting === item.publicId}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/80 text-white hover:bg-destructive disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === item.publicId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Size label */}
                  <div className="absolute bottom-1 left-1 right-1 text-center">
                    <span className="rounded bg-black/50 px-1 text-[10px] text-white">
                      {formatBytes(item.bytes)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
