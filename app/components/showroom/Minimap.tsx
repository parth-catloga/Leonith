"use client";

import type { PointerEvent } from "react";
import { ROOM, ZONES } from "./floorPlan";
import { sizes, type SizeKey } from "./tiles";

const W = ROOM.maxX - ROOM.minX;
const D = ROOM.maxZ - ROOM.minZ;

// A plan of the room, top-right: where you are, which way you face, and the
// displays. Tap a display to go to it, or the floor to walk there.
export default function Minimap({
  x,
  z,
  yaw,
  active,
  onPick,
  onWalk,
}: {
  x: number;
  z: number;
  yaw: number;
  active: SizeKey | null;
  onPick: (size: SizeKey) => void;
  onWalk: (x: number, z: number) => void;
}) {
  const handleFloor = (event: PointerEvent<SVGRectElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    onWalk(ROOM.minX + ((event.clientX - box.left) / box.width) * W, ROOM.minZ + ((event.clientY - box.top) / box.height) * D);
  };

  // Facing direction: yaw 0 looks towards -z, which is up on the plan.
  const heading = (-yaw * 180) / Math.PI;

  return (
    <div className="absolute right-4 top-24 w-40 bg-cream/90 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur sm:w-52 lg:right-10 lg:top-28">
      <svg viewBox={`${ROOM.minX} ${ROOM.minZ} ${W} ${D}`} className="block w-full" role="group" aria-label="Showroom plan">
        <rect x={ROOM.minX} y={ROOM.minZ} width={W} height={D} fill="#f4efe7" stroke="#1a1a1a" strokeWidth={0.25} onPointerDown={handleFloor} className="cursor-pointer" />
        <rect x={-2} y={ROOM.maxZ - 0.3} width={4} height={0.6} fill="#f4efe7" />
        {sizes.map((size) => {
          const [cx, cz] = ZONES[size.key].center;
          const on = active === size.key;
          return (
            <g key={size.key} onPointerDown={() => onPick(size.key)} className="cursor-pointer" role="button" aria-label={`Go to ${size.label}`}>
              <circle cx={cx} cy={cz} r={on ? 2.3 : 1.9} fill={on ? "#1a1a1a" : "#d9d1c4"} />
              <text x={cx} y={cz + 0.5} textAnchor="middle" fontSize={1.25} fill={on ? "#fffbf5" : "#1a1a1a"} className="pointer-events-none select-none">
                {size.key.replace("x", "×")}
              </text>
            </g>
          );
        })}
        <g transform={`translate(${x} ${z}) rotate(${heading})`} className="pointer-events-none">
          <path d="M0 -2.4 L1.3 0.8 L0 0.1 L-1.3 0.8 Z" fill="#c8102e" />
        </g>
      </svg>
    </div>
  );
}
