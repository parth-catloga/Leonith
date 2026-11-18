// Journal posts for /blog and /blog/[slug].
// Placeholder content: the posts, dates and photos are dummies to be replaced with real articles.
// In `body`, a string starting with "## " is a subheading; wrap phrases in **double asterisks** for bold.

export type BlogPost = {
  slug: string;
  title: string;
  category: "Guides" | "Design" | "Care" | "Projects";
  date: string; // ISO date, e.g. 2026-11-04
  readMinutes: number;
  excerpt: string;
  image: string;
  alt: string;
  body: string[];
};

const texture = (name: string) => `/textures/${name}.webp`;

export const blogPosts: BlogPost[] = [
  {
    slug: "choosing-the-right-slab-size",
    title: "Choosing the right slab size for every room",
    category: "Guides",
    date: "2026-11-04",
    readMinutes: 6,
    excerpt:
      "Seven formats, from 800 × 2400 to 1600 × 3200 mm. Here's how to match the slab to the wall, floor or worktop so the room has as few joints as possible.",
    image: "/images/applications/wall-cladding.jpg",
    alt: "Living room wall clad in a single large porcelain slab",
    body: [
      "Large-format porcelain is all about **fewer joints**. The bigger the slab, the more the surface reads as one piece of stone. But bigger isn't automatically better: the right size depends on the room, the wall height and how the slab gets into the building.",
      "## Walls",
      "For a standard 2.7 m ceiling, the **800 × 3000 mm** and **1200 × 3000 mm** formats run floor to ceiling in one piece, so the veining carries from skirting to cornice. Taller feature walls in lobbies and double-height spaces suit the **1600 × 3200 mm** slab.",
      "## Floors",
      "Long corridors look best in **800 × 2400 mm planks** laid lengthways, which pull the eye through the space. Open-plan living areas can take the full **1600 × 3200 mm** slab, leaving only a handful of joints across the whole room.",
      "## Kitchens",
      "Measure the island before choosing. Our **1600 × 3200 mm** slab covers most islands in one piece, including a waterfall edge on one side, while the **800 × 3200 mm** format runs a full-length countertop without a joint.",
      "Not sure which works for your plan? Bring your drawings to the showroom and we'll lay the slabs out with you.",
    ],
  },
  {
    slug: "book-matched-feature-walls",
    title: "Book-matched feature walls, explained",
    category: "Design",
    date: "2026-10-22",
    readMinutes: 4,
    excerpt:
      "Two slabs, one mirrored pattern. How book-matching works, which designs suit it, and where it makes the biggest impact.",
    image: "/images/applications/feature-walls.jpg",
    alt: "Dining room with a black marble-look feature wall",
    body: [
      "Book-matching takes two consecutive slabs and mirrors them along a joint, so the veining opens out like the pages of a book. The result is a **symmetrical pattern** that turns a wall into a centrepiece.",
      "## Which designs work best",
      "Bold, directional veins give the most dramatic result. **Calacatta** and **Nero** looks are classic choices; softer stone looks still match, but the effect is quieter.",
      "## Where to use it",
      "Behind a bed, a sofa or a bath, on a reception desk front, or either side of a fireplace. Anywhere the eye lands first.",
      "Book-matched pairs are cut and numbered at the factory, so ask for them when you order.",
    ],
  },
  {
    slug: "caring-for-porcelain-surfaces",
    title: "Caring for porcelain surfaces day to day",
    category: "Care",
    date: "2026-10-09",
    readMinutes: 3,
    excerpt:
      "No sealing, no special products. A short guide to keeping countertops, floors and walls looking new for years.",
    image: texture("calacatta"),
    alt: "Close-up of Calacatta marble-look porcelain",
    body: [
      "Porcelain is dense and **non-porous**, so stains stay on the surface instead of soaking in. That makes daily care simple.",
      "## Everyday cleaning",
      "Wipe with **warm water and a neutral detergent**, then dry with a soft cloth to avoid streaks on polished finishes.",
      "## Tougher marks",
      "Dried-on grease, limescale or paint can be lifted with an alkaline cleaner or a non-abrasive cream. Avoid products containing hydrofluoric acid.",
      "## What you never need to do",
      "Seal it, oil it or polish it. A Leonith surface looks the same in ten years as on the day it was fitted.",
    ],
  },
  {
    slug: "villa-in-one-material",
    title: "Project: a villa finished in one material",
    category: "Projects",
    date: "2026-09-18",
    readMinutes: 5,
    excerpt:
      "Floors, walls, kitchen and bathrooms in a single marble look. How one family kept the whole house consistent.",
    image: "/images/home/hall-stair.jpg",
    alt: "Bright hallway with a staircase and continuous floor",
    body: [
      "When this family started planning their new home, they wanted every room to feel connected. The answer was to **use one slab design throughout**.",
      "## The floors",
      "**1600 × 3200 mm** slabs in a matt finish run from the entrance through the living room, with joints lined up to the doorways so the floor reads as one plane.",
      "## The kitchen",
      "The island is a single slab with a waterfall edge on both sides, and the splashback continues straight up from the countertop with no grout lines.",
      "## The bathrooms",
      "Polished slabs line the showers floor to ceiling, and the vanity tops were cut from the same batch so the colour matches exactly.",
    ],
  },
  {
    slug: "thin-slabs-for-renovations",
    title: "Renovating with 5 mm slabs, without demolition",
    category: "Guides",
    date: "2026-08-27",
    readMinutes: 4,
    excerpt:
      "Ultra-thin porcelain goes straight over existing tiles. Less dust, less noise and a new room in days instead of weeks.",
    image: texture("verde"),
    alt: "Close-up of green marble-look porcelain",
    body: [
      "Chipping off old tiles is the noisiest, dustiest part of any renovation. Our **5 mm slabs** let you skip it.",
      "## How it works",
      "As long as the existing tiles are sound and flat, the new slab is bonded directly over them with a **flexible tile adhesive**. The extra thickness is barely noticeable at door frames and switches.",
      "## Where it works",
      "Walls, splashbacks, cabinet fronts and furniture. For floors, we recommend the thicker 12 mm format.",
    ],
  },
  {
    slug: "matt-or-polished",
    title: "Matt or polished: picking the right finish",
    category: "Design",
    date: "2026-08-05",
    readMinutes: 3,
    excerpt:
      "The same slab can look completely different depending on the finish. Here's how light, grip and upkeep change between them.",
    image: "/images/home/kitchen-island.jpg",
    alt: "Open-plan kitchen with a long island",
    body: [
      "Finish changes how a slab catches light, how it feels underfoot and how it shows everyday marks.",
      "## Polished",
      "Reflects light and deepens the colour and veining. Ideal for **walls, vanity tops and living-room floors** where you want the stone to glow.",
      "## Matt",
      "Softer and more natural, with **better grip**. The safer choice for kitchens, entrances and bathroom floors, and it hides fingerprints.",
      "Can't decide? Order samples of both in the same design and look at them in your own light.",
    ],
  },
];

export const blogHref = (slug: string) => `/blog/${slug}`;

export const findPost = (slug: string) => blogPosts.find((post) => post.slug === slug);

export const formatPostDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
