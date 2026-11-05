"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

// Same settings as degrawanddehaan.com. Lenis lets a duration win over lerp,
// so wheel scrolls ease out over 1.5 s; touch keeps native scrolling.
const LENIS_OPTIONS = {
  lerp: 0.1,
  duration: 1.5,
  anchors: true,
  autoRaf: false,
};

// Starts each page at the top, as the reference does on route changes.
function ScrollToTopOnRouteChange() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis, pathname]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  // Lenis runs on GSAP's ticker and reports every frame to ScrollTrigger, so
  // the pinned video hero stays in step with the smoothed scroll position.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenisRef.current?.lenis?.destroy();
      return;
    }

    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis?.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root options={LENIS_OPTIONS} ref={lenisRef}>
      <ScrollToTopOnRouteChange />
      {children}
    </ReactLenis>
  );
}
