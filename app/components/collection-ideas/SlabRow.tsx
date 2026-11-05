"use client";

import { useRef } from "react";
import type { IdeaProps } from "./CollectionIdeas";
import { slabs, textureUrl } from "./slabs";
import { useScrollProgress } from "./useScrollProgress";

const SLAB_W = 300;
const SLAB_H = 410;
const GAP = 240;
const EDGE = 10;

// Idea A: every slab stands upright in one long row on the cream floor, seen at
// an angle like Xiloteca's collection. Scrolling walks the camera along the row.
export default function SlabRow({ onOpen }: IdeaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const slabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollProgress(sectionRef, (progress) => {
    const travel = progress * (slabs.length - 1) * GAP;
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(-14vw, 10vh, 120px) rotateX(-14deg) rotateY(-50deg) translateZ(${travel}px)`;
    }

    // Slabs that have passed the camera fade away instead of flipping through it.
    slabRefs.current.forEach((slab, index) => {
      if (slab) {
        const z = travel - index * GAP;
        slab.style.opacity = String(Math.min(1, Math.max(0, 1 - (z - GAP * 0.6) / GAP)));
      }
    });
  });

  return (
    <section ref={sectionRef} style={{ height: `${slabs.length * 45 + 100}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden [perspective:1400px]">
        <div ref={worldRef} className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]">
          {slabs.map((slab, index) => (
            <div
              key={slab.id}
              ref={(element) => {
                slabRefs.current[index] = element;
              }}
              className="absolute [transform-style:preserve-3d]"
              style={{ transform: `translate3d(${-SLAB_W / 2}px, ${-SLAB_H / 2}px, ${-index * GAP}px)` }}
            >
              <button
                type="button"
                onClick={() => onOpen(slab)}
                aria-label={slab.name}
                className="group relative block cursor-pointer [transform-style:preserve-3d]"
                style={{ width: SLAB_W, height: SLAB_H }}
              >
                <span className="absolute inset-0 transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:-translate-y-5">
                  <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${textureUrl(slab)})` }} />
                  {/* The slab's cut edge, so it reads as a solid piece rather than a card. */}
                  <span
                    className="absolute right-0 top-0 h-full origin-right bg-black/25"
                    style={{ width: EDGE, transform: "rotateY(-90deg)", backgroundImage: `url(${textureUrl(slab)})`, backgroundBlendMode: "multiply" }}
                  />
                </span>
              </button>
              {/* The name printed on the floor beside the slab. */}
              <span
                className="pointer-events-none absolute whitespace-nowrap font-display text-2xl italic text-black/45"
                style={{ left: SLAB_W + 40, top: SLAB_H, transformOrigin: "0 0", transform: "rotateX(90deg) rotateZ(90deg)" }}
              >
                {slab.name}
              </span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute left-4 top-28 max-w-xs lg:left-14">
          <h1 className="font-display text-4xl leading-none">The Collection</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-black/50">{slabs.length} slabs · scroll to explore</p>
        </div>
      </div>
    </section>
  );
}
