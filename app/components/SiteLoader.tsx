"use client";

import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";

// The counter takes at least this long to reach 100%, even on a fast connection.
const MIN_DURATION = 2800;
// Stop waiting for the page's `load` event after this long.
const MAX_WAIT = 8000;
// Until the page has loaded, the counter holds here.
const HOLD_AT = 0.9;
// Fastest the counter may climb, in progress per millisecond (100% in 0.5 s).
const MAX_SPEED = 1 / 500;

// Where the red n sits inside the 1600 × 566 logo image, as a share of its height.
const N_TOP = 138 / 566;
const N_HEIGHT = (415 - 138) / 566;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// Same layout and exit as degrawanddehaan.com: "Loading" and the counter either
// side of the mark, then the row lifts away and the panel rolls up off the page.
export default function SiteLoader() {
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLImageElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  // Keep the page still underneath while the loader is up.
  useEffect(() => {
    if (!lenis) {
      return;
    }

    if (done) {
      lenis.start();
    } else {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.stop();
    }
  }, [lenis, done]);

  useEffect(() => {
    const panel = panelRef.current;
    const row = rowRef.current;
    const fill = fillRef.current;
    const counter = counterRef.current;

    if (!panel || !row || !fill || !counter) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let loaded = document.readyState === "complete";
    let shown = 0;
    let last = start;
    let frame: number | undefined;
    let exit: gsap.core.Timeline | undefined;

    const markLoaded = () => {
      loaded = true;
    };
    window.addEventListener("load", markLoaded, { once: true });

    const paint = (progress: number) => {
      const percent = Math.round(progress * 100);
      counter.textContent = String(percent);
      fill.style.clipPath = `inset(${(N_TOP + (1 - progress) * N_HEIGHT) * 100}% 0 0 0)`;
    };

    const leave = () => {
      exit = gsap
        .timeline({ onComplete: () => setDone(true) })
        .to(row, { y: -100, opacity: 0, duration: reduceMotion ? 0 : 0.8, ease: "power3.in" })
        .to(panel, { scaleY: 0, duration: reduceMotion ? 0.3 : 1, ease: "power4.inOut" }, reduceMotion ? 0 : "-=0.3");
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const ready = loaded || elapsed > MAX_WAIT;
      const timed = easeInOut(Math.min(1, elapsed / MIN_DURATION));
      const target = ready ? timed : Math.min(timed, HOLD_AT);

      shown = Math.min(target, shown + (now - last) * MAX_SPEED);
      last = now;
      paint(shown);

      if (shown >= 1) {
        frame = undefined;
        leave();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    paint(0);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("load", markLoaded);
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
      exit?.kill();
    };
  }, []);

  if (done) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex origin-top flex-col items-center justify-center bg-cream p-8 font-label text-[14px] uppercase leading-[1.4] tracking-[0.1em] text-[#352e2e] will-change-transform"
    >
      <div
        ref={rowRef}
        className="flex w-full flex-col items-center justify-center gap-[10rem] md:flex-row md:justify-between md:gap-8"
        aria-hidden="true"
      >
        <p className="flex w-full justify-center md:justify-start">Loading</p>

        {/* The faded logo shows the empty n; the red copy on top is revealed from the bottom up. */}
        <div className="relative aspect-[1600/566] w-[200px] shrink-0 md:w-[240px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- must paint before hydration, no lazy loading */}
          <img src="/logos/leonith-logo-loader-base.png" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={fillRef}
            src="/logos/leonith-logo-loader-n.png"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full"
            style={{ clipPath: "inset(100% 0 0 0)" }}
          />
        </div>

        <p className="flex w-full justify-center md:justify-end">
          <span ref={counterRef}>0</span>%
        </p>
      </div>
    </div>
  );
}
