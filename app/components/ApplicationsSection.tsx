"use client";

import Image from "next/image";
import { useState } from "react";

// AI-generated previews of each use, until real project photography is supplied.
const applications = [
  {
    title: "Kitchen countertops",
    text: "Long slabs that run the full length of a counter or island in one piece, with no joints to break the stone.",
    image: "/images/applications/kitchen-countertops.jpg",
  },
  {
    title: "Wall cladding",
    text: "Full-height panels, including ultra-thin 5 mm slabs, that clad large walls with minimal weight.",
    image: "/images/applications/wall-cladding.jpg",
  },
  {
    title: "Flooring",
    text: "Formats up to 1600 × 3200 mm cover large floors with far fewer grout lines.",
    image: "/images/applications/flooring.jpg",
  },
  {
    title: "Staircases and steps",
    text: "Narrow 800 mm slabs for treads and risers, so a staircase reads as one material from top to bottom.",
    image: "/images/applications/staircases.jpg",
  },
  {
    title: "Bathroom walls",
    text: "Tall, narrow panels that line showers and vanities with only a handful of joints.",
    image: "/images/applications/bathroom-walls.jpg",
  },
  {
    title: "Feature walls and niches",
    text: "Bold veining and deep tones that turn a single wall or niche into the focal point of a room.",
    image: "/images/applications/feature-walls.jpg",
  },
];

// Modelled on "Different contexts same standards" at for-living.it/services:
// faded rows that sharpen on hover while a matching image appears, fixed in
// the middle of the left half of the screen.
export default function ApplicationsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section aria-labelledby="applications-heading" className="py-24 lg:py-28">
      <h2
        id="applications-heading"
        className="max-w-xl font-display text-[clamp(2.25rem,4.4vw,2.85rem)] uppercase leading-[1.1]"
      >
        Every space, one standard
      </h2>

      <ul className="mt-8 flex flex-col">
        {applications.map((application, index) => (
          <li
            key={application.title}
            className="group/row relative flex flex-col gap-6 border-t border-black/15 py-12 transition-[opacity,border-color] duration-[250ms] group-data-[dark=true]/scheme:border-white/20 lg:block lg:opacity-40 lg:hover:opacity-100"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex((current) => (current === index ? null : current))}
          >
            {/* Phones and tablets: the image sits in the row. Desktop: fixed in the
                left half of the screen while its row is hovered. */}
            <div
              className={`pointer-events-none z-10 flex items-center justify-center transition-opacity duration-[250ms] lg:fixed lg:inset-y-0 lg:left-0 lg:w-1/2 ${
                activeIndex === index ? "lg:opacity-100" : "lg:opacity-0"
              }`}
              aria-hidden="true"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-sm lg:max-w-[18.875rem] lg:rounded-none">
                <Image
                  src={application.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 302px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 transition-[margin] duration-200 lg:ml-[50%] lg:max-w-[26rem] lg:group-hover/row:ml-[calc(50%-2.25rem)]">
              <h3 className="font-display text-[clamp(1.75rem,3vw,1.9rem)] uppercase leading-[1.1]">
                {application.title}
              </h3>
              <p className="text-sm leading-[1.5] tracking-[-0.03em]">{application.text}</p>
            </div>
          </li>
        ))}
      </ul>

    </section>
  );
}
