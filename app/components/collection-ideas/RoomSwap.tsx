"use client";

import { useState } from "react";
import PillLink from "../PillLink";
import type { IdeaProps } from "./CollectionIdeas";
import { slabs, textureUrl } from "./slabs";

// Outlines of the stone surfaces in kitchen-countertops.jpg (1024 × 1024).
// A real version would trace these once per room photo.
const surfaces = {
  island: ["155,455 432,598 868,540 458,443", "432,598 868,540 868,872 432,985"],
  backsplash: ["700,318 958,302 958,470 700,442"],
} as const;

type Surface = keyof typeof surfaces;

const surfaceOptions: { key: Surface | "both"; label: string }[] = [
  { key: "island", label: "Island" },
  { key: "backsplash", label: "Backsplash" },
  { key: "both", label: "Both" },
];

// Idea G: one real room fills the page and the stone in it changes to the slab
// you tap, so clients judge the stone in place rather than as a swatch.
export default function RoomSwap({ onOpen }: IdeaProps) {
  const [target, setTarget] = useState<Surface | "both">("both");
  const [picked, setPicked] = useState<Partial<Record<Surface, number>>>({});

  const pick = (index: number) => {
    setPicked((current) =>
      target === "both" ? { island: index, backsplash: index } : { ...current, [target]: index },
    );
  };

  const shownIndex = picked[target === "both" ? "island" : target];
  const shown = shownIndex === undefined ? null : slabs[shownIndex];

  return (
    <section className="grid min-h-svh gap-8 px-4 pb-36 pt-28 lg:grid-cols-[minmax(0,1.2fr)_1fr] lg:px-14">
      <svg viewBox="0 0 1024 1024" className="aspect-square w-full max-h-[78svh] self-start object-contain" role="img" aria-label="Kitchen with the chosen slabs">
        <defs>
          {slabs.map((slab) => (
            <pattern key={slab.id} id={`room-${slab.id}`} patternUnits="userSpaceOnUse" width="560" height="896">
              <image href={textureUrl(slab)} width="560" height="896" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          ))}
          {(Object.keys(surfaces) as Surface[]).map((surface) => (
            <clipPath key={surface} id={`clip-${surface}`}>
              {surfaces[surface].map((points) => (
                <polygon key={points} points={points} />
              ))}
            </clipPath>
          ))}
        </defs>

        <image href="/images/applications/kitchen-countertops.jpg" width="1024" height="1024" />

        {(Object.keys(surfaces) as Surface[]).map((surface) => {
          const index = picked[surface];
          if (index === undefined) {
            return null;
          }
          return (
            <g key={`${surface}-${index}`} className="animate-[fadeIn_0.5s_ease]">
              {surfaces[surface].map((points) => (
                <polygon key={points} points={points} fill={`url(#room-${slabs[index].id})`} />
              ))}
              {/* The photo's own light and shadow laid back over the new stone. */}
              <image
                href="/images/applications/kitchen-countertops.jpg"
                width="1024"
                height="1024"
                clipPath={`url(#clip-${surface})`}
                style={{ mixBlendMode: "multiply", opacity: 0.45 }}
              />
            </g>
          );
        })}
      </svg>

      <div className="flex flex-col gap-8 lg:pt-8">
        <div>
          <h1 className="font-display text-4xl leading-none lg:text-5xl">See it in a room</h1>
          <p className="mt-3 text-sm text-black/70">Pick a surface, then a slab. Tap Original to put the room back.</p>
        </div>

        <div className="flex gap-2">
          {surfaceOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setTarget(option.key)}
              aria-pressed={option.key === target}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] ${
                option.key === target ? "border-black bg-black text-cream" : "border-black/15"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          <button
            type="button"
            onClick={() => setPicked({})}
            className="grid aspect-square place-items-center border border-dashed border-black/30 text-[11px] uppercase tracking-[0.1em]"
          >
            Original
          </button>
          {slabs.map((slab, index) => (
            <button
              key={slab.id}
              type="button"
              onClick={() => pick(index)}
              title={slab.name}
              aria-label={slab.name}
              className={`aspect-square bg-cover bg-center transition ${shownIndex === index ? "ring-2 ring-black ring-offset-2 ring-offset-cream" : "hover:opacity-80"}`}
              style={{ backgroundImage: `url(${textureUrl(slab)})` }}
            />
          ))}
        </div>

        {shown && (
          <div className="flex flex-col gap-4 border-t border-black/10 pt-6">
            <p className="font-display text-3xl">{shown.name}</p>
            <p className="text-sm">
              {shown.look} · {shown.finish} · {shown.size}
            </p>
            <div className="flex gap-3">
              <PillLink href="/contact">Enquire</PillLink>
              <button type="button" onClick={() => onOpen(shown)} className="rounded-full border border-black/15 px-6 py-3 text-xs uppercase tracking-[0.14em]">
                Details
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
