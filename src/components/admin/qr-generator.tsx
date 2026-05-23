"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, RefreshCw } from "lucide-react";

export function QrGenerator({ defaultUrl = "" }: { defaultUrl?: string }) {
  const [url, setUrl] = useState(defaultUrl);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!url) {
      setDataUrl("");
      return;
    }
    let cancelled = false;
    setGenerating(true);
    QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then((d) => {
        if (!cancelled) setDataUrl(d);
      })
      .catch(() => {
        if (!cancelled) setDataUrl("");
      })
      .finally(() => {
        if (!cancelled) setGenerating(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setUrl(window.location.origin);
    }
  }, [url]);

  const download = (format: "png" | "svg") => {
    if (format === "png") {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "site-qr.png";
      a.click();
      return;
    }
    QRCode.toString(url, { type: "svg", width: 512, margin: 2 }).then((svg) => {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "site-qr.svg";
      a.click();
      URL.revokeObjectURL(href);
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="qr-url">URL to encode</Label>
        <Input
          id="qr-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://marassigroup.com"
        />
        <p className="text-xs text-muted-foreground">
          Defaults to your site's origin. Change to encode any URL (campaign link, product page, etc.).
        </p>
      </div>

      {dataUrl && (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt="Site QR code"
            className="h-48 w-48 rounded-lg border bg-white p-2"
          />
          <div className="space-y-2">
            <Button type="button" onClick={() => download("png")} disabled={generating}>
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => download("svg")}
              disabled={generating}
              className="ml-2"
            >
              <Download className="mr-2 h-4 w-4" />
              Download SVG
            </Button>
            <p className="text-xs text-muted-foreground">
              {generating && (
                <span className="inline-flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" /> Regenerating…
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
