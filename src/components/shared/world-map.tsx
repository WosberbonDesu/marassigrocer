"use client";

import { motion } from "framer-motion";

export interface MapMarker {
  name: string;
  lat: number;
  lng: number;
  tone?: "primary" | "secondary";
}

/**
 * Equirectangular projection: lon/lat → percent coords on a 2:1 map.
 * Returns CSS percent strings so the consumer can position absolutely.
 */
function project(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { left: `${x}%`, top: `${y}%` };
}

interface WorldMapProps {
  markers: MapMarker[];
  className?: string;
  showLabels?: boolean;
}

/**
 * Stylized world map using simplified continent paths (equirectangular projection).
 * Pins are positioned using actual lat/lng so geography is honest.
 */
export function WorldMap({ markers, className = "", showLabels = true }: WorldMapProps) {
  return (
    <div className={`relative aspect-[2/1] w-full ${className}`}>
      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <pattern id="gridDot" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="oklch(0.78 0.12 80 / 0.18)" />
          </pattern>
          <mask id="landMask">
            <rect width="1000" height="500" fill="black" />
            {/* Land masses filled white become the visible part */}
            <g fill="white">
              {/* North America */}
              <path d="M 80 105 L 110 85 L 160 75 L 215 75 L 270 95 L 290 130 L 270 170 L 250 200 L 230 230 L 200 245 L 175 250 L 150 240 L 130 215 L 115 185 L 100 155 L 85 130 Z" />
              <path d="M 200 60 L 250 50 L 280 60 L 290 80 L 270 90 L 230 90 L 205 85 Z" />
              {/* Central America */}
              <path d="M 200 245 L 230 245 L 245 265 L 240 280 L 215 275 L 205 260 Z" />
              {/* South America */}
              <path d="M 245 280 L 280 270 L 310 285 L 325 310 L 330 350 L 320 395 L 295 430 L 270 445 L 255 430 L 250 400 L 255 365 L 250 330 L 248 305 Z" />
              {/* Greenland */}
              <path d="M 330 60 L 365 55 L 380 75 L 370 105 L 345 110 L 330 95 L 325 75 Z" />
              {/* Europe */}
              <path d="M 460 95 L 495 90 L 530 95 L 555 105 L 575 100 L 590 110 L 580 130 L 560 145 L 540 155 L 515 160 L 490 155 L 470 145 L 455 130 L 450 115 Z" />
              <path d="M 470 75 L 500 70 L 525 78 L 530 90 L 510 92 L 480 90 Z" />
              {/* Iberian peninsula */}
              <path d="M 440 145 L 465 142 L 475 160 L 460 170 L 440 165 Z" />
              {/* Africa */}
              <path d="M 470 175 L 505 170 L 545 175 L 580 180 L 605 195 L 615 220 L 620 250 L 615 285 L 600 320 L 575 355 L 555 380 L 530 395 L 510 395 L 495 380 L 480 355 L 475 320 L 480 285 L 485 250 L 480 220 L 475 195 Z" />
              {/* Middle East */}
              <path d="M 595 165 L 625 160 L 650 170 L 660 190 L 650 210 L 625 215 L 605 205 L 595 185 Z" />
              {/* Russia (large landmass) */}
              <path d="M 595 80 L 650 70 L 720 70 L 800 75 L 870 85 L 880 110 L 855 130 L 820 135 L 770 130 L 720 125 L 670 115 L 625 105 L 600 95 Z" />
              {/* India */}
              <path d="M 680 175 L 705 170 L 720 175 L 730 195 L 735 220 L 720 245 L 700 250 L 685 235 L 678 210 L 678 190 Z" />
              {/* SE Asia / China */}
              <path d="M 730 140 L 780 135 L 820 145 L 835 165 L 825 185 L 800 195 L 775 200 L 750 195 L 735 180 L 728 160 Z" />
              {/* Indonesia / SE Asia islands */}
              <path d="M 770 235 L 815 230 L 840 240 L 830 255 L 800 258 L 775 252 Z" />
              <path d="M 830 245 L 855 242 L 865 255 L 845 262 L 832 255 Z" />
              {/* Japan */}
              <path d="M 855 130 L 875 125 L 880 145 L 870 160 L 858 155 Z" />
              {/* Australia */}
              <path d="M 800 325 L 855 320 L 895 330 L 905 355 L 895 380 L 865 390 L 830 388 L 810 375 L 800 355 Z" />
              {/* New Zealand */}
              <path d="M 905 395 L 925 392 L 935 410 L 920 420 L 908 415 Z" />
              {/* Madagascar */}
              <path d="M 625 320 L 638 315 L 645 340 L 638 358 L 625 350 L 622 335 Z" />
              {/* UK / Ireland */}
              <path d="M 458 110 L 472 108 L 478 122 L 470 130 L 458 125 Z" />
            </g>
          </mask>
        </defs>

        {/* Background dot grid masked to landmasses */}
        <rect width="1000" height="500" fill="url(#gridDot)" mask="url(#landMask)" />
        {/* Soft continent fill underneath for depth */}
        <g mask="url(#landMask)">
          <rect width="1000" height="500" fill="oklch(0.78 0.12 80 / 0.05)" />
        </g>
      </svg>

      {/* Markers */}
      {markers.map((m, i) => {
        const pos = project(m.lat, m.lng);
        return (
          <motion.div
            key={`${m.name}-${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={pos}
          >
            <div className="relative flex flex-col items-center">
              {showLabels && (
                <span className="mb-1 whitespace-nowrap rounded-md bg-[oklch(0.16_0.02_80)]/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
                  {m.name}
                </span>
              )}
              <span className="relative block">
                <span className="absolute inset-0 -m-1.5 animate-ping rounded-full bg-[oklch(0.78_0.12_80)]/40" />
                <span className="relative block h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.12_80)] ring-2 ring-[oklch(0.78_0.12_80)]/30 shadow-[0_0_12px_oklch(0.78_0.12_80)]" />
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
