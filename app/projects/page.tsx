import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNavbar from "../components/SiteNavbar";
import ScrollMotion from "../components/ScrollMotion";
import Breadcrumbs from "../components/Breadcrumbs";
import { ContactFooter } from "../components/HomeSections";
import { projectHref, projects } from "../components/projects";

export const metadata: Metadata = {
  title: "Projects | Leonith",
  description:
    "Homes, hotels and offices finished in Leonith large-format porcelain slabs.",
};

// Same header as the blog, applications and contact pages, then every project two to a row:
// a large photo with the name and type underneath, separated by a dot.
export default function ProjectsPage() {
  return (
    <>
      <SiteNavbar />
      <main className="bg-cream font-label text-black">
        <ScrollMotion className="px-4 pb-24 pt-32 lg:px-14 lg:pb-40 lg:pt-40">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Projects" }]}
          />
          <h1 className="font-display text-[2.5rem] uppercase leading-[0.9] tracking-[-0.02em] lg:text-[4rem]">
            Projects
          </h1>

          <section
            aria-label="All projects"
            className="mt-14 border-t border-black/15 pt-8 lg:pt-10"
          >
            <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:gap-x-11 lg:gap-y-16">
              {projects.map((project) => (
                <li key={project.slug} data-fade>
                  {/* The whole card (photo and caption) opens the project's page. */}
                  <Link
                    href={projectHref(project.slug)}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        sizes="(min-width: 768px) 48vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <h2 className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase leading-[1.4] tracking-[0.14em]">
                      {project.name}
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-current"
                        aria-hidden="true"
                      />
                      <span className="text-black/60">{project.type}</span>
                    </h2>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </ScrollMotion>
      </main>
      <ContactFooter />
    </>
  );
}
