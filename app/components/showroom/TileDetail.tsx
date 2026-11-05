"use client";

import { useEffect } from "react";
import PillLink from "../PillLink";
import { sizeByKey, tileImage, type Size, type Tile } from "./tiles";

export const enquiryHref = (tile: Tile, size: Size) => `/contact?tile=${encodeURIComponent(`${tile.name} (${size.label})`)}`;

// The card a tile opens: a large view of the face and its specs.
export default function TileDetail({ tile, onClose }: { tile: Tile | null; onClose: () => void }) {
  useEffect(() => {
    if (!tile) return;
    const handleKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tile, onClose]);

  if (!tile) return null;
  const size = sizeByKey[tile.size];
  const specs = [
    ["Size", size.label],
    ["Thickness", size.thickness],
    ["Look", tile.look],
    ["Finish", tile.finish],
    ["Best for", tile.uses],
  ];
  const [r, g, b] = tile.variant?.tint ?? [1, 1, 1];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 font-label" onClick={onClose} role="dialog" aria-modal="true" aria-label={tile.name}>
      <div className="relative grid max-h-[90svh] w-full max-w-3xl overflow-auto bg-cream text-black md:grid-cols-[1fr_1.1fr]" onClick={(event) => event.stopPropagation()} data-lenis-prevent>
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url(${tileImage(tile)})`,
              backgroundPosition: `${Math.round((tile.variant?.offset ?? 0.5) * 100)}% 50%`,
              transform: tile.variant?.flip ? "scaleX(-1)" : undefined,
              // Matches the tone the placeholder has on its display.
              backgroundColor: `rgb(${r * 255} ${g * 255} ${b * 255})`,
              backgroundBlendMode: "multiply",
            }}
          />
        </div>
        <div className="flex flex-col gap-6 p-6 md:p-8">
          <button type="button" onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-black/15 bg-cream text-lg" aria-label="Close">
            ×
          </button>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-black/50">{size.comingSoon ? "Coming soon" : size.displayName}</p>
            <h2 className="mt-2 pr-10 font-display text-4xl leading-none">{tile.name}</h2>
            {tile.sample && <p className="mt-3 text-xs text-black/50">Placeholder design. The full catalogue is on its way.</p>}
          </div>
          <dl className="grid gap-3 border-t border-black/10 pt-5 text-sm">
            {specs.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[7rem_1fr] gap-4">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-black/50">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto">
            <PillLink href={enquiryHref(tile, size)}>{size.comingSoon ? "Get notified" : "Enquire about this tile"}</PillLink>
          </div>
        </div>
      </div>
    </div>
  );
}
