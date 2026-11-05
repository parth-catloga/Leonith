"use client";

import { useState } from "react";
import type { IdeaProps } from "./CollectionIdeas";
import { formats, slabs, textureUrl } from "./slabs";

// The tallest format sets the scale; a 1750 mm figure stands beside them.
const TALLEST = 3200;
const PERSON = 1750;

// Idea C: the four formats side by side at true relative size. Picking a finish
// wraps every slab in it, so clients compare sizes in the stone they like.
export default function SizeWall({ onOpen }: IdeaProps) {
  const [chosen, setChosen] = useState(0);
  const slab = slabs[chosen];

  return (
    <section className="flex min-h-svh flex-col gap-8 px-4 pb-36 pt-28 lg:px-14">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-4xl leading-none lg:text-5xl">Four formats, true to scale</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-black/50">Shown in {slab.name}</p>
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Finish">
          {slabs.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={index === chosen}
              aria-label={item.name}
              title={item.name}
              onClick={() => setChosen(index)}
              className={`h-10 w-10 rounded-full bg-cover bg-center ring-offset-2 ring-offset-cream transition ${
                index === chosen ? "ring-2 ring-black" : "ring-1 ring-black/15 hover:ring-black/40"
              }`}
              style={{ backgroundImage: `url(${textureUrl(item)})` }}
            />
          ))}
        </div>
      </div>

      {/* Every length below is a share of --wall, the drawn height of 3200 mm. */}
      <div className="flex flex-1 items-end justify-center gap-[3vw] border-b border-black/70 [--wall:min(52svh,60vw)]">
        {formats.map((format) => (
          <button
            key={format.label}
            type="button"
            onClick={() => onOpen({ ...slab, size: `${format.label} mm`, thickness: format.thickness })}
            className="group flex flex-col items-center gap-2"
          >
            <span className="text-[11px] uppercase tracking-[0.14em] opacity-0 transition-opacity group-hover:opacity-100">
              {format.thickness}
            </span>
            <span
              key={slab.id}
              className="block animate-[fadeIn_0.6s_ease] bg-cover bg-center shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:-translate-y-2"
              style={{
                width: `calc(var(--wall) * ${format.width / TALLEST})`,
                height: `calc(var(--wall) * ${format.height / TALLEST})`,
                backgroundImage: `url(${textureUrl(slab)})`,
              }}
            />
            <span className="pb-2 text-xs uppercase tracking-[0.1em]">{format.label}</span>
          </button>
        ))}

        <svg
          viewBox="0 0 40 175"
          className="mb-8 shrink-0 fill-black/70"
          style={{ height: `calc(var(--wall) * ${PERSON / TALLEST})` }}
          aria-label="Person, 1750 mm tall"
        >
          <circle cx="20" cy="11" r="10" />
          <rect x="7" y="25" width="26" height="72" rx="12" />
          <rect x="9" y="85" width="10" height="90" rx="5" />
          <rect x="21" y="85" width="10" height="90" rx="5" />
        </svg>
      </div>
    </section>
  );
}
