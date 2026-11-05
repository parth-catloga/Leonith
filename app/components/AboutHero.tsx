"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Full-screen photo with a slow parallax drift, as on the reference About page.
export default function AboutHero() {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animationFrame: number | undefined;

    const update = () => {
      animationFrame = undefined;
      const scrolled = Math.min(window.scrollY, window.innerHeight);
      image.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0) scale(1.08)`;
    };

    const requestUpdate = () => {
      if (animationFrame === undefined) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <section className="relative grid h-svh place-items-center overflow-hidden bg-[#181818] px-4 text-center text-white">
      <div ref={imageRef} className="absolute inset-0 scale-[1.08] will-change-transform">
        <Image
          src="/images/home/hall-window.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          preload
        />
      </div>
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <div className="relative flex max-w-3xl flex-col items-center gap-10">
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] uppercase leading-none">
          Surfaces that make every space feel bigger, bolder and better.
        </h1>
        <div className="flex items-center gap-10 font-label text-sm uppercase tracking-[0.1em]">
          <span>Morbi</span>
          <Image
            src="/logos/leonith-logo-white.png"
            alt="Leonith"
            width={600}
            height={200}
            className="h-auto w-24"
          />
          <span>India</span>
        </div>
      </div>
    </section>
  );
}
