"use client";

import { useLenis } from "lenis/react";
import { useCallback, useEffect, useState, type ComponentType } from "react";
import BookMatched from "./BookMatched";
import IndexList from "./IndexList";
import RoomSwap from "./RoomSwap";
import SampleBox from "./SampleBox";
import SizeWall from "./SizeWall";
import SlabDetail from "./SlabDetail";
import SlabRow from "./SlabRow";
import type { Slab } from "./slabs";
import StoneRack from "./StoneRack";
import SwatchField from "./SwatchField";
import ToneRibbon from "./ToneRibbon";

export type IdeaProps = { onOpen: (slab: Slab) => void };

const ideas: { key: string; name: string; hint: string; Idea: ComponentType<IdeaProps> }[] = [
  { key: "a", name: "Slab row", hint: "Scroll to walk along the row. Click a slab.", Idea: SlabRow },
  { key: "b", name: "Stone yard rack", hint: "Scroll to flip through the rack.", Idea: StoneRack },
  { key: "c", name: "True-scale size wall", hint: "Pick a finish. Click a format.", Idea: SizeWall },
  { key: "d", name: "Draggable swatch field", hint: "Drag in any direction. Click a swatch.", Idea: SwatchField },
  { key: "e", name: "Index list", hint: "Hover a name to preview it. Click to open.", Idea: IndexList },
  { key: "f", name: "Book-matched chapters", hint: "Scroll to open each slab like a book.", Idea: BookMatched },
  { key: "g", name: "Room swap", hint: "Pick a surface, then a slab.", Idea: RoomSwap },
  { key: "h", name: "Tone ribbon", hint: "Drag the ribbon or the tone slider.", Idea: ToneRibbon },
  { key: "i", name: "Sample box", hint: "Click a chip to pull it out. Flip it.", Idea: SampleBox },
];

// Prototype page: every collection idea, switchable from the bar at the bottom.
// The idea lives in the URL hash so a link like /collection-ideas#g opens that one.
export default function CollectionIdeas() {
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const [openSlab, setOpenSlab] = useState<Slab | null>(null);

  useEffect(() => {
    const readHash = () => {
      const index = ideas.findIndex((idea) => idea.key === window.location.hash.slice(1));
      setActive(index === -1 ? 0 : index);
    };

    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const choose = (index: number) => {
    const next = (index + ideas.length) % ideas.length;
    window.history.replaceState(null, "", `#${ideas[next].key}`);
    setActive(next);
    setOpenSlab(null);
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  };

  const closeSlab = useCallback(() => setOpenSlab(null), []);
  const { Idea, name, hint, key } = ideas[active];

  return (
    <>
      <Idea key={key} onOpen={setOpenSlab} />

      <nav
        aria-label="Collection ideas"
        className="fixed inset-x-0 bottom-4 z-[60] mx-auto flex w-[min(44rem,calc(100%-2rem))] flex-col gap-2 rounded-2xl bg-black/85 p-3 font-label text-cream backdrop-blur"
      >
        <div className="flex items-center justify-between gap-3 px-1">
          <p className="text-xs uppercase tracking-[0.14em]">
            Idea {key.toUpperCase()} · {name}
          </p>
          <p className="hidden text-xs text-cream/60 sm:block">{hint}</p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => choose(active - 1)} className="h-9 rounded-full px-3 hover:bg-white/10" aria-label="Previous idea">
            ←
          </button>
          <div className="flex flex-1 justify-between">
            {ideas.map((idea, index) => (
              <button
                key={idea.key}
                type="button"
                onClick={() => choose(index)}
                aria-label={`Idea ${idea.key.toUpperCase()}: ${idea.name}`}
                aria-current={index === active}
                className={`grid h-9 w-9 place-items-center rounded-full text-xs uppercase transition-colors ${
                  index === active ? "bg-cream text-black" : "hover:bg-white/10"
                }`}
              >
                {idea.key}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => choose(active + 1)} className="h-9 rounded-full px-3 hover:bg-white/10" aria-label="Next idea">
            →
          </button>
        </div>
      </nav>

      <SlabDetail slab={openSlab} onClose={closeSlab} />
    </>
  );
}
