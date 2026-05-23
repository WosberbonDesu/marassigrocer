"use client";

import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

type CountryCount = { country: string; count: number };

interface Props {
  data: CountryCount[];
}

// Common name variations → TopoJSON `properties.name`
const ALIASES: Record<string, string> = {
  "usa": "united states of america",
  "us": "united states of america",
  "united states": "united states of america",
  "u.s.a.": "united states of america",
  "uk": "united kingdom",
  "u.k.": "united kingdom",
  "uae": "united arab emirates",
  "u.a.e.": "united arab emirates",
  "ksa": "saudi arabia",
  "russia": "russia",
  "russian federation": "russia",
  "south korea": "south korea",
  "korea": "south korea",
  "north korea": "north korea",
  "ivory coast": "côte d'ivoire",
  "cote d'ivoire": "côte d'ivoire",
  "czech republic": "czechia",
  "turkey": "turkey",
  "türkiye": "turkey",
  "burma": "myanmar",
  "swaziland": "eswatini",
  "macedonia": "north macedonia",
};

function normalize(name: string) {
  const lower = name.trim().toLowerCase();
  return ALIASES[lower] ?? lower;
}

export function RfqWorldMap({ data }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);

  const { lookup, max } = useMemo(() => {
    const map = new Map<string, number>();
    let m = 0;
    for (const d of data) {
      const key = normalize(d.country);
      const v = (map.get(key) ?? 0) + d.count;
      map.set(key, v);
      if (v > m) m = v;
    }
    return { lookup: map, max: m };
  }, [data]);

  const getFill = (geoName: string) => {
    const count = lookup.get(geoName.toLowerCase()) ?? 0;
    if (count === 0 || max === 0) return "oklch(0.95 0.005 245)";
    const intensity = 0.25 + (count / max) * 0.65; // 0.25 → 0.9
    return `oklch(${0.78 - intensity * 0.3} ${0.11 + intensity * 0.05} 80)`;
  };

  const hasData = max > 0;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border bg-muted/10">
        <ComposableMap
          projectionConfig={{ scale: 130 }}
          width={800}
          height={380}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography="/data/countries-110m.json">
            {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { name: string } }> }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const count = lookup.get(name.toLowerCase()) ?? 0;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFill(name)}
                    stroke="oklch(0.88 0.01 245)"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        outline: "none",
                        fill: count > 0 ? "oklch(0.55 0.14 245)" : "oklch(0.92 0.01 245)",
                        cursor: count > 0 ? "pointer" : "default",
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={(e) => {
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        label: count > 0 ? `${name}: ${count} RFQ${count > 1 ? "s" : ""}` : name,
                      });
                    }}
                    onMouseMove={(e) => {
                      setTooltip((t) =>
                        t ? { ...t, x: e.clientX, y: e.clientY } : t
                      );
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>RFQ density (last 30 days)</span>
        <div className="flex items-center gap-2">
          <span>Low</span>
          <div className="flex">
            {[0.25, 0.45, 0.65, 0.85].map((i, idx) => (
              <div
                key={idx}
                className="h-3 w-5 first:rounded-l-sm last:rounded-r-sm"
                style={{
                  background: `oklch(${0.78 - i * 0.3} ${0.11 + i * 0.05} 80)`,
                }}
              />
            ))}
          </div>
          <span>High</span>
        </div>
      </div>

      {!hasData && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="rounded-lg bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            No RFQ activity yet — map will populate when submissions come in.
          </p>
        </div>
      )}

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          {tooltip.label}
        </div>
      )}
    </div>
  );
}
