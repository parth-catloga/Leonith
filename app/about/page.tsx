import type { Metadata } from "next";
import Image from "next/image";
import AboutHero from "../components/AboutHero";
import AboutSlideshow from "../components/AboutSlideshow";
import ProjectsSection from "../components/ProjectsSection";
import ColourShiftMain from "../components/ColourShiftMain";
import SiteNavbar from "../components/SiteNavbar";
import { ContactFooter } from "../components/HomeSections";

export const metadata: Metadata = {
  title: "About | Leonith",
  description:
    "Leonith makes large-format porcelain slabs in Morbi, Gujarat. Bigger, bolder, better surfaces for kitchens, walls and floors.",
};

const values = [
  {
    title: "Bigger",
    text: "Formats up to 1600 × 3200 mm mean fewer joints, so walls, floors and countertops read as one continuous surface.",
  },
  {
    title: "Bolder",
    text: "Rich veining and deep tones, from Calacatta to Nero, chosen to give every room a clear point of view.",
  },
  {
    title: "Better",
    text: "Consistent quality, honest advice and the right thickness for every use, so a surface lasts as well as it looks.",
  },
];

// Leonith's story, oldest first. PLACEHOLDERS: every "20XX" year and the "XX" country count
// still need the real facts from the Leonith team; they show with a red dotted underline until
// replaced. The milestones themselves are drafts too: check each one before going live.
const milestones = [
  { year: "20XX", text: "Leonith founded in Morbi, Gujarat" },
  { year: "20XX", text: "First 1600 × 3200 mm slabs leave the line" },
  { year: "20XX", text: "NSF certification for kitchen countertops" },
  { year: "Today", text: "87+ designs in four formats, delivered to XX countries" },
];

// Shows each unfilled "XX" with a red dotted underline so placeholders are easy to spot.
function Placeholdered({ text }: { text: string }) {
  return text.split(/(XX)/).map((part, index) =>
    part === "XX" ? (
      <span key={index} className="underline decoration-[#E20114] decoration-dotted underline-offset-4">
        XX
      </span>
    ) : (
      part
    ),
  );
}

// From the catalogue's technology page.
const technologyIntro =
  "Every Leonith slab is shaped through advanced manufacturing, controlled processes and rigorous quality checks. From raw material selection to firing, finishing and final inspection, every stage is engineered to deliver exceptional flatness, strength and surface consistency.";

// The machinery partners from the catalogue and the machine photos.
// Files live in public/images/Technology (capital T: hosting is case-sensitive):
// - `logo`: "<name>.png", grey on transparent, recoloured by the card; [width, height] in px.
//   Tekmak.png is trimmed of the wide empty margins the original logo file had.
// - `photo`: the machine photo shown on hover (portrait, 1060 × 1484). The card is roughly 4:3,
//   so only a horizontal band of each photo shows; `focus` is how far down the photo (in %) that
//   band is centred, chosen per photo to keep the machine and its name in view.
const partners: {
  name: string;
  logo: [number, number];
  photo: string;
  focus: number;
}[] = [
  { name: "SACMI", logo: [151, 47], photo: "sacmi-machine.png", focus: 40 },
  { name: "Continua+", logo: [254, 37], photo: "continua-machine.png", focus: 60 },
  { name: "System Ceramics", logo: [211, 48], photo: "System Ceramics- machine.png", focus: 45 },
  { name: "Appel", logo: [172, 50], photo: "appel-mmachine.png", focus: 12 },
  { name: "CMF", logo: [200, 56], photo: "cmf-machine.png", focus: 50 },
  { name: "Lamgea", logo: [222, 34], photo: "lamgea-machine.png", focus: 72 },
  { name: "Modena", logo: [252, 31], photo: "modenai-machine.png", focus: 62 },
  { name: "Tekmak", logo: [2090, 410], photo: "tekmak-machine.png", focus: 42 },
];

function SectionLabel({ children, id }: { children: string; id?: string }) {
  return (
    <p id={id} className="flex items-center gap-4 text-sm uppercase leading-[1.4] tracking-[0.1em]">
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </p>
  );
}

const bodyText = "text-sm leading-[1.4] tracking-[-0.03em]";

export default function AboutPage() {
  return (
    <>
      <SiteNavbar />
      <ColourShiftMain className="font-label">
        <AboutHero />

        {/* Marks where the navbar turns cream, as #home-content does on the home page. */}
        <div data-after-hero className="px-4 lg:px-14">
          <section
            aria-label="About us"
            className="flex flex-col gap-12 pb-24 pt-28 lg:flex-row lg:items-start lg:justify-between lg:pb-56 lg:pt-56"
          >
            <div className="lg:w-[65%]">
              <AboutSlideshow />
            </div>
            <div className="flex flex-col gap-8 lg:mt-16 lg:w-[28%] lg:max-w-xs">
              <SectionLabel>About us</SectionLabel>
              <p className={bodyText}>
                Leonith makes large-format porcelain slabs in Morbi, Gujarat, the heart of India&rsquo;s
                ceramics industry. From walls and floors to kitchens, bathrooms, furniture and facades,
                every slab is chosen for the way light, texture and daily life meet a surface.
              </p>
              <p className={bodyText}>
                Marmo Estetico, the beauty of marble, is the idea behind everything we make. Our
                collection brings together marble, stone, wood, cement and metal looks in polished and
                matt finishes, with more than 87 designs across four formats and two new sizes on the
                way.
              </p>
              <p className={bodyText}>
                We work closely with architects, interior designers and dealers, from the first sample
                to the day the slabs arrive on site. Every project gets the right size, finish and
                thickness for the job, from ultra-thin 5 mm panels that go over existing walls to our
                1600 × 3200 mm format that covers a room with almost no joints.
              </p>
            </div>
          </section>

          {/* Values on the left under their label, the story timeline on the right. */}
          <section
            aria-label="Our values and story"
            className="flex flex-col gap-20 border-t border-black/15 pb-24 pt-24 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:pb-32"
          >
            <div className="flex w-full max-w-[480px] flex-col gap-10">
              <SectionLabel>Our values</SectionLabel>
              <ul className="flex flex-col gap-10">
                {values.map((value) => (
                  <li
                    key={value.title}
                    className="flex flex-col gap-4 border-b border-black/15 pb-8 last:border-b-0"
                  >
                    <h2 className="text-sm uppercase leading-[1.4] tracking-[0.1em]">{value.title}</h2>
                    <p className={bodyText}>{value.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full max-w-[480px] flex-col gap-10">
              <SectionLabel>Our story</SectionLabel>
              {/* A thin line with a red dot at each milestone. */}
              <ol className="flex flex-col gap-10 border-l border-black/15 pl-8">
                {milestones.map((milestone) => (
                  <li key={milestone.text} className="relative flex flex-col gap-3">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[calc(2rem+4.5px)] top-[5px] h-2 w-2 rounded-full bg-[#E20114]"
                    />
                    <p className="text-sm uppercase leading-[1.4] tracking-[0.1em] text-[#E20114]">
                      <Placeholdered text={milestone.year} />
                    </p>
                    <p className={bodyText}>
                      <Placeholdered text={milestone.text} />
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Technology, from the catalogue: intro beside the factory photo, then the machinery
              partners in the card style the stats grid used. It has no background of its own:
              the page fades to charcoal while it is in the middle of the screen. */}
          <section
            aria-labelledby="technology-heading"
            data-colour-scheme="dark"
            className="py-20"
          >
            {/* The label sits level with the photo's top edge, the intro right under it. */}
            <div className="mb-10 grid gap-8 lg:mb-16 lg:grid-cols-12 lg:gap-x-6">
              <div className="flex flex-col gap-10 lg:col-span-4">
                <SectionLabel id="technology-heading">Technology</SectionLabel>
                <p className={`${bodyText} max-w-md`}>{technologyIntro}</p>
              </div>
              <div className="relative aspect-[3/2] overflow-hidden lg:col-span-8">
                <Image
                  src="/images/Technology/industrial-machine.png"
                  alt="Leonith's slab production line in Morbi"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {partners.map((partner) => (
                <li
                  key={partner.name}
                  className="group relative min-h-[160px] overflow-hidden lg:h-[clamp(170px,calc(30px+14vw),290px)] border border-black/20 p-4 transition-colors duration-[750ms] group-data-[dark=true]/scheme:border-white/25 lg:p-5"
                >
                  {/* Revealed on hover: the machine photo, slowly zooming in. */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <Image
                      src={`/images/Technology/${encodeURIComponent(partner.photo)}`}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      // Frame the part of the portrait photo where the machine is (see `focus`).
                      style={{ objectPosition: `center ${partner.focus}%` }}
                      className="scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-100"
                    />
                  </div>
                  {/* The logo sits in the middle of the card and fades out on hover, leaving only the photo. */}
                  <div className="relative flex h-full items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                    <h3>
                      {/* The grey logo is turned black on the cream page and white once the
                          section fades to charcoal. */}
                      <Image
                        src={`/images/Technology/${encodeURIComponent(partner.name)}.png`}
                        alt={partner.name}
                        width={partner.logo[0]}
                        height={partner.logo[1]}
                        className="h-7 w-auto max-w-full opacity-70 brightness-0 transition-[filter] duration-300 group-data-[dark=true]/scheme:invert lg:h-9"
                      />
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <ProjectsSection />
        </div>
      </ColourShiftMain>
      <ContactFooter />
    </>
  );
}
