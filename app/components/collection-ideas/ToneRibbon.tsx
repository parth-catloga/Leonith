"use client";

import { useEffect, useRef, useState } from "react";
import type { IdeaProps } from "./CollectionIdeas";
import { slabs, textureUrl } from "./slabs";

const TILE = 200;
const STEP = 230;
const ordered = [...slabs].sort((a, b) => b.tone - a.tone);

// Average colour of each placeholder texture, for the slider's track.
const swatch: Record<string, string> = {
  calacatta: "#e9e3d8",
  carrara: "#dfe1e2",
  rosa: "#e2c1ac",
  travertine: "#cfbc9a",
  emperador: "#66503c",
  verde: "#2e4538",
  nero: "#28272a",
};

// Idea H: every slab on one ribbon, lightest to darkest. Drag the ribbon or the
// tone slider; it settles on the nearest slab, which comes forward.
export default function ToneRibbon({ onOpen }: IdeaProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const position = useRef(0);
  const target = useRef(0);
  const [focus, setFocus] = useState(0);
  const [slider, setSlider] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let frame = 0;
    const last = ordered.length - 1;

    const tick = () => {
      position.current += (target.current - position.current) * 0.14;
      tileRefs.current.forEach((tile, index) => {
        if (tile) {
          const offset = index - position.current;
          const near = Math.max(0, 1 - Math.abs(offset));
          tile.style.transform = `translate3d(${offset * STEP - TILE / 2}px, 0, 0) scale(${1 + near * 0.25})`;
          tile.style.zIndex = String(Math.round(near * 10));
        }
      });
      const nearest = Math.round(position.current);
      setFocus((current) => (current === nearest ? current : nearest));
      setSlider((current) => (Math.abs(current - position.current) < 0.005 ? current : position.current));
      frame = requestAnimationFrame(tick);
    };

    const down = (event: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = event.clientX;
      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic or already-released pointers can't be captured; dragging still works.
      }
    };
    const move = (event: PointerEvent) => {
      if (dragging) {
        const dx = event.clientX - lastX;
        moved += Math.abs(dx);
        lastX = event.clientX;
        target.current = Math.min(last, Math.max(0, target.current - dx / STEP));
      }
    };
    // Pointer capture sends clicks to the stage, so taps are resolved here from
    // whatever tile sits under the pointer.
    const up = (event: PointerEvent) => {
      dragging = false;
      target.current = Math.round(target.current);
      const tile = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-index]");
      if (event.type !== "pointerup" || !tile || moved > 6) {
        return;
      }
      const index = Number(tile.dataset.index);
      // The first click brings a slab forward; clicking it again opens it.
      if (index === Math.round(position.current)) {
        onOpen(ordered[index]);
      } else {
        target.current = index;
      }
    };

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
    };
  }, [onOpen]);

  const slab = ordered[focus];
  const track = `linear-gradient(90deg, ${ordered.map((item) => swatch[item.texture]).join(", ")})`;

  return (
    <section className="flex h-svh flex-col px-4 pb-36 pt-28 lg:px-14" data-lenis-prevent>
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-display text-4xl leading-none lg:text-5xl">From white to black</h1>
        <p className="text-xs uppercase tracking-[0.14em] text-black/50">
          {focus + 1} / {ordered.length}
        </p>
      </div>

      <div ref={stageRef} className="relative my-6 flex-1 cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing">
        {ordered.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tileRefs.current[index] = element;
            }}
            data-index={index}
            type="button"
            aria-label={item.name}
            className="absolute left-1/2 top-1/2 -mt-[140px] h-[280px] bg-cover bg-center shadow-[0_16px_40px_rgba(0,0,0,0.15)] will-change-transform"
            style={{ width: TILE, backgroundImage: `url(${textureUrl(item)})` }}
          />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <p className="text-center font-display text-3xl">{slab.name}</p>
        <p className="text-center text-xs uppercase tracking-[0.14em] text-black/60">
          {slab.look} · {slab.finish}
        </p>
        <input
          type="range"
          min={0}
          max={ordered.length - 1}
          step={0.01}
          value={slider}
          onChange={(event) => {
            target.current = Number(event.target.value);
          }}
          onPointerUp={() => {
            target.current = Math.round(target.current);
          }}
          aria-label="Tone"
          className="h-3 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cream [&::-webkit-slider-thumb]:bg-black"
          style={{ background: track }}
        />
        <div className="flex justify-between text-[11px] uppercase tracking-[0.14em] text-black/50">
          <span>Light</span>
          <span>Warm</span>
          <span>Deep</span>
          <span>Dark</span>
        </div>
      </div>
    </section>
  );
}
