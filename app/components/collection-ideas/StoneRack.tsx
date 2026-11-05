"use client";

import { useRef, useState } from "react";
import PillLink from "../PillLink";
import type { IdeaProps } from "./CollectionIdeas";
import { slabs, textureUrl } from "./slabs";
import { useScrollProgress } from "./useScrollProgress";

// Idea B: slabs lean on an A-frame rack like a stone yard. Scrolling tips the
// front slab forward and off, bringing the next one up to full face.
export default function StoneRack({ onOpen }: IdeaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const slabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [current, setCurrent] = useState(0);

  useScrollProgress(sectionRef, (progress) => {
    const position = progress * (slabs.length - 1);
    setCurrent(Math.round(position));

    slabRefs.current.forEach((slab, index) => {
      if (!slab) {
        return;
      }

      const depth = index - position;
      let transform: string;
      let opacity = 1;

      if (depth < 0) {
        // Tipping forward off the rack.
        transform = `rotateX(${-8 - depth * 70}deg)`;
        opacity = Math.max(0, 1 + depth * 1.4);
      } else {
        // Waiting in the stack, each a little further back and to the side.
        transform = `translate3d(${depth * 22}px, ${-depth * 8}px, ${-depth * 50}px) rotateX(-8deg)`;
        opacity = depth > 5 ? 0 : 1;
      }

      slab.style.transform = transform;
      slab.style.opacity = String(opacity);
      slab.style.zIndex = String(slabs.length - index);
      const shade = shadeRefs.current[index];
      if (shade) {
        shade.style.opacity = String(Math.min(0.55, Math.max(0, depth) * 0.12));
      }
    });
  });

  const slab = slabs[current];

  return (
    <section ref={sectionRef} style={{ height: `${slabs.length * 70}svh` }}>
      <div className="sticky top-0 grid h-svh grid-rows-[1fr_auto] gap-6 overflow-hidden px-4 pb-32 pt-28 lg:grid-cols-[1.3fr_1fr] lg:grid-rows-1 lg:px-14 lg:pb-28">
        <div className="relative [perspective:1600px]">
          {/* The rack's A-frame and base. */}
          <div className="absolute bottom-0 left-[8%] right-[18%] h-2 bg-black/70" />
          {/* Pushed back in depth so the slabs lean in front of the frame. */}
          <div className="absolute bottom-0 left-[20%] h-[78%] w-2 origin-bottom bg-black/50" style={{ transform: "translateZ(-420px) rotate(-8deg)" }} />
          <div className="absolute bottom-0 left-[42%] h-[78%] w-2 origin-bottom bg-black/50" style={{ transform: "translateZ(-420px) rotate(-8deg)" }} />

          {slabs.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                slabRefs.current[index] = element;
              }}
              type="button"
              onClick={() => onOpen(item)}
              aria-label={item.name}
              className="absolute bottom-2 left-[10%] aspect-[1/2] h-[88%] origin-bottom cursor-pointer bg-cover bg-center shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
              style={{ backgroundImage: `url(${textureUrl(item)})` }}
            >
              <span
                ref={(element) => {
                  shadeRefs.current[index] = element;
                }}
                className="absolute inset-0 bg-black"
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col justify-end gap-5 lg:pb-10">
          <p className="text-xs uppercase tracking-[0.14em] text-black/50">
            Slab {current + 1} / {slabs.length}
          </p>
          <h1 className="font-display text-5xl leading-none">{slab.name}</h1>
          <p className="text-sm">
            {slab.look} · {slab.finish} · {slab.size} · {slab.thickness}
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
