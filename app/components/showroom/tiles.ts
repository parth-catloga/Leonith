import { slabs } from "../collection-ideas/slabs";

// The showroom catalogue: every Leonith size, and every tile shown on that
// size's display. Real tiles only need an entry here and a photo in
// /public/tiles; the displays fill themselves from this list by size.

export type SizeKey = "800x2400" | "800x3000" | "800x3200" | "1200x3000" | "1600x3200" | "1200x2400" | "1200x2780";

export type DisplayKind = "slider" | "cabinet" | "towers" | "aframe" | "book" | "wing" | "gallery";

export type Size = {
  key: SizeKey;
  label: string;
  // Millimetres, so the displays are built to true scale.
  width: number;
  height: number;
  thickness: string;
  comingSoon?: boolean;
  display: DisplayKind;
  displayName: string;
  hint: string;
};

export type Tile = {
  id: string;
  name: string;
  size: SizeKey;
  look: string;
  finish: string;
  uses: string;
  // A photo of the tile face in /public. Placeholders use one of the shared
  // marble textures instead, cropped and toned so neighbours don't match.
  image?: string;
  texture: string;
  variant?: { offset: number; flip: boolean; tint: [number, number, number] };
  sample?: boolean;
};

export const sizes: Size[] = [
  {
    key: "1600x3200",
    label: "1600 × 3200 mm",
    width: 1600,
    height: 3200,
    thickness: "12 mm",
    display: "slider",
    displayName: "Sliding slab rack",
    hint: "Our largest slabs, hung from ceiling rails. Click a slab to slide it out of the rack.",
  },
  {
    key: "1200x3000",
    label: "1200 × 3000 mm",
    width: 1200,
    height: 3000,
    thickness: "5 mm",
    display: "book",
    displayName: "Swing-leaf book",
    hint: "Light 5 mm panels on a hinged post. Click a leaf to turn it like a page.",
  },
  {
    key: "800x3000",
    label: "800 × 3000 mm",
    width: 800,
    height: 3000,
    thickness: "15 mm",
    display: "towers",
    displayName: "Rotating towers",
    hint: "Six slabs round each turning column. Click a slab to turn it to face you.",
  },
  {
    key: "800x3200",
    label: "800 × 3200 mm",
    width: 800,
    height: 3200,
    thickness: "15 mm",
    display: "aframe",
    displayName: "A-frame racks",
    hint: "Full-height slabs leaning on steel A-frames. Click a slab to lift it forward.",
  },
  {
    key: "800x2400",
    label: "800 × 2400 mm",
    width: 800,
    height: 2400,
    thickness: "15 mm",
    display: "cabinet",
    displayName: "Pull-out cabinet",
    hint: "Slabs stored edge on. Click a frame to pull it out of the cabinet.",
  },
  {
    key: "1200x2400",
    label: "1200 × 2400 mm",
    width: 1200,
    height: 2400,
    thickness: "Coming soon",
    comingSoon: true,
    display: "gallery",
    displayName: "Gallery walls",
    hint: "A new format on the way. Walk the gallery for a first look.",
  },
  {
    key: "1200x2780",
    label: "1200 × 2780 mm",
    width: 1200,
    height: 2780,
    thickness: "Coming soon",
    comingSoon: true,
    display: "wing",
    displayName: "Wing wall",
    hint: "A new format on the way. Click a leaf to flip through the wall.",
  },
];

// Up to this many tiles per size; the displays are built with room for all of them.
export const TILES_PER_SIZE = 30;

const textures = ["calacatta", "carrara", "nero", "verde", "emperador", "rosa", "travertine"];
const lookOf: Record<string, string> = {
  calacatta: "Marble",
  carrara: "Marble",
  nero: "Marble",
  verde: "Marble",
  emperador: "Marble",
  rosa: "Onyx",
  travertine: "Travertine",
};
const nameOf: Record<string, string> = {
  calacatta: "Calacatta",
  carrara: "Carrara",
  nero: "Nero",
  verde: "Verde",
  emperador: "Emperador",
  rosa: "Rosa",
  travertine: "Travertine",
};
const tints: [number, number, number][] = [
  [1, 1, 1],
  [1, 0.96, 0.9],
  [0.93, 0.95, 1],
  [0.9, 0.88, 0.84],
  [1, 0.93, 0.93],
  [0.95, 1, 0.96],
];

// Range-sheet slabs keep their real names. Their size labels predate the
// split of 800 × 3000 / 3200 into two sizes, so those go on both displays.
const named: Tile[] = slabs.flatMap((slab) => {
  const keys: SizeKey[] = slab.size.startsWith("1600")
    ? ["1600x3200"]
    : slab.size.startsWith("1200")
      ? ["1200x3000"]
      : slab.size.startsWith("800 × 3")
        ? ["800x3000", "800x3200"]
        : ["800x2400"];
  return keys.map((size) => ({
    id: `${slab.id}-${size}`,
    name: slab.name,
    size,
    look: slab.look,
    finish: slab.finish,
    uses: slab.uses,
    texture: slab.texture,
  }));
});

// Fills each display to 30 with clearly labelled samples until the full
// catalogue is supplied.
function samples(size: Size, have: number): Tile[] {
  return Array.from({ length: Math.max(0, TILES_PER_SIZE - have) }, (_, index) => {
    const seed = index + size.width + size.height / 100;
    const texture = textures[(index + size.width / 400) % textures.length];
    const number = String(have + index + 1).padStart(2, "0");
    return {
      id: `${size.key}-sample-${number}`,
      name: `Sample ${nameOf[texture]} ${number}`,
      size: size.key,
      look: lookOf[texture],
      finish: index % 3 === 2 ? "Matt" : "Polished",
      uses: "Placeholder until the full catalogue is added",
      texture,
      variant: {
        offset: ((seed * 0.37) % 1 + 1) % 1,
        flip: index % 2 === 1,
        tint: tints[Math.floor(index / textures.length) % tints.length],
      },
      sample: true,
    };
  });
}

export const tiles: Tile[] = sizes.flatMap((size) => {
  const real = named.filter((tile) => tile.size === size.key).slice(0, TILES_PER_SIZE);
  return [...real, ...samples(size, real.length)];
});

export const tilesBySize = (key: SizeKey) => tiles.filter((tile) => tile.size === key);
export const sizeByKey = Object.fromEntries(sizes.map((size) => [size.key, size])) as Record<SizeKey, Size>;
export const tileImage = (tile: Tile) => tile.image ?? `/textures/${tile.texture}.webp`;
