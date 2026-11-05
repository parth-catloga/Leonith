"use client";

import { useEffect, useRef, useState } from "react";
import type { IdeaProps } from "./CollectionIdeas";
import { slabs, textureUrl } from "./slabs";

const TILE_W = 220;
const TILE_H = 290;
const CELL_W = 300;
const CELL_H = 400;
// Momentum left after the pointer lets go, per frame.
const FRICTION = 0.92;

const mod = (value: number, size: number) => ((value % size) + size) % size;

// Idea D: an endless staggered field of swatches you drag in any direction,
// like Xiloteca's grid view. Tiles wrap round, so the field never ends.
export default function SwatchField({ onOpen }: IdeaProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const measure = () =>
      setGrid({
        cols: Math.ceil(window.innerWidth / CELL_W) + 2,
        rows: Math.ceil(window.innerHeight / CELL_H) + 2,
      });

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    const { cols, rows } = grid;

    if (!field || cols === 0) {
      return;
    }

    const span = { x: cols * CELL_W, y: rows * CELL_H };
    const offset = { x: 0, y: 0 };
    const velocity = { x: -0.6, y: -0.3 };
    let dragging = false;
    let moved = 0;
    let last = { x: 0, y: 0 };
    let frame = 0;

    const place = () => {
      tileRefs.current.forEach((tile, index) => {
        if (!tile) {
          return;
        }

        const col = index % cols;
        const row = Math.floor(index / cols);
        const rawX = col * CELL_W + offset.x;
        // Every other column drops half a cell, for the staggered look.
        const rawY = row * CELL_H + offset.y + (col % 2) * (CELL_H / 2);
        const x = mod(rawX, span.x) - CELL_W;
        const y = mod(rawY, span.y) - CELL_H;
        tile.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        // Which slab sits here depends on how many times the tile has wrapped, so
        // the pattern stays put while you drag.
        const virtualCol = col - Math.floor(rawX / span.x) * cols;
        const virtualRow = row - Math.floor(rawY / span.y) * rows;
        const slabIndex = mod(virtualCol * 3 + virtualRow * 5, slabs.length);

        if (tile.dataset.slab !== String(slabIndex)) {
          tile.dataset.slab = String(slabIndex);
          const slab = slabs[slabIndex];
          (tile.firstElementChild as HTMLElement).style.backgroundImage = `url(${textureUrl(slab)})`;
          (tile.lastElementChild as HTMLElement).textContent = slab.name;
          tile.setAttribute("aria-label", slab.name);
        }
      });
    };

    const tick = () => {
      if (!dragging) {
        offset.x += velocity.x;
        offset.y += velocity.y;
        velocity.x *= FRICTION;
        velocity.y *= FRICTION;
      }
      place();
      frame = requestAnimationFrame(tick);
    };

    const down = (event: PointerEvent) => {
      dragging = true;
      moved = 0;
      last = { x: event.clientX, y: event.clientY };
      try {
        field.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic or already-released pointers can't be captured; dragging still works.
      }
    };
    const move = (event: PointerEvent) => {
      if (!dragging) {
        return;
      }
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      offset.x += dx;
      offset.y += dy;
      velocity.x = dx;
      velocity.y = dy;
      moved += Math.abs(dx) + Math.abs(dy);
      last = { x: event.clientX, y: event.clientY };
    };
    // Pointer capture sends the click to the field itself, so a tap that barely
    // moved is resolved to the swatch under the pointer here instead.
    const up = (event: PointerEvent) => {
      dragging = false;
      if (event.type === "pointerup" && moved < 6) {
        const tile = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-slab]");
        if (tile) {
          onOpen(slabs[Number(tile.dataset.slab)]);
        }
      }
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      velocity.x -= event.deltaX * 0.08;
      velocity.y -= event.deltaY * 0.08;
    };

    field.addEventListener("pointerdown", down);
    field.addEventListener("pointermove", move);
    field.addEventListener("pointerup", up);
    field.addEventListener("pointercancel", up);
    field.addEventListener("wheel", wheel, { passive: false });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      field.removeEventListener("pointerdown", down);
      field.removeEventListener("pointermove", move);
      field.removeEventListener("pointerup", up);
      field.removeEventListener("pointercancel", up);
      field.removeEventListener("wheel", wheel);
    };
  }, [grid, onOpen]);

  return (
    <section
      ref={fieldRef}
      data-lenis-prevent
      className="relative h-svh cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing"
    >
      {Array.from({ length: grid.cols * grid.rows }, (_, index) => (
        <button
          key={index}
          ref={(element) => {
            tileRefs.current[index] = element;
          }}
          type="button"
          className="group absolute left-0 top-0 flex flex-col gap-3 text-left will-change-transform"
          style={{ width: TILE_W }}
        >
          <span
            className="block w-full bg-center shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-[background-size] duration-700 [background-size:100%] group-hover:[background-size:135%]"
            style={{ height: TILE_H }}
          />
          <span className="font-display text-lg italic text-black/60" />
        </button>
      ))}
    </section>
  );
}
