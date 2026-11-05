"use client";

import { useRef, useState, type PointerEvent } from "react";

const RADIUS = 38;

// An on-screen stick for touch screens: push up to walk forward, sideways to step.
export default function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const active = useRef<number | null>(null);

  const update = (event: PointerEvent<HTMLDivElement>) => {
    const box = baseRef.current?.getBoundingClientRect();
    if (!box) return;
    let dx = event.clientX - (box.left + box.width / 2);
    let dy = event.clientY - (box.top + box.height / 2);
    const length = Math.hypot(dx, dy);
    if (length > RADIUS) {
      dx = (dx / length) * RADIUS;
      dy = (dy / length) * RADIUS;
    }
    setKnob({ x: dx, y: dy });
    onMove(dx / RADIUS, -dy / RADIUS);
  };

  const end = () => {
    active.current = null;
    setKnob({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div
      ref={baseRef}
      className="pointer-events-auto relative hidden h-24 w-24 shrink-0 touch-none rounded-full border border-black/10 bg-cream/60 backdrop-blur [@media(pointer:coarse)]:block"
      onPointerDown={(event) => {
        active.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event);
      }}
      onPointerMove={(event) => active.current === event.pointerId && update(event)}
      onPointerUp={end}
      onPointerCancel={end}
      role="application"
      aria-label="Walk"
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full bg-black/80 shadow-lg"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}
