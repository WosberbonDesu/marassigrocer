"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useTranslations } from "next-intl";

// Sourcing hubs (8+ countries from brief) — lat/lng
const SOURCING_HUBS = [
  { name: "Turkey", lat: 39.0, lng: 35.0, size: 0.10 },
  { name: "Egypt", lat: 26.5, lng: 30.0, size: 0.10 },
  { name: "UAE", lat: 23.5, lng: 54.0, size: 0.10 },
  { name: "Saudi Arabia", lat: 24.0, lng: 45.0, size: 0.09 },
  { name: "India", lat: 22.0, lng: 78.0, size: 0.09 },
  { name: "Vietnam", lat: 16.0, lng: 108.0, size: 0.08 },
  { name: "Thailand", lat: 15.0, lng: 101.0, size: 0.08 },
  { name: "China", lat: 35.0, lng: 105.0, size: 0.09 },
];

// Destination markets (subset of 50+ for visualization)
const DESTINATIONS = [
  { name: "Nigeria", lat: 9.0, lng: 8.0, size: 0.06 },
  { name: "Kenya", lat: -1.0, lng: 37.0, size: 0.06 },
  { name: "South Africa", lat: -30.0, lng: 22.5, size: 0.06 },
  { name: "Morocco", lat: 31.0, lng: -7.0, size: 0.06 },
  { name: "Algeria", lat: 28.0, lng: 1.6, size: 0.06 },
  { name: "Libya", lat: 26.3, lng: 17.2, size: 0.06 },
  { name: "Jordan", lat: 31.3, lng: 36.0, size: 0.06 },
  { name: "Iraq", lat: 33.2, lng: 43.7, size: 0.06 },
  { name: "Indonesia", lat: -2.0, lng: 118.0, size: 0.06 },
  { name: "Malaysia", lat: 4.2, lng: 102.0, size: 0.06 },
  { name: "Philippines", lat: 13.0, lng: 122.0, size: 0.06 },
  { name: "Russia", lat: 60.0, lng: 100.0, size: 0.06 },
  { name: "Germany", lat: 51.0, lng: 10.0, size: 0.06 },
  { name: "Spain", lat: 40.0, lng: -3.7, size: 0.06 },
  { name: "Italy", lat: 42.5, lng: 12.5, size: 0.06 },
  { name: "France", lat: 46.0, lng: 2.0, size: 0.06 },
  { name: "UK", lat: 54.0, lng: -2.0, size: 0.06 },
  { name: "USA", lat: 39.0, lng: -96.0, size: 0.06 },
  { name: "Brazil", lat: -10.0, lng: -55.0, size: 0.06 },
];

export function GlobeHero() {
  const t = useTranslations("globe");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let phi = 0;
    let width = canvas.offsetWidth;
    widthRef.current = width;
    let rafId = 0;

    const onResize = () => {
      width = canvas.offsetWidth;
      widthRef.current = width;
    };
    window.addEventListener("resize", onResize);

    const markers = [
      // Sourcing hubs — bright amber for prominence
      ...SOURCING_HUBS.map((m) => ({
        location: [m.lat, m.lng] as [number, number],
        size: m.size,
      })),
      // Destinations — same color, smaller size handles visual hierarchy
      ...DESTINATIONS.map((m) => ({
        location: [m.lat, m.lng] as [number, number],
        size: m.size,
      })),
    ];

    // Slate navy sphere with warm coral markers — Stripe-like, refined
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 6,
      mapBaseBrightness: 0.05,
      baseColor: [0.22, 0.32, 0.65],
      markerColor: [0.95, 0.45, 0.22],
      glowColor: [0.45, 0.60, 0.95],
      markers,
    });

    const tick = () => {
      if (!pointerInteracting.current) {
        phi += 0.003;
      }
      phiRef.current = phi;
      globe.update({
        phi: phi + pointerInteractionMovement.current,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    setTimeout(() => {
      canvas.style.opacity = "1";
    }, 100);

    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/40 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <p className="mb-3 inline-flex rounded-full border border-[oklch(0.72_0.11_80)]/30 bg-[oklch(0.72_0.11_80)]/8 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[oklch(0.60_0.12_75)]">
              {t("badge")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              {t("subtitle")}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[oklch(0.60_0.12_75)]">50+</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  {t("countriesServed")}
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[oklch(0.60_0.12_75)]">8+</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  {t("sourcing")}
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[oklch(0.60_0.12_75)]">75+</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  {t("factories")}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground lg:justify-start">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.66_0.16_35)] ring-2 ring-[oklch(0.66_0.16_35)]/30" />
                {t("sourcingHubs")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.66_0.16_35)]" />
                {t("destinations")}
              </span>
            </div>
          </div>

          {/* Right: globe */}
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <canvas
              ref={canvasRef}
              onPointerDown={(e) => {
                pointerInteracting.current =
                  e.clientX - pointerInteractionMovement.current;
                if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
              }}
              onPointerUp={() => {
                pointerInteracting.current = null;
                if (canvasRef.current) canvasRef.current.style.cursor = "grab";
              }}
              onPointerOut={() => {
                pointerInteracting.current = null;
                if (canvasRef.current) canvasRef.current.style.cursor = "grab";
              }}
              onMouseMove={(e) => {
                if (pointerInteracting.current !== null) {
                  const delta = e.clientX - pointerInteracting.current;
                  pointerInteractionMovement.current = delta / 200;
                }
              }}
              onTouchMove={(e) => {
                if (pointerInteracting.current !== null && e.touches[0]) {
                  const delta = e.touches[0].clientX - pointerInteracting.current;
                  pointerInteractionMovement.current = delta / 100;
                }
              }}
              style={{
                width: "100%",
                aspectRatio: "1",
                cursor: "grab",
                opacity: 0,
                transition: "opacity 1s ease",
                contain: "layout paint size",
              }}
            />
            {/* Glow ring */}
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
