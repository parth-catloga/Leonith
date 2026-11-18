import type { Metadata } from "next";
import Image from "next/image";
import CtaButton from "@/components/ui/cta-button";
import SiteNavbar from "../components/SiteNavbar";
import ScrollMotion from "../components/ScrollMotion";
import StoryStack from "../components/StoryStack";
import Breadcrumbs from "../components/Breadcrumbs";
import { ContactFooter } from "../components/HomeSections";
import { applicationHref, applications } from "../components/applications";

export const metadata: Metadata = {
  title: "Applications | Leonith",
  description: "Leonith surfaces can be applied in a variety of sectors, from walls and floors to kitchens, bathrooms, furniture and facades.",
};

// A 3:4 photo frame whose image drifts slightly on scroll (see ScrollMotion).
// The image is taller than the frame so the drift never shows an edge.
function ParallaxPhoto({ src, alt, sizes, priority }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden">
      <div data-parallax className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

// Laid out on a 12-column grid like laminam.com/en/applications: at 1920 px wide the intro
// photo is about 660 × 880, each application photo about 445 × 590, titles 64 px.
export default function ApplicationsPage() {
  return (
    <>
      <SiteNavbar />
      <main className="bg-cream font-label text-black">
        <ScrollMotion className="px-4 pb-24 pt-32 lg:px-14 lg:pb-40 lg:pt-40">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Applications" }]} />
          {/* Same header as the application and contact pages. */}
          <h1 className="font-display text-[2.5rem] uppercase leading-[0.9] tracking-[-0.02em] lg:text-[4rem]">
            Applications
          </h1>

          {/* Intro: photo flush with the header's left edge, statement running to its right edge. */}
          <section className="mt-14 grid items-center gap-10 border-t border-black/15 pt-8 lg:grid-cols-12 lg:gap-x-4">
            <div data-fade className="lg:col-span-5">
              <div className="lg:w-[89%]">
                <ParallaxPhoto
                  src="/images/home/hall-window.jpg"
                  alt="Bright hallway finished in large porcelain slabs"
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  priority
                />
              </div>
            </div>
            <div data-fade className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
              <p className="font-display text-[clamp(1.75rem,2.1vw,2.5rem)] uppercase leading-[1.2] tracking-[-0.02em]">
                Leonith surfaces can be applied in a variety of sectors<span className="text-[#E20114]">.</span>
              </p>
              <p className="text-sm leading-[1.7] tracking-[-0.03em] text-black/70 lg:text-base">
                From homes to hotels, restaurants, offices and building exteriors, our large-format slabs cover walls,
                floors, kitchens, bathrooms, furniture and facades in one consistent material.
              </p>
            </div>
          </section>

          {/* Phones and tablets: the card stack from the application pages; each card opens its page. */}
          <div className="mt-24 lg:hidden">
            <StoryStack
              stories={applications.map((application) => ({
                title: application.title,
                image: application.image,
                alt: application.heading,
                body: application.text,
                href: applicationHref(application.slug),
              }))}
            />
          </div>

          {/* Desktop: each application with text across columns 2–6, photo across 8–10. */}
          <ul className="mt-64 hidden flex-col gap-64 lg:flex">
            {applications.map((application) => (
              <li key={application.slug} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-4">
                <div className="flex flex-col items-start gap-8 lg:col-span-5 lg:col-start-2 lg:row-start-1">
                  <h2
                    data-fade
                    className="font-display text-[clamp(2.5rem,3.34vw,4rem)] uppercase leading-none tracking-[-0.02em]"
                  >
                    {application.title}
                  </h2>
                  <p data-fade className="text-sm leading-[1.7] tracking-[-0.03em] text-black/70 lg:text-base">
                    {application.intro}
                  </p>
                  <div data-fade>
                    <CtaButton href={applicationHref(application.slug)}>Read more</CtaButton>
                  </div>
                </div>
                <a
                  data-fade
                  href={applicationHref(application.slug)}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="order-first block lg:order-none lg:col-span-3 lg:col-start-8 lg:row-start-1"
                >
                  <ParallaxPhoto src={application.image} alt="" sizes="(min-width: 1024px) 24vw, 100vw" />
                </a>
              </li>
            ))}
          </ul>
        </ScrollMotion>
      </main>
      <ContactFooter />
    </>
  );
}
