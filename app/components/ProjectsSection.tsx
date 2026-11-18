"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CtaButton from "@/components/ui/cta-button";
import StoryStack from "./StoryStack";
import { projectHref, projects } from "./projects";

// Desktop: the interaction the applications list had (modelled on for-living.it/services), faded rows
// that sharpen on hover while the project photo appears, fixed in the middle of the left half of the screen.
// Phones and tablets: the same card stack as the application pages, where scrolling flicks each card away.
export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const featured = projects.slice(0, 4);

  return (
    <section aria-labelledby="projects-heading" className="py-24 lg:py-28">
      <h2
        id="projects-heading"
        className="max-w-xl font-display text-[clamp(2.25rem,4.4vw,2.85rem)] uppercase leading-[1.1]"
      >
        Our projects
      </h2>

      <div className="mt-10 lg:hidden">
        <StoryStack
          titleTag="h3"
          stories={featured.map((project) => ({
            title: project.name,
            image: project.image,
            alt: project.name,
            body: project.text,
            href: projectHref(project.slug),
          }))}
        />
      </div>

      <ul className="mt-8 hidden flex-col lg:flex">
        {featured.map((project, index) => (
          <li
            key={project.slug}
            className="group/row relative block border-t border-black/15 py-12 opacity-40 transition-[opacity,border-color] duration-[250ms] hover:opacity-100 group-data-[dark=true]/scheme:border-white/20"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex((current) => (current === index ? null : current))}
          >
            {/* Fixed in the left half of the screen while its row is hovered. */}
            <div
              className={`pointer-events-none z-10 flex items-center justify-center transition-opacity duration-[250ms] lg:fixed lg:inset-y-0 lg:left-0 lg:w-1/2 ${
                activeIndex === index ? "lg:opacity-100" : "lg:opacity-0"
              }`}
              aria-hidden="true"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm lg:max-w-[20rem] lg:rounded-none">
                <Image src={project.image} alt="" fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover" />
              </div>
            </div>

            <div className="flex flex-col gap-4 transition-[margin] duration-200 lg:ml-[50%] lg:max-w-[30rem] lg:group-hover/row:ml-[calc(50%-2.25rem)]">
              <h3 className="font-display text-[clamp(1.75rem,3vw,1.9rem)] uppercase leading-[1.1]">
                {/* The link stretches over the whole row, so clicking anywhere on it opens the project. */}
                <Link href={projectHref(project.slug)} className="after:absolute after:inset-0">
                  {project.name}
                </Link>
              </h3>
              <p className="text-sm leading-[1.5] tracking-[-0.03em]">{project.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center pt-4 group-data-[dark=true]/scheme:border-white/20 lg:border-t lg:border-black/15 lg:pt-16">
        <CtaButton href="/projects">Explore all projects</CtaButton>
      </div>
    </section>
  );
}
