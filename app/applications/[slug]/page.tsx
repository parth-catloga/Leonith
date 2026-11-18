import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CtaButton from "@/components/ui/cta-button";
import SiteNavbar from "../../components/SiteNavbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import StoryStack from "../../components/StoryStack";
import ScrollMotion from "../../components/ScrollMotion";
import { ContactFooter } from "../../components/HomeSections";
import { applications } from "../../components/applications";
import { whatsappLink } from "../../components/contactDetails";

const sectionClass = "mt-24 pt-8 lg:mt-40";

// Renders **phrase** as bold black text inside a muted paragraph.
function Emphasis({ text }: { text: string }) {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-black">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

// Each application is prerendered; any other slug hits notFound() below.
export function generateStaticParams() {
  return applications.map(({ slug }) => ({ slug }));
}

const findApplication = (slug: string) => applications.find((application) => application.slug === slug);

export async function generateMetadata({ params }: PageProps<"/applications/[slug]">): Promise<Metadata> {
  const application = findApplication((await params).slug);
  return application
    ? { title: `${application.heading} | Leonith`, description: application.text }
    : {};
}

type Params = PageProps<"/applications/[slug]">["params"];

// The navbar and footer render straight away; only the slug-specific content waits on params,
// inside its own Suspense boundary, so client navigations between applications stay instant.
export default function ApplicationPage({ params }: PageProps<"/applications/[slug]">) {
  return (
    <>
      <SiteNavbar />
      <Suspense fallback={<main className="min-h-svh bg-cream" />}>
        <ApplicationContent params={params} />
      </Suspense>
      <ContactFooter />
    </>
  );
}

async function ApplicationContent({ params }: { params: Params }) {
  const application = findApplication((await params).slug);
  if (!application) notFound();

  return (
    <main className="bg-cream font-label text-black">
      <ScrollMotion className="px-4 pb-24 pt-32 lg:px-14 lg:pb-32 lg:pt-40">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Applications", href: "/applications" }, { label: application.title }]}
        />
        {/* Same header as the contact page. */}
        <h1 className="font-display text-[2.5rem] uppercase leading-[0.9] tracking-[-0.02em] lg:text-[4rem]">
          {application.title}
        </h1>

        <div className="mt-14 grid gap-12 border-t border-black/15 pt-8 lg:grid-cols-[4fr_3fr] lg:items-center lg:gap-8">
          {/* Large heading, then two paragraphs with the key phrases in bold. */}
          <section className="flex flex-col items-start gap-8 lg:gap-10 lg:pl-8">
            <h2 className="font-display text-[clamp(1.75rem,2.8vw,2.75rem)] uppercase leading-[1.05] tracking-[-0.02em]">
              {application.hero.title}
            </h2>
            <div className="flex max-w-xl flex-col gap-6">
              {application.hero.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-[13px] leading-[1.7] tracking-[-0.03em] text-black/70 lg:text-sm">
                  <Emphasis text={paragraph} />
                </p>
              ))}
            </div>
            <CtaButton href="/showroom">Go to collection</CtaButton>
          </section>
          {/* Fades up on entry. The frame stays put so it never crosses the line above; the photo
              inside is 16% taller and drifts within it as you scroll (see ScrollMotion). */}
          <div data-fade className="lg:order-first">
            <div className="relative aspect-[4/3] overflow-hidden">
              <div data-parallax className="absolute inset-x-0 -top-[8%] h-[116%]">
                <Image
                  src={application.image}
                  alt={application.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 57vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* A one-line statement for this application, set large. */}
        <p className="mx-auto mt-24 max-w-4xl text-center font-display text-[clamp(2rem,5vw,4rem)] uppercase leading-[1] tracking-[-0.02em] lg:mt-64">
          {application.statement}
        </p>

        {/* Stories on phones and tablets: a stack of cards that flick away as you scroll. */}
        <div className="mt-24 lg:hidden">
          <StoryStack
            stories={application.stories.map((story) => ({
              title: story.title,
              image: story.image,
              alt: story.alt,
              body: <Emphasis text={story.text} />,
            }))}
          />
        </div>

        {/* Stories on desktop, photo and text alternating sides. Like laminam.com, the photo is a
            narrow 3:4 portrait (3 of 12 columns) set in from the edge, and the text gets the room. */}
        <div className="mt-64 hidden flex-col gap-64 lg:flex">
          {application.stories.map((story, index) => (
            <section key={story.title} className="grid grid-cols-12 items-center gap-x-4">
              {/* Fades up on entry; the inner block drifts with the scroll (see ScrollMotion). */}
              <div
                data-fade
                className={`row-start-1 col-span-3 ${index % 2 === 1 ? "col-start-9" : "col-start-2"}`}
              >
                <div data-speed className="relative aspect-[3/4] overflow-hidden">
                  <Image src={story.image} alt={story.alt} fill sizes="25vw" className="object-cover" />
                </div>
              </div>
              <div
                className={`row-start-1 col-span-5 flex flex-col gap-6 ${index % 2 === 1 ? "col-start-2" : "col-start-7"}`}
              >
                <span className="text-xs uppercase tracking-[0.14em] text-[#E20114]">0{index + 1}</span>
                <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-[1.05] tracking-[-0.02em]">
                  {story.title}
                </h2>
                <p className="text-sm leading-[1.7] tracking-[-0.03em] text-black/70">
                  <Emphasis text={story.text} />
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* Enquiry: centred, with the shared site CTA below the brush-painted message. */}
        <section
          aria-labelledby="enquire-heading"
          className={`${sectionClass} flex flex-col items-center py-16 text-center lg:py-24`}
        >
          <h2 id="enquire-heading" className="flex flex-col items-center">
            <span className="font-[family-name:var(--font-fraunces)] text-[clamp(1.25rem,2.2vw,2.25rem)] font-light uppercase italic tracking-[0.04em]">
              Have a
            </span>
            {/* Dry-brush texture: hard-edged bristle gaps along the strokes plus slightly ragged edges. */}
            <svg aria-hidden="true" width="0" height="0" className="absolute">
              <filter id="dry-brush" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.6 0.02" numOctaves={3} seed={3} result="noise" />
                <feColorMatrix in="noise" type="luminanceToAlpha" result="lum" />
                <feComponentTransfer in="lum" result="mask">
                  <feFuncA type="discrete" tableValues="0 0 0 1 1 1 1 1 1 1" />
                </feComponentTransfer>
                <feComposite in="SourceGraphic" in2="mask" operator="in" result="brushed" />
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={1} seed={8} result="warp" />
                <feDisplacementMap in="brushed" in2="warp" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </svg>
            <span className="text-painted -my-[0.08em] px-[0.15em] font-[family-name:var(--font-kaushan)] text-[clamp(5rem,13vw,12rem)] leading-[1.15] [filter:url(#dry-brush)]">
              Space
            </span>
            <span className="font-[family-name:var(--font-fraunces)] text-[clamp(1.25rem,2.2vw,2.25rem)] font-light uppercase italic tracking-[0.04em]">
              in mind?
            </span>
          </h2>
          <CtaButton
            href={whatsappLink(`Hi Leonith, I'd like advice on ${application.heading.toLowerCase()}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 lg:mt-12"
          >
            Enquire now
          </CtaButton>
        </section>
      </ScrollMotion>
    </main>
  );
}
