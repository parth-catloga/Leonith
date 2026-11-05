"use client";

import { useState } from "react";
import PillLink from "../PillLink";
import type { IdeaProps } from "./CollectionIdeas";
import { slabs, textureUrl } from "./slabs";

// Idea I: slabs as sample chips standing in a box, like the ones handed to a
// client. Pull a chip out to see it up close, then flip it for the specs.
export default function SampleBox({ onOpen }: IdeaProps) {
  const [pulled, setPulled] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const slab = pulled === null ? null : slabs[pulled];

  const pull = (index: number) => {
    setPulled(index);
    setFlipped(false);
  };

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-end gap-10 overflow-hidden px-4 pb-36 pt-28">
      <div className="text-center">
        <h1 className="font-display text-4xl leading-none lg:text-5xl">The sample box</h1>
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-black/50">Pull a chip out to look closer</p>
      </div>

      {/* The pulled chip, held up and ready to flip. */}
      <div className="flex min-h-[46svh] items-center justify-center">
        {slab ? (
          <div key={slab.id} className="flex animate-[fadeIn_0.5s_ease] flex-col items-center gap-5">
            <button
              type="button"
              onClick={() => setFlipped((value) => !value)}
              className="relative h-[38svh] w-[24svh] [perspective:1200px]"
              aria-label={flipped ? "Show the stone" : "Flip to see the specs"}
            >
              <span
                className="absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d]"
                style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
              >
                <span
                  className="absolute inset-0 rounded-sm bg-cover bg-center shadow-[0_30px_60px_rgba(0,0,0,0.25)] [backface-visibility:hidden]"
                  style={{ backgroundImage: `url(${textureUrl(slab)})` }}
                />
                <span className="absolute inset-0 flex flex-col justify-between rounded-sm bg-[#f3eee4] p-4 text-left shadow-[0_30px_60px_rgba(0,0,0,0.25)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="font-display text-2xl leading-none">{slab.name}</span>
                  <span className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.1em]">
                    <span>{slab.look}</span>
                    <span>{slab.finish}</span>
                    <span>{slab.size}</span>
                    <span>{slab.thickness}</span>
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.1em] text-black/50">Leonith · Marmo Estetico</span>
                </span>
              </span>
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={() => setFlipped((value) => !value)} className="rounded-full border border-black/15 px-5 py-3 text-xs uppercase tracking-[0.14em]">
                Flip
              </button>
              <button type="button" onClick={() => onOpen(slab)} className="rounded-full border border-black/15 px-5 py-3 text-xs uppercase tracking-[0.14em]">
                Details
              </button>
              <PillLink href="/contact">Enquire</PillLink>
            </div>
          </div>
        ) : (
          <p className="font-display text-2xl italic text-black/40">Choose a chip below</p>
        )}
      </div>

      {/* The box: chips stand inside, its front panel hides their lower half. */}
      <div className="relative w-full max-w-3xl">
        <div className="flex items-end justify-center gap-2 px-6 sm:gap-3">
          {slabs.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => pull(index)}
              title={item.name}
              aria-label={item.name}
              className={`h-40 flex-1 translate-y-16 rounded-t-sm bg-cover bg-center shadow-[0_-4px_12px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:translate-y-8 ${
                pulled === index ? "translate-y-40!" : ""
              }`}
              style={{ backgroundImage: `url(${textureUrl(item)})` }}
            />
          ))}
        </div>
        <div className="relative z-10 flex h-24 items-center justify-center rounded-sm bg-[#cbbfa8] shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
          <span className="text-xs uppercase tracking-[0.3em] text-black/60">Leonith samples</span>
        </div>
      </div>
    </section>
  );
}
