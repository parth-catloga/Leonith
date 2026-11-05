import type { Metadata } from "next";
import AboutHero from "../components/AboutHero";
import AboutSlideshow from "../components/AboutSlideshow";
import ApplicationsSection from "../components/ApplicationsSection";
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

// All from the range sheet: 26 + 16 + 23 + 22 designs across four formats, two
// more formats coming, 5 to 15 mm thick, and 1600 × 3200 mm = 5.12 m² at most.
const stats = [
  { value: "87+", label: "Slab designs", texture: "calacatta" },
  { value: "4", label: "Slab formats", texture: "nero" },
  { value: "2", label: "New formats coming", texture: "travertine" },
  { value: "5", label: "Thinnest slab, mm", texture: "verde" },
  { value: "15", label: "Thickest slab, mm", texture: "emperador" },
  { value: "5.12", label: "Largest slab, m²", texture: "rosa" },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-4 text-sm uppercase leading-[1.4] tracking-[0.1em]">
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
                Leonith makes large-format porcelain slabs in Morbi, Gujarat. From kitchen countertops
                and staircases to full-height walls and floors, every slab is chosen for the way light,
                texture and daily life meet a surface. We work closely with architects, designers and
                dealers, so each project gets the right size, finish and thickness, from ultra-thin
                5 mm panels to our 1600 × 3200 mm format.
              </p>
            </div>
          </section>

          {/* Spacing and widths follow the reference page's Our Values block. */}
          <section
            aria-label="Our values"
            className="flex flex-col gap-8 border-t border-black/15 pb-24 pt-24 lg:flex-row lg:pb-32 lg:items-start lg:justify-between"
          >
            <SectionLabel>Our values</SectionLabel>
            <ul className="flex max-w-[480px] flex-col gap-10">
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
          </section>

          {/* Modelled on the "HBA at a glance" stats grid. It has no background of its
              own: the page fades to charcoal while it is in the middle of the screen. */}
          <section
            aria-labelledby="glance-heading"
            data-colour-scheme="dark"
            className="py-20"
          >
            <h2
              id="glance-heading"
              className="mb-6 font-display text-[clamp(2rem,4.1vw,2.75rem)] leading-[1.1] lg:mb-10"
            >
              Leonith at a glance
            </h2>
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative h-[clamp(140px,calc(30px+18.75vw),390px)] overflow-hidden border border-black/20 p-4 transition-colors duration-[750ms] group-data-[dark=true]/scheme:border-white/25 lg:p-5"
                >
                  {/* Revealed on hover, as the reference does with project photos. */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ backgroundImage: `url(/textures/${stat.texture}.svg)` }}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-black/45" />
                  </div>
                  <div className="relative flex h-full flex-col justify-between">
                    <dt className="max-w-[12rem] text-xs uppercase leading-[1.25] tracking-[0.1em] transition-colors duration-300 group-hover:text-white">
                      {stat.label}
                    </dt>
                    <dd className="font-display text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.8] tracking-[-0.03em] text-black/40 transition-colors duration-300 group-hover:text-white group-data-[dark=true]/scheme:text-white/45 group-data-[dark=true]/scheme:group-hover:text-white">
                      {stat.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <ApplicationsSection />
        </div>
      </ColourShiftMain>
      <ContactFooter />
    </>
  );
}
