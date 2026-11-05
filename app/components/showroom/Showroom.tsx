"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PillLink from "../PillLink";
import Joystick from "./Joystick";
import Minimap from "./Minimap";
import type { Selection, ShowroomApi } from "./scene";
import TileDetail, { enquiryHref } from "./TileDetail";
import { sizeByKey, sizes, type SizeKey, type Tile } from "./tiles";

const stepLabels: Record<string, [string, string]> = {
  slider: ["Previous slab", "Next slab"],
  cabinet: ["Previous frame", "Next frame"],
  towers: ["Previous face", "Next face"],
  aframe: ["Previous slab", "Next slab"],
  book: ["Turn back", "Turn page"],
  wing: ["Turn back", "Turn page"],
  gallery: ["Previous slab", "Next slab"],
};

// A walk-through of the Leonith showroom. Every size has its own display,
// built to true scale and filled with that size's tiles.
export default function Showroom() {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Partial<Record<SizeKey, HTMLButtonElement | null>>>({});
  const apiRef = useRef<ShowroomApi | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [zone, setZone] = useState<SizeKey | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [openTile, setOpenTile] = useState<Tile | null>(null);
  const [pose, setPose] = useState({ x: 0, z: 9, yaw: 0 });
  const [helpOpen, setHelpOpen] = useState(true);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let api: ShowroomApi | undefined;

    import("./scene")
      .then(({ createShowroom }) =>
        createShowroom(host, labelRefs.current, {
          onProgress: setProgress,
          onZone: setZone,
          onSelect: setSelection,
          onOpen: setOpenTile,
          onPose: (x, z, yaw) => setPose({ x, z, yaw }),
        }),
      )
      .then((created) => {
        if (cancelled) {
          created.dispose();
          return;
        }
        api = created;
        apiRef.current = created;
        setReady(true);
      })
      .catch((error) => {
        console.error(error);
        setFailed(true);
      });

    return () => {
      cancelled = true;
      api?.dispose();
      apiRef.current = null;
    };
  }, []);

  const closeTile = useCallback(() => setOpenTile(null), []);
  const onMove = useCallback((x: number, y: number) => apiRef.current?.setMove(x, y), []);

  // The panel follows what you picked, or the display you're standing at.
  const panelSize = selection && (!zone || zone === selection.size) ? selection.size : zone;
  const size = panelSize ? sizeByKey[panelSize] : null;
  const tile = selection && selection.size === panelSize ? selection.tile : null;
  const steps = size ? stepLabels[size.display] : undefined;

  return (
    <section className="relative h-svh overflow-hidden bg-[#e9e4dc]">
      <div ref={hostRef} data-lenis-prevent className="absolute inset-0 touch-none" aria-label="3D showroom" />

      {/* Display names floating over the room. The scene moves them every frame. */}
      {sizes.map((item) => (
        <button
          key={item.key}
          ref={(element) => {
            labelRefs.current[item.key] = element;
          }}
          type="button"
          onClick={() => apiRef.current?.goToZone(item.key)}
          className="absolute left-0 top-0 flex flex-col items-center gap-1 opacity-0 transition-opacity duration-300"
          tabIndex={-1}
        >
          <span className="whitespace-nowrap rounded-full bg-black/85 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-cream shadow-lg backdrop-blur">
            {item.label}
          </span>
          <span className="whitespace-nowrap rounded-full bg-cream/90 px-3 py-1 text-[10px] uppercase tracking-[0.12em] shadow">
            {item.comingSoon ? "Coming soon" : item.displayName}
          </span>
        </button>
      ))}

      {ready && helpOpen && !selection && (
        <div className="absolute left-4 right-4 top-[15rem] flex max-w-xs flex-col gap-2 bg-cream/90 p-5 sm:right-auto sm:top-24 text-[11px] uppercase tracking-[0.12em] text-black/70 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur lg:left-10 lg:top-28">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl normal-case leading-none tracking-normal text-black">Walk the showroom</h1>
            <button type="button" onClick={() => setHelpOpen(false)} aria-label="Hide help" className="-mr-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/15 text-sm">
              ×
            </button>
          </div>
          <p className="normal-case tracking-normal text-black/70">Every size on its own display, built to true scale.</p>
          <p>Drag to look around</p>
          <p className="hidden [@media(pointer:fine)]:block">Walk with W A S D or the arrow keys</p>
          <p className="[@media(pointer:fine)]:hidden">Walk with the stick, bottom left</p>
          <p>Tap the floor to walk there</p>
          <p>Tap a tile to see it, tap again for details</p>
        </div>
      )}

      {ready && <Minimap x={pose.x} z={pose.z} yaw={pose.yaw} active={panelSize} onPick={(key) => apiRef.current?.goToZone(key)} onWalk={(x, z) => apiRef.current?.walkTo(x, z)} />}

      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-[#e9e4dc]">
          <div className="flex w-56 flex-col items-center gap-4">
            <p className="text-xs uppercase tracking-[0.14em] text-black/60">
              {failed ? "The showroom couldn't load on this device." : "Opening the showroom"}
            </p>
            {!failed && (
              <div className="h-px w-full bg-black/15">
                <div className="h-px bg-black transition-[width] duration-300" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 lg:p-8">
        {ready && <Joystick onMove={onMove} />}
        {size && (
          <div className="pointer-events-auto flex w-full max-w-md flex-col gap-3 bg-cream/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur sm:gap-4 sm:p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-black/50">
                {size.label} · {size.thickness}
              </p>
              <h2 className="mt-1 font-display text-2xl leading-none sm:text-3xl">{size.displayName}</h2>
            </div>
            <p className="hidden text-sm text-black/70 sm:block">{size.hint}</p>

            {tile ? (
              <div className="flex flex-col gap-3 border-t border-black/10 pt-3 sm:pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-xl leading-tight sm:text-2xl">
                    {tile.name}
                    {tile.sample && <span className="ml-2 align-middle font-label text-[10px] uppercase tracking-[0.14em] text-black/40">placeholder</span>}
                  </p>
                  {steps && selection && (
                    <div className="flex shrink-0 items-center gap-1">
                      <button type="button" onClick={() => apiRef.current?.step(selection.size, -1)} aria-label={steps[0]} className="grid h-9 w-9 place-items-center rounded-full border border-black/15">
                        ←
                      </button>
                      <span className="w-12 text-center text-[11px] tabular-nums text-black/50">
                        {selection.index + 1} / 30
                      </span>
                      <button type="button" onClick={() => apiRef.current?.step(selection.size, 1)} aria-label={steps[1]} className="grid h-9 w-9 place-items-center rounded-full border border-black/15">
                        →
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setOpenTile(tile)} className="rounded-full border border-black/15 px-6 py-3 text-xs uppercase tracking-[0.14em]">
                    Details
                  </button>
                  <PillLink href={enquiryHref(tile, size)}>{size.comingSoon ? "Get notified" : "Enquire"}</PillLink>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => apiRef.current?.goToZone(size.key)} className="self-start rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.14em] text-cream">
                See the tiles
              </button>
            )}
          </div>
        )}

        <nav aria-label="Showroom displays" className="pointer-events-auto flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {sizes.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => apiRef.current?.goToZone(item.key)}
              aria-current={panelSize === item.key}
              className={`shrink-0 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.14em] ${panelSize === item.key ? "bg-black text-cream" : "bg-cream/90 shadow"}`}
            >
              {item.label.replace(" mm", "")}
              {item.comingSoon && <span className="ml-1.5 opacity-60">· soon</span>}
            </button>
          ))}
        </nav>
      </div>

      <TileDetail tile={openTile} onClose={closeTile} />
    </section>
  );
}
