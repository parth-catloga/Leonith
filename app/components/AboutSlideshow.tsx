"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const slides = [
  { src: "/images/home/kitchen-island.jpg", alt: "Kitchen island in a Leonith slab" },
  { src: "/images/home/hall-stair.jpg", alt: "Staircase hall with Leonith surfaces" },
  { src: "/images/home/kitchen-dining.jpg", alt: "Open kitchen and dining room" },
  { src: "/images/home/hall-corridor.jpg", alt: "Corridor finished in large-format slabs" },
  { src: "/images/home/kitchen-detail.jpg", alt: "Close view of a kitchen countertop" },
];

const SLIDE_DURATION = 4000;

// Crossfading photos with a running count, like the reference About Us block.
export default function AboutSlideshow() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0, direction: 1 as 1 | -1, visible: false });

  const changeSlide = (direction: 1 | -1) => {
    setActiveSlide((slide) => (slide + direction + slides.length) % slides.length);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = sliderRef.current?.getBoundingClientRect();

    if (!bounds || event.pointerType !== "mouse") {
      return;
    }

    const x = event.clientX - bounds.left;
    setCursor({
      x,
      y: event.clientY - bounds.top,
      direction: x < bounds.width / 2 ? -1 : 1,
      visible: true,
    });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(
      () => setActiveSlide((slide) => (slide + 1) % slides.length),
      SLIDE_DURATION,
    );

    return () => window.clearInterval(timer);
  }, []);

  return (
    <figure>
      <div
        ref={sliderRef}
        className="group relative aspect-[4/3] overflow-hidden bg-[#e7e1d8] cursor-none max-md:cursor-auto"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setCursor((current) => ({ ...current, visible: false }))}
      >
        {slides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            // The stills have thin dark bars at their top and bottom edges.
            className={`scale-[1.03] object-cover transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== activeSlide}
          />
        ))}
        <div className="absolute inset-0 z-20 flex" aria-label="Image slider controls">
          <button
            type="button"
            onClick={() => changeSlide(-1)}
            className="h-full w-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
            aria-label="Previous image"
          />
          <button
            type="button"
            onClick={() => changeSlide(1)}
            className="h-full w-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
            aria-label="Next image"
          />
        </div>
        <div
          className={`pointer-events-none absolute z-30 grid h-14 w-14 place-items-center rounded-full bg-cream text-black transition-[opacity,transform] duration-200 max-md:hidden ${
            cursor.visible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: `translate(-50%, -50%) scale(${cursor.visible ? 1 : 0.75})`,
          }}
          aria-hidden="true"
        >
          {cursor.direction === -1 ? (
            <ArrowLeft className="h-6 w-6" strokeWidth={1.4} />
          ) : (
            <ArrowRight className="h-6 w-6" strokeWidth={1.4} />
          )}
        </div>
      </div>
      <figcaption className="mt-3 flex justify-between text-[0.625rem] uppercase leading-[1.4] tracking-[0.1em]">
        <span>Leonith Tiles</span>
        <span aria-live="polite">
          {String(activeSlide + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );
}
