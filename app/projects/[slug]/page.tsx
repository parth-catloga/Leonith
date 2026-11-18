import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SiteNavbar from "../../components/SiteNavbar";
import ScrollMotion from "../../components/ScrollMotion";
import Breadcrumbs from "../../components/Breadcrumbs";
import { ContactFooter } from "../../components/HomeSections";
import { findProject, projects } from "../../components/projects";

// Each project is prerendered; any other slug hits notFound() below.
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = findProject((await params).slug);
  return project ? { title: `${project.name} | Leonith`, description: project.text } : {};
}

type Params = PageProps<"/projects/[slug]">["params"];

const sectionHeading = "text-[14px] uppercase leading-[1.4] tracking-[0.1em]";

// Same pattern as the blog posts: navbar and footer render at once, the project waits on params.
export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <>
      <SiteNavbar />
      <Suspense fallback={<main className="min-h-svh bg-cream" />}>
        <ProjectContent params={params} />
      </Suspense>
      <ContactFooter />
    </>
  );
}

async function ProjectContent({ params }: { params: Params }) {
  const project = findProject((await params).slug);
  if (!project) notFound();

  return (
    <main className="bg-cream font-label text-black">
      <ScrollMotion className="px-4 pb-24 pt-32 lg:px-14 lg:pb-40 lg:pt-40">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: project.name }]}
        />
        <h1 className="max-w-5xl font-display text-[2.5rem] uppercase leading-[0.9] tracking-[-0.02em] lg:text-[4rem]">
          {project.name}
        </h1>

        {/* Banner photo; the image drifts inside its frame (see ScrollMotion). */}
        <div data-fade className="mt-14 border-t border-black/15 pt-8">
          <div className="group relative aspect-[16/9] overflow-hidden">
            <div data-parallax className="absolute inset-x-0 -inset-y-[8%]">
              {/* Same slow zoom on hover as the photos below. */}
              <Image
                src={project.image}
                alt={project.name}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Details on the left, the brief on the right; stacked on phones. Sizes and spacing
            match the reference project pages: 14px headings, 10px detail rows, 14px brief text. */}
        <section className="mt-12 flex flex-col justify-between gap-12 lg:mt-24 lg:flex-row lg:gap-0">
          <div data-fade className="flex w-full max-w-[480px] flex-col gap-10">
            <h2 className={sectionHeading}>Details</h2>
            <dl className="flex flex-col gap-4">
              {[
                ["Location", project.location],
                ["Type", project.type],
                ["Used for", project.applications],
                ["Slab", project.slab],
                ["Year completed", project.year],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex gap-1.5 border-b border-[#EEE6DF] pb-3 text-[10px] uppercase leading-[1.4] tracking-[0.1em] last:border-b-0 last:pb-0"
                >
                  <dt>{label}:</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-fade className="flex w-full max-w-[480px] flex-col gap-10">
            <h2 className={sectionHeading}>Brief</h2>
            <div className="flex flex-col gap-4 text-[14px] leading-[1.4] tracking-[-0.03em]">
              {project.brief.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Four portrait photos, two to a row with a 16px gap, as on the reference project pages. */}
        <section aria-label="Project photos" className="mt-24 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {project.gallery.map((photo, index) => (
            <div key={photo} data-fade className="group relative aspect-[3/4] overflow-hidden bg-black/5">
              <Image
                src={photo}
                alt={`${project.name}, photo ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </section>
      </ScrollMotion>
    </main>
  );
}
