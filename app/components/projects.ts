// Projects: the first four are featured on the about page, all of them are listed on /projects,
// and each has its own page at /projects/<slug>.
// DUMMY CONTENT: every project below (name, type, location, year, applications, slab, brief and
// photo) is a stand-in so the layout can be reviewed. None of them are real Leonith projects.
// Replace each with a real project and its own photography, or delete it, before the site goes live.

export type Project = {
  slug: string;
  name: string;
  type: "Residential" | "Hospitality" | "Commercial";
  // One line, used in the about page list and as the page description.
  text: string;
  image: string;
  location: string;
  year: string;
  applications: string;
  slab: string;
  // The "Brief" on the project page, one string per paragraph.
  brief: string[];
  // Four photos shown two to a row under the brief (portrait crops, 3:4).
  gallery: string[];
};

export const projects: Project[] = [
  {
    slug: "private-villa",
    name: "Private villa",
    type: "Residential",
    text: "An open kitchen and living space finished in one continuous marble look, from the island to the floor.",
    image: "/images/home/kitchen-island.jpg",
    location: "Ahmedabad, Gujarat",
    year: "2024",
    applications: "Kitchen countertops, flooring",
    slab: "Calacatta, polished, 1600 × 3200 mm",
    brief: [
      "The owners wanted the kitchen, dining and living areas to read as one open space. A single marble look runs from the island worktop down to the floor, so the eye travels across the room without a break.",
      "Our 1600 × 3200 mm slabs cover the island in one piece, with the veining wrapping over the edge and down the sides. On the floor, the same format means only a handful of joints across the whole ground level.",
      "Because porcelain resists heat, stains and scratches, the family cooks on it every day without worrying about sealing or special cleaners.",
    ],
    gallery: [
      "/images/home/hall-window.jpg",
      "/images/home/kitchen-dining.jpg",
      "/images/applications/wall-cladding.jpg",
      "/images/applications/kitchen-countertops.jpg",
    ],
  },
  {
    slug: "boutique-hotel-lobby",
    name: "Boutique hotel lobby",
    type: "Hospitality",
    text: "Full-height wall cladding with book-matched veining that greets guests the moment they walk in.",
    image: "/images/home/hall-window.jpg",
    location: "Udaipur, Rajasthan",
    year: "2024",
    applications: "Wall cladding, feature walls",
    slab: "Statuario, matt, 1200 × 2400 mm",
    brief: [
      "The hotel wanted a lobby that felt calm and generous from the first step inside. Full-height slabs clad the reception wall, with book-matched veining that mirrors across the centre line.",
      "The matt finish keeps reflections soft under the large windows, and the slabs' low weight made it possible to clad the existing walls without structural work.",
      "Busy lobbies need surfaces that stay looking new. A wipe with water and a neutral detergent is all the cleaning team needs.",
    ],
    gallery: [
      "/images/home/hall-stair.jpg",
      "/images/applications/bathroom-walls.jpg",
      "/images/home/kitchen-detail.jpg",
      "/images/applications/staircases.jpg",
    ],
  },
  {
    slug: "sea-facing-penthouse",
    name: "Sea-facing penthouse",
    type: "Residential",
    text: "Large floor slabs carried up the staircase, so the same surface runs through both levels.",
    image: "/images/home/hall-stair.jpg",
    location: "Mumbai, Maharashtra",
    year: "2023",
    applications: "Flooring, staircases",
    slab: "Travertine, matt, 1600 × 3200 mm",
    brief: [
      "This two-level penthouse needed one material that could carry the design from the entrance hall up to the bedrooms. The same travertine look runs across the floors and up every step of the staircase.",
      "Treads and risers were cut from full slabs so the veining lines up from one step to the next. Porcelain doesn't fade in the strong coastal sun, so the floor by the windows stays the same colour as the rest.",
    ],
    gallery: [
      "/images/applications/feature-walls.jpg",
      "/images/home/hall-corridor.jpg",
      "/images/applications/flooring.jpg",
      "/images/home/kitchen-island.jpg",
    ],
  },
  {
    slug: "corporate-headquarters",
    name: "Corporate headquarters",
    type: "Commercial",
    text: "A reception feature wall and meeting-room surfaces built to take heavy daily use.",
    image: "/images/applications/feature-walls.jpg",
    location: "Bengaluru, Karnataka",
    year: "2023",
    applications: "Feature walls, countertops",
    slab: "Nero Marquina, polished, 800 × 1600 mm",
    brief: [
      "The brief was a reception that makes a confident first impression. A polished dark marble look covers the feature wall behind the front desk, with the company logo set in front of it.",
      "The same slabs top the meeting-room tables and the café counter, where hundreds of people pass every day. Scratches, coffee and heat leave no mark.",
    ],
    gallery: [
      "/images/home/kitchen-dining.jpg",
      "/images/applications/wall-cladding.jpg",
      "/images/applications/kitchen-countertops.jpg",
      "/images/home/hall-window.jpg",
    ],
  },
  {
    slug: "family-kitchen",
    name: "Family kitchen",
    type: "Residential",
    text: "Thin countertop slabs with matching splashbacks, so the veining runs from worktop to ceiling.",
    image: "/images/home/kitchen-dining.jpg",
    location: "Rajkot, Gujarat",
    year: "2024",
    applications: "Kitchen countertops, splashbacks",
    slab: "Carrara, polished, 1600 × 3200 mm",
    brief: [
      "A busy family kitchen that needed to be easy to look after. The countertop and splashback are cut from the same slabs, so the veining continues from the worktop up the wall.",
      "Porcelain is non-porous, so spills wipe away and nothing soaks in. Our 1600 × 3200 mm slab is NSF certified for food contact.",
    ],
    gallery: [
      "/images/applications/bathroom-walls.jpg",
      "/images/home/kitchen-detail.jpg",
      "/images/applications/staircases.jpg",
      "/images/home/hall-stair.jpg",
    ],
  },
  {
    slug: "spa-suites",
    name: "Spa suites",
    type: "Hospitality",
    text: "Floor-to-ceiling bathroom walls with no grout lines to trap moisture or dirt.",
    image: "/images/applications/bathroom-walls.jpg",
    location: "Goa",
    year: "2023",
    applications: "Bathroom walls, shower enclosures",
    slab: "Verde, polished, 1200 × 2400 mm",
    brief: [
      "Each spa suite has a walk-in shower and vanity wall finished in a deep green marble look. Full-height slabs mean almost no grout lines, so there is nowhere for moisture or dirt to collect.",
      "The housekeeping team cleans the walls with water and a neutral detergent between guests, and the surface looks the same as on opening day.",
    ],
    gallery: [
      "/images/home/hall-corridor.jpg",
      "/images/applications/flooring.jpg",
      "/images/home/kitchen-island.jpg",
      "/images/applications/feature-walls.jpg",
    ],
  },
  {
    slug: "gallery-corridor",
    name: "Gallery corridor",
    type: "Commercial",
    text: "Long runs of polished flooring that reflect the light along the whole length of the space.",
    image: "/images/home/hall-corridor.jpg",
    location: "New Delhi",
    year: "2022",
    applications: "Flooring",
    slab: "Bianco, polished, 1600 × 3200 mm",
    brief: [
      "A long gallery corridor where the floor needed to stay quiet and let the artwork lead. Polished slabs reflect the light along the whole length of the space.",
      "Large formats mean far fewer joints, so the floor reads as one continuous surface from end to end.",
    ],
    gallery: [
      "/images/applications/wall-cladding.jpg",
      "/images/applications/kitchen-countertops.jpg",
      "/images/home/hall-window.jpg",
      "/images/home/kitchen-dining.jpg",
    ],
  },
  {
    slug: "townhouse-renovation",
    name: "Townhouse renovation",
    type: "Residential",
    text: "5 mm slabs laid straight over the old wall tiles, with no demolition and no rubble.",
    image: "/images/applications/wall-cladding.jpg",
    location: "Pune, Maharashtra",
    year: "2022",
    applications: "Wall cladding",
    slab: "Emperador, matt, 5 mm thin slab",
    brief: [
      "The owners wanted to update every wall in the house without weeks of demolition. Our 5 mm thin slabs went straight over the existing tiles.",
      "No rubble, less dust and a much shorter job on site, and the finished walls look like they were built that way.",
    ],
    gallery: [
      "/images/home/kitchen-detail.jpg",
      "/images/applications/staircases.jpg",
      "/images/home/hall-stair.jpg",
      "/images/applications/bathroom-walls.jpg",
    ],
  },
];

export const projectHref = (slug: string) => `/projects/${slug}`;

export const findProject = (slug: string) => projects.find((project) => project.slug === slug);
