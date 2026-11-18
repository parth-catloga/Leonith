// Where Leonith slabs are used. Shared by the about page, the /applications overview and the /applications/[slug] pages.
// Photos are placeholders: AI-generated previews, hero-video stills and close-ups of the procedural
// marble textures. Swap each `image` for real project photography when it is supplied.

type Story = { title: string; text: string; image: string; alt: string };

type ApplicationData = {
  slug: string;
  title: string;
  heading: string;
  text: string;
  intro: string;
  image: string;
  statement: string;
  stories: Story[];
  // Opening of each application page. Wrap key phrases in **double asterisks** to set them in bold.
  hero: { title: string; paragraphs: string[] };
};

const texture = (name: string) => `/textures/${name}.webp`;

export const applications: ApplicationData[] = [
  {
    slug: "wall",
    title: "Wall",
    heading: "Porcelain slabs for walls",
    text: "Full-height panels, including ultra-thin 5 mm slabs, that clad large walls with minimal weight and almost no joints.",
    intro:
      "A wall finished in large-format porcelain reads as one surface, not a grid of tiles. Our slabs run floor to ceiling, so the veining carries across the room uninterrupted, and the thin formats go straight over existing walls during a renovation.",
    statement: "One wall, one slab, no interruptions.",
    hero: {
      title: "Leonith on your walls",
      paragraphs: [
        "**Leonith wall slabs** turn a wall into one continuous surface instead of a grid of tiles. They suit **living rooms, bedrooms, bathrooms and kitchens**, as well as commercial spaces such as **hotel lobbies, receptions and lift lobbies**.",
        "Panels up to **1600 × 3200 mm** run floor to ceiling, so the veining carries across the room uninterrupted, while our **ultra-thin 5 mm slabs** go straight over existing walls during a **renovation**.",
      ],
    },
    image: "/images/applications/wall-cladding.jpg",
    stories: [
      {
        title: "A look for every interior",
        text: "Choose from **marble, onyx, metal and terrazzo looks** in **polished, matt, rustic matt and bush-hammered** finishes. A single slab of bold marble becomes a **feature wall** behind a sofa or bed, and **book-matched panels** mirror the veining across a joint so the pattern opens out like a page.",
        image: "/images/applications/feature-walls.jpg",
        alt: "Dining room with a black marble feature wall and lit niche",
      },
      {
        title: "Hygienic and easy to live with",
        text: "Porcelain is dense and **non-porous**, so walls **don't absorb water, stains or odours** and give mould nowhere to take hold. That makes it as suited to **bathrooms and kitchen splashbacks** as it is to living spaces. Day to day, a wipe with **water and a neutral detergent** is all it needs, with no sealing or special products.",
        image: texture("calacatta"),
        alt: "Close-up of Calacatta marble-look porcelain",
      },
      {
        title: "Simple to install, even over old walls",
        text: "Slabs are bonded with a **flexible tile adhesive** directly onto sound plaster, board or **existing tiles**, so there's no need to chip off the old finish. The **5 mm format is light** enough for partitions and upper floors, keeping dust, noise and time on site to a minimum. Large panels are best fitted by an installer experienced in slabs.",
        image: texture("verde"),
        alt: "Close-up of green marble-look porcelain",
      },
    ],
  },
  {
    slug: "floor",
    title: "Floor",
    heading: "Porcelain slabs for floors",
    text: "Formats up to 1600 × 3200 mm cover large floors with far fewer grout lines, so rooms feel open and continuous.",
    intro:
      "Large slabs turn a floor into one calm, continuous plane that makes any room feel bigger. Choose marble, stone, wood, cement or metal looks in matt or polished finishes, for new builds and renovations alike.",
    statement: "Fewer joints, bigger rooms.",
    hero: {
      title: "Leonith on your floors",
      paragraphs: [
        "**Leonith floor slabs** cover **living rooms, hallways, open-plan spaces and kitchens**, as well as busy **hotel lobbies, offices and showrooms**. Formats up to **1600 × 3200 mm** mean far fewer grout lines, so rooms read as **one calm, continuous plane**.",
        "Choose marble, stone and terrazzo looks in **matt or polished finishes**, in **12 mm and 15 mm** thicknesses, for new builds and renovations alike.",
      ],
    },
    image: "/images/applications/flooring.jpg",
    stories: [
      {
        title: "Room to room, without a break",
        text: "Run the same slab from the entrance, down the corridor and into the living space. With **so few joints**, the floor carries your eye through the house, and **open-plan rooms** read as one generous space. Long **800 × 3000 mm planks** suit corridors, while **1600 × 3200 mm slabs** cover big rooms almost seamlessly.",
        image: "/images/home/hall-corridor.jpg",
        alt: "Long hallway leading through an open-plan home",
      },
      {
        title: "Built for everyday traffic",
        text: "Dense porcelain resists **scratches, scuffs and wear** from shoes, chairs and wheels, and spilled drinks, oil or dirt **stay on the surface** and wipe away. Choose a **matt finish for grip** in entrances and kitchens, and **polished slabs** to bring light into living rooms and lobbies. A sweep and a mop with **water and neutral detergent** keep it looking new.",
        image: "/images/home/kitchen-dining.jpg",
        alt: "Open kitchen and dining area with a continuous floor",
      },
      {
        title: "Easy to lay, warm underfoot",
        text: "Slabs are laid on a **flat, level screed** with full adhesive coverage, and can often go **straight over an existing hard floor**, avoiding demolition. Porcelain **conducts heat well** and stays stable as temperatures change, so it pairs naturally with **underfloor heating** and keeps a large stone floor comfortable all year.",
        image: "/images/home/hall-stair.jpg",
        alt: "Bright hallway with a staircase and continuous floor",
      },
    ],
  },
  {
    slug: "kitchens",
    title: "Kitchens",
    heading: "Porcelain slabs for kitchens",
    text: "Countertops, islands, splashbacks and floors in one material, with slabs long enough to run a counter in one piece.",
    intro:
      "The kitchen is where a surface works hardest. Leonith slabs run the full length of a counter or island without a joint, then carry on up the splashback and across the floor, so the whole room is finished in one material.",
    statement: "Made for the hardest-working room in the house.",
    hero: {
      title: "Leonith in the kitchen",
      paragraphs: [
        "**Leonith kitchen countertops** combine the look of natural stone with the strength the hardest-working room in the house needs. Slabs cover **countertops, islands, waterfall edges, splashbacks, cabinet fronts and floors**, so the whole kitchen can be finished in one material.",
        "Our **1600 × 3200 mm slab is NSF certified** and long enough to run most islands in one piece, while **800 × 3000 / 3200 mm** slabs run the full length of a countertop without a joint.",
      ],
    },
    image: "/images/applications/kitchen-countertops.jpg",
    stories: [
      {
        title: "Islands with a waterfall edge",
        text: "Wrap the slab over the top and down both sides of an island and the **veining flows unbroken** from worktop to floor. Countertops are **cut to size by a fabricator**, with **cut-outs for sinks and hobs**, under-mounted sinks and a choice of **edge profiles**, from square to mitred. It's the detail that makes a kitchen look carved from a single block of stone.",
        image: "/images/home/kitchen-detail.jpg",
        alt: "Kitchen island with a waterfall marble-look edge",
      },
      {
        title: "Built for the way you cook",
        text: "Put a **hot pan straight down**, chop without worrying about **scratches**, and wipe up **turmeric, oil, wine and citrus** without a trace. Porcelain is **non-porous**, so stains stay on the surface, bacteria have nowhere to hide and the countertop **never needs sealing**. It looks the same in ten years as the day it was fitted.",
        image: "/images/home/kitchen-island.jpg",
        alt: "Open-plan kitchen with a long island and bar stools",
      },
      {
        title: "A splashback without grout",
        text: "Run one slab from the worktop to the cooker hood and there are **no grout lines** to collect grease or steam. The wall behind the hob **wipes clean in seconds** with water and a neutral detergent, and the **veining continues straight up** from the countertop, so the kitchen looks finished in one material.",
        image: texture("carrara"),
        alt: "Close-up of Carrara marble-look porcelain",
      },
    ],
  },
  {
    slug: "bathroom",
    title: "Bathroom",
    heading: "Porcelain slabs for bathrooms",
    text: "Tall, narrow panels that line showers, vanities and floors with only a handful of joints.",
    intro:
      "Bathrooms are humid every day, so the fewer joints the better. Large slabs line showers, walls and floors with a handful of seams, and vanity tops can be cut from the same slab for a finish that matches throughout.",
    statement: "Calm, seamless and made for water.",
    hero: {
      title: "Leonith in the bathroom",
      paragraphs: [
        "**Leonith bathroom slabs** line **shower walls, floors, vanity tops, bath surrounds and niches** with only a handful of joints, so there is **less grout to clean** and nowhere for mould to take hold.",
        "Use **1600 × 3200 mm** panels to line a whole shower wall in one piece, or **thin 5 mm slabs** to refresh walls during a renovation, in looks from quiet whites to deep, dramatic veining.",
      ],
    },
    image: "/images/applications/bathroom-walls.jpg",
    stories: [
      {
        title: "A shower lined in one piece",
        text: "One slab per wall means **almost no grout** to scrub. Porcelain **absorbs almost no water**, so even a walk-in shower used every day stays bright with a quick rinse. In showers, slabs go over a **waterproofing membrane**, with corners and joints finished in **flexible sealant**.",
        image: texture("verde"),
        alt: "Close-up of green marble-look porcelain",
      },
      {
        title: "Vanity to floor, perfectly matched",
        text: "Cut the **vanity top, bath surround and shelves** from the same slab as the walls, and the bathroom feels calm and complete. Choose **deep, dramatic veining** for a hotel-style suite, or **quiet whites** for a light, airy room. Limescale sits on the surface and comes off with a regular **bathroom cleaner**.",
        image: texture("carrara"),
        alt: "Close-up of Carrara marble-look porcelain",
      },
      {
        title: "Surer footing on wet floors",
        text: "**Matt and textured finishes** give better grip where floors get wet, and slabs can be cut to **fall towards the drain** in a walk-in shower. The same look in **polished slabs** dresses the walls, for a bathroom that feels luxurious and stays practical for the whole family.",
        image: texture("travertine"),
        alt: "Close-up of travertine-look porcelain",
      },
    ],
  },
  {
    slug: "furniture",
    title: "Furniture",
    heading: "Porcelain slabs for furniture",
    text: "Tables, consoles, shelving and cabinet fronts clad in porcelain, to refresh existing pieces or build new ones.",
    intro:
      "Porcelain isn't only for walls and floors. Thin slabs clad table tops, consoles, shelving, wardrobes and cabinet fronts, so furniture matches the surfaces around it, and older pieces get a new finish without being replaced.",
    statement: "The same stone, from the walls to the table.",
    hero: {
      title: "Leonith in furniture",
      paragraphs: [
        "**Leonith slabs** aren't only for walls and floors. Porcelain clads **dining and coffee tables, consoles, wardrobe and cabinet doors, reception desks and bar counters**, so furniture matches the surfaces around it.",
        "**Thin 5 mm slabs** add little weight to doors and panels, while **12 mm slabs** make solid tops for tables and counters, in marble, onyx, metal and terrazzo looks.",
      ],
    },
    image: "/images/applications/feature-walls.jpg",
    stories: [
      {
        title: "Tables that take anything",
        text: "A dining or coffee table topped in porcelain resists **hot dishes, glass rings and spills**, and **coffee, wine or oil** wipe away without a mark. Pair a dramatic marble look with a simple base and the table becomes the piece everyone notices. Porcelain isn't affected by sun or rain, so it suits **terrace and garden furniture** too.",
        image: texture("nero"),
        alt: "Close-up of black marble-look porcelain",
      },
      {
        title: "Joinery that matches the room",
        text: "Slabs are **cut to size** and bonded to a stable base such as a metal frame or board, with **mitred edges** that make a thin top look like a solid block. Clad **wardrobes, sideboards and cabinet doors** in the same slab as your walls or floor, and give **existing furniture** a new finish instead of replacing it.",
        image: texture("rosa"),
        alt: "Close-up of rose marble-look porcelain",
      },
      {
        title: "Ready for hotels and restaurants",
        text: "**Bar counters, reception desks and restaurant tables** take far more wear than furniture at home. Porcelain stands up to **constant use, cleaning products and spills**, and a wipe with a **damp cloth and neutral detergent** keeps it hygienic, so commercial pieces look new long after opening day.",
        image: "/images/home/kitchen-island.jpg",
        alt: "Long counter with bar stools in an open-plan space",
      },
    ],
  },
  {
    slug: "facades",
    title: "Facades",
    heading: "Porcelain slabs for facades",
    text: "Weatherproof exterior cladding in large, light panels, for ventilated and adhered facade systems.",
    intro:
      "A facade has to look good and stand up to sun, rain and heat for decades. Porcelain does both: it won't fade, warp or absorb water, and large, light panels suit both ventilated and adhered systems on new buildings and renovations.",
    statement: "First impressions that last for decades.",
    hero: {
      title: "Leonith on the facade",
      paragraphs: [
        "**Leonith facade slabs** give **residential towers, commercial buildings and entrances** a first impression that lasts, on new builds and **renovations** alike.",
        "Large, light panels in **1200 × 3000 mm** and **1600 × 3200 mm** suit both **ventilated and adhered systems**, in stone, metal and marble looks that keep their colour for decades.",
      ],
    },
    image: "/images/applications/staircases.jpg",
    stories: [
      {
        title: "Ventilated facades",
        text: "Panels are hung on an **aluminium frame** with visible or concealed clips, leaving an **air gap** behind them. The cavity lets the wall breathe and helps keep **heat, damp and noise** out, so the building is more comfortable inside. A damaged panel can be **removed and replaced on its own**, without disturbing its neighbours.",
        image: texture("travertine"),
        alt: "Close-up of travertine-look porcelain",
      },
      {
        title: "Colour that doesn't fade",
        text: "The colour and pattern are **fired into the porcelain**, so **strong sun** doesn't fade them, and **low water absorption** means rain and monsoon humidity leave the panels unchanged. Rain and an **occasional wash** are all the facade needs to keep looking new.",
        image: texture("carrara"),
        alt: "Close-up of Carrara marble-look porcelain",
      },
      {
        title: "Adhered cladding",
        text: "For **renovations and lower buildings**, slabs are bonded straight onto the wall with **exterior adhesive**. It's the simplest way to give an existing building a new face, with **no frame to build** and a slim finished depth. The right system depends on the building's height and wind load, and our team can help with **panel layout and sizes**.",
        image: texture("emperador"),
        alt: "Close-up of Emperador marble-look porcelain",
      },
    ],
  },
];

export type Application = (typeof applications)[number];

export const applicationHref = (slug: string) => `/applications/${slug}`;
