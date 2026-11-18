"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

// Scroll motion modelled on laminam.com/en/applications:
// - [data-fade] rises 30px and fades in over 0.8 s as it enters the screen, once.
// - [data-parallax] (an image inside an overflow-hidden 3:4 frame) drifts slowly
//   against the scroll, so the photo moves a little within its frame.
// - [data-speed] moves the whole block from 15% of its height above its place to 15% below
//   while it crosses the screen, so it scrolls a little slower than the page. Laminam does
//   the same with data-speed="1.50" on its application pages. Put it inside a [data-fade]
//   wrapper, which is also the scroll trigger, so the two motions don't fight.
export default function ScrollMotion({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power1.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
