"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Matches degrawanddehaan.com's intro: tied to scroll and reversible. As the logo's
// resting spot climbs from 75% to 39% of the screen height, the logo fades in while
// dropping 100 px into place, and the copy below fades in alongside it.
const START = 0.75;
const END = 0.39;
const DROP = 100;

export default function IntroReveal() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    const logo = logoRef.current;
    const copy = copyRef.current;

    if (!anchor || !logo || !copy) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastProgress = -1;
    let frame: number | undefined;

    const update = () => {
      frame = undefined;
      // The anchor never moves itself, so measuring it doesn't feed back into the effect.
      const top = anchor.getBoundingClientRect().top / window.innerHeight;
      const progress = reduceMotion ? 1 : Math.min(1, Math.max(0, (START - top) / (START - END)));

      if (progress === lastProgress) {
        return;
      }

      lastProgress = progress;
      logo.style.opacity = String(progress);
      logo.style.transform = progress === 1 ? "none" : `translate3d(0, ${-DROP * (1 - progress)}px, 0)`;
      copy.style.opacity = String(progress);
    };

    const requestUpdate = () => {
      if (frame === undefined) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <>
      <div ref={anchorRef}>
        {/* Starts hidden in the server HTML so it never flashes in before the effect runs. */}
        <div ref={logoRef} className="will-change-[opacity,transform]" style={{ opacity: 0, transform: `translate3d(0, ${-DROP}px, 0)` }}>
          <Image src="/logos/leonith-logo-black.png" alt="" width={1600} height={566} className="h-auto w-44" />
        </div>
      </div>
      <p
        ref={copyRef}
        className="max-w-xl text-sm uppercase leading-relaxed tracking-[0.12em] will-change-[opacity]"
        style={{ opacity: 0 }}
      >
        Leonith brings together natural stone and fine tile, chosen for the way light, texture
        and daily life meet a surface.
      </p>
    </>
  );
}
