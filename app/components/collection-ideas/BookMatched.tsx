"use client";

import { useRef } from "react";
import PillLink from "../PillLink";
import type { IdeaProps } from "./CollectionIdeas";
import { slabs, textureUrl, type Slab } from "./slabs";
import { useScrollProgress } from "./useScrollProgress";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function Chapter({ slab, index, onOpen }: { slab: Slab; index: number; onOpen: IdeaProps["onOpen"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useScrollProgress(sectionRef, (progress) => {
    // The two halves open from closed (edge on) to flat over the first 60%.
    const open = 1 - (1 - clamp(progress / 0.6)) ** 3;
    if (leftRef.current && rightRef.current && textRef.current) {
      leftRef.current.style.transform = `rotateY(${(1 - open) * 88}deg)`;
      rightRef.current.style.transform = `rotateY(${-(1 - open) * 88}deg)`;
      textRef.current.style.opacity = String(clamp((progress - 0.45) / 0.25));
      textRef.current.style.transform = `translate3d(0, ${(1 - clamp((progress - 0.45) / 0.25)) * 30}px, 0)`;
    }
  });

  return (
    <section ref={sectionRef} className="h-[200svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-4 pb-24 pt-28 [perspective:1800px]">
        <div className="flex h-full max-h-[80svh] w-full max-w-5xl">
          {/* The same image twice, the right one mirrored, the way slabs are book-matched. */}
          <div
            ref={leftRef}
            className="h-full flex-1 origin-right bg-cover bg-right"
            style={{ backgroundImage: `url(${textureUrl(slab)})` }}
          />
          {/* Rotates on its own left edge; the mirror sits on the inner layer so it flips in place. */}
          <div ref={rightRef} className="h-full flex-1 origin-left">
            <div className="h-full w-full -scale-x-100 bg-cover bg-right" style={{ backgroundImage: `url(${textureUrl(slab)})` }} />
          </div>
        </div>

        <div
          ref={textRef}
          className="absolute bottom-28 left-4 flex flex-col gap-4 bg-cream/90 p-6 opacity-0 backdrop-blur lg:bottom-24 lg:left-14"
        >
          <p className="text-xs uppercase tracking-[0.14em] text-black/50">
            Chapter {String(index + 1).padStart(2, "0")} · {slab.look}
          </p>
          <h2 className="font-display text-5xl leading-none">{slab.name}</h2>
          <p className="text-sm">
            {slab.finish} · {slab.size} · {slab.thickness}
          </p>
          <div className="flex gap-3">
            <PillLink href="/contact">Enquire</PillLink>
            <button type="button" onClick={() => onOpen(slab)} className="rounded-full border border-black/15 px-6 py-3 text-xs uppercase tracking-[0.14em]">
              Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Idea F: one full-screen chapter per slab. Scrolling opens two mirrored halves
// like a book until the vein meets in the middle, then the details rise in.
export default function BookMatched({ onOpen }: IdeaProps) {
  return (
    <>
      <section className="flex h-[70svh] flex-col justify-end px-4 pb-16 pt-28 lg:px-14">
        <h1 className="font-display text-6xl leading-none lg:text-8xl">Book-matched</h1>
        <p className="mt-4 max-w-md text-sm">Each slab opens like a book, the way stone is laid in mirrored pairs so the vein runs on across the joint.</p>
      </section>
      {slabs.map((slab, index) => (
        <Chapter key={slab.id} slab={slab} index={index} onOpen={onOpen} />
      ))}
    </>
  );
}
