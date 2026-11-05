"use client";

import { useEffect, useRef, useState } from "react";
import type { IdeaProps } from "./CollectionIdeas";
import { looks, slabs, textureUrl, type Slab } from "./slabs";

// Idea E: an editorial index of names. Hovering a row floats that slab beside
// the cursor; clicking opens it. Filters narrow the list by look.
export default function IndexList({ onOpen }: IdeaProps) {
  const [look, setLook] = useState<(typeof looks)[number]>("All");
  const [hovered, setHovered] = useState<Slab | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const shown = look === "All" ? slabs : slabs.filter((slab) => slab.look === look);

  // The preview eases after the cursor rather than sticking to it.
  useEffect(() => {
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const move = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };
    const tick = () => {
      current.x += (target.x - current.x) * 0.15;
      current.y += (target.y - current.y) * 0.15;
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${current.x + 40}px, ${current.y - 150}px, 0) rotate(${(target.x - current.x) * 0.03}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="min-h-svh px-4 pb-40 pt-28 lg:px-14">
      <div className="flex flex-col justify-between gap-6 border-b border-black/70 pb-6 md:flex-row md:items-end">
        <h1 className="font-display text-5xl leading-none lg:text-7xl">The Collection</h1>
        <div className="flex flex-wrap gap-2">
          {looks.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLook(option)}
              aria-pressed={option === look}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors ${
                option === look ? "border-black bg-black text-cream" : "border-black/15 hover:border-black/40"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <ul onPointerLeave={() => setHovered(null)}>
        {shown.map((slab, index) => (
          <li key={slab.id}>
            <button
              type="button"
              onClick={() => onOpen(slab)}
              onPointerEnter={() => setHovered(slab)}
              className={`grid w-full grid-cols-[2rem_1fr] items-baseline gap-x-4 border-b border-black/10 py-5 text-left transition-opacity md:grid-cols-[3rem_1fr_9rem_11rem_11rem] ${
                hovered && hovered.id !== slab.id ? "opacity-35" : ""
              }`}
            >
              <span className="text-xs text-black/40">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-display text-3xl leading-tight md:text-5xl">{slab.name}</span>
              <span className="col-start-2 text-xs uppercase tracking-[0.14em] text-black/60 md:col-start-auto">{slab.look}</span>
              <span className="hidden text-xs uppercase tracking-[0.14em] text-black/60 md:block">{slab.finish}</span>
              <span className="hidden text-xs uppercase tracking-[0.14em] text-black/60 md:block">{slab.size}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Only on devices with a mouse; touch screens open the slab on tap instead. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden h-72 w-52 bg-cover bg-center shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-opacity duration-300 [@media(pointer:fine)]:block ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: hovered ? `url(${textureUrl(hovered)})` : undefined }}
      />
    </section>
  );
}
