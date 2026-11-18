import type { Metadata } from "next";
import Image from "next/image";
import { Droplets, Leaf, Recycle, Sun, Trash, type LucideIcon } from "lucide-react";
import CtaButton from "@/components/ui/cta-button";
import SiteNavbar from "../components/SiteNavbar";
import ScrollMotion from "../components/ScrollMotion";
import Breadcrumbs from "../components/Breadcrumbs";
import { ContactFooter } from "../components/HomeSections";
import {
  certifications,
  people,
  pillars,
  practices,
  productBenefits,
  sustainabilityIntro,
  type PillarIcon,
} from "../components/sustainability";

export const metadata: Metadata = {
  title: "Sustainability | Leonith",
  description:
    "How Leonith makes large-format porcelain slabs responsibly: recycled materials, renewable energy, water recycling and surfaces built to last.",
};

const pillarIcons: Record<PillarIcon, LucideIcon> = {
  recycle: Recycle,
  sun: Sun,
  leaf: Leaf,
  water: Droplets,
  waste: Trash,
};

// Renders **phrase** in bold, and marks every unfilled "XX" placeholder with a red dotted
// underline so it's easy to spot before the real figures go in (see components/sustainability.ts).
function RichText({ text }: { text: string }) {
  return text.split("**").map((part, index) => {
    const pieces = part.split(/(XX)/).map((piece, i) =>
      piece === "XX" ? (
        <span key={i} className="underline decoration-[#E20114] decoration-dotted underline-offset-4">
          XX
        </span>
      ) : (
        piece
      ),
    );
    return index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-black">
        {pieces}
      </strong>
    ) : (
      <span key={index}>{pieces}</span>
    );
  });
}

const eyebrow = "text-xs uppercase tracking-[0.14em] text-black/50";
const sectionTitle = "font-display text-[clamp(2rem,3.4vw,3.5rem)] uppercase leading-[1] tracking-[-0.02em]";
const body = "text-sm leading-[1.7] tracking-[-0.03em] text-black/70 lg:text-base";

export default function SustainabilityPage() {
  return (
    <>
      <SiteNavbar />
      <main className="bg-cream font-label text-black">
        <ScrollMotion className="px-4 pb-24 pt-32 lg:px-14 lg:pb-40 lg:pt-40">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sustainability" }]} />
          {/* Same header as the applications, blog and contact pages. */}
          <h1 className="font-display text-[2.5rem] uppercase leading-[0.9] tracking-[-0.02em] lg:text-[4rem]">
            Sustainability
          </h1>

          {/* Intro: the catalogue's headline and statement beside a photo that drifts in its frame. */}
          <section className="mt-14 grid items-center gap-10 border-t border-black/15 pt-8 lg:grid-cols-12 lg:gap-x-4">
            <div data-fade className="lg:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden lg:w-[89%]">
                <div data-parallax className="absolute inset-x-0 -inset-y-[8%]">
                  <Image
                    src="/images/home/hall-window.jpg"
                    alt="Sunlit hallway finished in large porcelain slabs"
                    fill
                    priority
                    sizes="(min-width: 1024px) 35vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div data-fade className="flex flex-col gap-8 lg:col-span-5 lg:col-start-8">
              <h2 className={sectionTitle}>
                {sustainabilityIntro.title}
                <span className="text-[#E20114]">.</span>
              </h2>
              <p className={body}>
                <RichText text={sustainabilityIntro.text} />
              </p>
            </div>
          </section>

          {/* The five pillars from the catalogue, each with its figure. */}
          <section aria-labelledby="pillars-heading" className="mt-24 lg:mt-40">
            <h2 id="pillars-heading" className={`${eyebrow} mb-10 lg:mb-14`}>
              Our commitments in numbers
            </h2>
            <ul className="grid grid-cols-1 border-t border-black/15 sm:grid-cols-2 lg:grid-cols-5">
              {pillars.map((pillar) => {
                const Icon = pillarIcons[pillar.icon];
                return (
                  <li
                    key={pillar.title}
                    data-fade
                    // Two columns on tablets (inset only the right-hand card), five on desktop where
                    // every card after the first gets the same inset from its divider line.
                    className="flex flex-col gap-5 border-b border-black/15 py-8 sm:pr-6 sm:even:pl-6 lg:border-b-0 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
                  >
                    <Icon aria-hidden="true" className="size-8 text-[#E20114]" strokeWidth={1.3} />
                    <p className="text-xs uppercase tracking-[0.14em] text-black">{pillar.title}</p>
                    <p className="font-display text-[clamp(2.5rem,3.6vw,3.5rem)] leading-none tracking-[-0.02em]">
                      <RichText text={pillar.value} />
                    </p>
                    <p className="text-sm leading-[1.5] tracking-[-0.03em] text-black/60">
                      <RichText text={pillar.label} />
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* How we make it: heading on the left, three practices on the right. */}
          <section className="mt-24 grid gap-10 lg:mt-40 lg:grid-cols-12 lg:gap-x-4">
            <div data-fade className="lg:col-span-4">
              <p className={`${eyebrow} mb-4`}>Production</p>
              <h2 className={sectionTitle}>How we make it</h2>
            </div>
            <div className="flex flex-col lg:col-span-7 lg:col-start-6">
              {practices.map((practice, index) => (
                <div
                  key={practice.title}
                  data-fade
                  className="grid gap-3 border-t border-black/15 py-8 sm:grid-cols-[4rem_minmax(0,1fr)] lg:grid-cols-[5rem_12rem_minmax(0,1fr)] lg:gap-6"
                >
                  <span className="text-xs tracking-[0.14em] text-[#E20114]">0{index + 1}</span>
                  <h3 className="text-xs uppercase tracking-[0.14em] text-black">{practice.title}</h3>
                  <p className={`${body} sm:col-start-2 lg:col-start-auto`}>
                    <RichText text={practice.text} />
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Why the product itself is a sustainable choice: true today, no figures needed. */}
          <section className="mt-24 lg:mt-40">
            <div data-fade className="mb-10 max-w-3xl lg:mb-16">
              <p className={`${eyebrow} mb-4`}>The surface</p>
              <h2 className={sectionTitle}>Made once, kept for decades</h2>
            </div>
            <ul className="grid gap-4 md:grid-cols-3">
              {productBenefits.map((benefit) => (
                <li
                  key={benefit.title}
                  data-fade
                  className="flex flex-col gap-4 rounded-xl border border-black/10 p-6 lg:p-8"
                >
                  <h3 className="font-display text-[1.6rem] uppercase leading-[1.05] tracking-[-0.02em]">{benefit.title}</h3>
                  <p className="text-sm leading-[1.7] tracking-[-0.03em] text-black/70">
                    <RichText text={benefit.text} />
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* People: a statement beside a texture close-up. */}
          <section className="mt-24 grid items-center gap-10 lg:mt-40 lg:grid-cols-12 lg:gap-x-4">
            <div data-fade className="flex flex-col gap-6 lg:col-span-5 lg:col-start-2">
              <p className={eyebrow}>People</p>
              <h2 className={sectionTitle}>{people.title}</h2>
              <p className={body}>
                <RichText text={people.text} />
              </p>
            </div>
            <div data-fade className="lg:col-span-3 lg:col-start-9">
              <div className="relative aspect-[3/4] overflow-hidden">
                <div data-parallax className="absolute inset-x-0 -inset-y-[8%]">
                  <Image
                    src="/textures/calacatta.webp"
                    alt="Close-up of Calacatta marble-look porcelain"
                    fill
                    sizes="(min-width: 1024px) 24vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Certifications, each with a one-line explanation (unconfirmed ones flagged in the data file). */}
          <section aria-labelledby="certs-heading" className="mt-24 lg:mt-40">
            <div data-fade className="mb-10 lg:mb-16">
              <p className={`${eyebrow} mb-4`}>Proof</p>
              <h2 id="certs-heading" className={sectionTitle}>
                Certifications
              </h2>
            </div>
            <ul className="grid border-t border-black/15 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((certificate) => (
                <li key={certificate.name} data-fade className="flex flex-col gap-3 border-b border-black/15 py-8 sm:pr-8">
                  <h3 className="font-display text-[1.6rem] uppercase leading-none tracking-[-0.02em]">{certificate.name}</h3>
                  <p className="text-sm leading-[1.6] tracking-[-0.03em] text-black/70">{certificate.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Closing call to action. */}
          <section data-fade className="mt-24 flex flex-col items-center gap-8 text-center lg:mt-40">
            <h2 className={`${sectionTitle} max-w-3xl`}>Want to talk about sustainability?</h2>
            <p className={`${body} max-w-xl`}>
              Ask us for product data sheets, certificates or details for your green building project.
            </p>
            <CtaButton href="/contact">Contact us</CtaButton>
          </section>
        </ScrollMotion>
      </main>
      <ContactFooter />
    </>
  );
}
