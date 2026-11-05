// Prototype data for the collection page ideas. Names and specs come from the
// size range sheet; images are the procedural placeholders until photos arrive.
export type Slab = {
  id: string;
  name: string;
  look: "Marble" | "Onyx" | "Metal" | "Terrazzo";
  finish: string;
  size: string;
  thickness: string;
  uses: string;
  texture: string;
  // 0 is black, 1 is white. Measured from each placeholder texture.
  tone: number;
};

export const slabs: Slab[] = [
  {
    id: "calacatta-borghini",
    name: "Calacatta Borghini",
    look: "Marble",
    finish: "Polished",
    size: "1600 × 3200 mm",
    thickness: "12 mm",
    uses: "Countertops, feature walls, floors",
    texture: "calacatta",
    tone: 0.89,
  },
  {
    id: "verde-alpi",
    name: "Verde Alpi",
    look: "Marble",
    finish: "Matt",
    size: "1600 × 3200 mm",
    thickness: "12 mm",
    uses: "Feature walls, bathrooms, islands",
    texture: "verde",
    tone: 0.25,
  },
  {
    id: "ferro-corten",
    name: "Ferro Corten",
    look: "Metal",
    finish: "Rustic matt",
    size: "1200 × 3000 mm",
    thickness: "5 mm",
    uses: "Wall cladding, facades, furniture",
    texture: "emperador",
    tone: 0.33,
  },
  {
    id: "gravel-steel",
    name: "Gravel Steel",
    look: "Metal",
    finish: "Bush hammered",
    size: "1200 × 3000 mm",
    thickness: "5 mm",
    uses: "Wall cladding, lift lobbies",
    texture: "carrara",
    tone: 0.86,
  },
  {
    id: "marquina-nero",
    name: "Marquina Nero",
    look: "Marble",
    finish: "Polished",
    size: "800 × 3000 / 3200 mm",
    thickness: "15 mm",
    uses: "Countertops, staircases",
    texture: "nero",
    tone: 0.15,
  },
  {
    id: "pearl-cream-onyx",
    name: "Pearl Cream Onyx",
    look: "Onyx",
    finish: "Polished and matt",
    size: "800 × 3000 / 3200 mm",
    thickness: "15 mm",
    uses: "Backlit walls, bars, vanities",
    texture: "rosa",
    tone: 0.78,
  },
  {
    id: "saga-barley",
    name: "Saga Barley",
    look: "Terrazzo",
    finish: "Polished and matt",
    size: "800 × 2400 mm",
    thickness: "15 mm",
    uses: "Countertops, staircases, floors",
    texture: "travertine",
    tone: 0.74,
  },
  {
    id: "apuane-statuario",
    name: "Apuane Statuario",
    look: "Marble",
    finish: "Polished and matt",
    size: "800 × 2400 mm",
    thickness: "15 mm",
    uses: "Countertops, bathroom walls",
    texture: "carrara",
    tone: 0.9,
  },
];

export const looks = ["All", "Marble", "Onyx", "Metal", "Terrazzo"] as const;

// The four formats, in millimetres, for the true-scale wall.
export const formats = [
  { label: "800 × 2400", width: 800, height: 2400, thickness: "15 mm" },
  { label: "800 × 3200", width: 800, height: 3200, thickness: "15 mm" },
  { label: "1200 × 3000", width: 1200, height: 3000, thickness: "5 mm" },
  { label: "1600 × 3200", width: 1600, height: 3200, thickness: "12 mm" },
];

export const textureUrl = (slab: Pick<Slab, "texture">) => `/textures/${slab.texture}.webp`;
