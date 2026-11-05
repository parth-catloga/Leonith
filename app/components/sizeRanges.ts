// Slab images use the procedural marble textures until real design photography is supplied.
export const sizeRanges = [
  {
    title: "1600 × 3200 mm",
    thickness: "12 mm thick",
    description:
      "Our largest format. One slab covers a countertop, a wall or a floor with almost no joints, so the stone reads uninterrupted.",
    images: [
      { texture: "calacatta", caption: "Calacatta Borghini · Polished" },
    ],
  },
  {
    title: "1200 × 3000 mm",
    thickness: "5 mm thick",
    description:
      "Ultra-thin and light. Textured metal, stone and wood looks that clad large surfaces with minimal weight.",
    images: [
      { texture: "emperador", caption: "Ferro Corten · Rustic matt" },
    ],
  },
  {
    title: "800 × 3000 / 3200 mm",
    thickness: "15 mm thick",
    description:
      "Long, narrow slabs that run the full length of a kitchen countertop or a staircase in one piece.",
    images: [
      { texture: "nero", caption: "Marquina Nero · Polished" },
    ],
  },
  {
    title: "800 × 2400 mm",
    thickness: "15 mm thick",
    description:
      "Our most compact slab, for kitchen countertops and staircases, including terrazzo looks and carved relief surfaces.",
    images: [
      { texture: "travertine", caption: "Saga Barley · Polished and matt" },
    ],
  },
  {
    title: "1200 × 2400 /\n2780 mm",
    thickness: "Coming soon",
    comingSoon: true,
    description: "Two new formats are on the way. Get in touch to hear first when they arrive.",
    images: [{ texture: "travertine", caption: "Coming soon" }],
  },
];

export type SizeRange = (typeof sizeRanges)[number];
