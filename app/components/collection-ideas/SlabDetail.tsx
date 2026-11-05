"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";
import PillLink from "../PillLink";
import { textureUrl, type Slab } from "./slabs";

// The card every idea opens when a slab is picked, like Xiloteca's info panel.
export default function SlabDetail({ slab, onClose }: { slab: Slab | null; onClose: () => void }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!slab) {
      return;
    }

    lenis?.stop();
    const handleKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);

    return () => {
      lenis?.start();
      window.removeEventListener("keydown", handleKey);
    };
  }, [slab, lenis, onClose]);

  if (!slab) {
    return null;
  }

  const specs = [
    ["Look", slab.look],
    ["Finish", slab.finish],
    ["Size", slab.size],
    ["Thickness", slab.thickness],
    ["Best for", slab.uses],
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 font-label"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={slab.name}
    >
      <div
        className="relative grid max-h-[90svh] w-full max-w-3xl overflow-auto bg-cream text-black md:grid-cols-[1fr_1.1fr]"
        onClick={(event) => event.stopPropagation()}
        data-lenis-prevent
      >
        <div className="aspect-[4/5] bg-cover bg-center md:aspect-auto" style={{ backgroundImage: `url(${textureUrl(slab)})` }} />
        <div className="flex flex-col gap-6 p-6 md:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-black/15 bg-cream text-lg"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="pr-10 font-display text-4xl leading-none">{slab.name}</h2>
          <dl className="flex flex-col text-sm">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 border-t border-black/10 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-black/50">{label}</dt>
                <dd className="text-right">{value}</dd>
              </div>
            ))}
          </dl>
          <PillLink href="/contact">Enquire</PillLink>
        </div>
      </div>
    </div>
  );
}
