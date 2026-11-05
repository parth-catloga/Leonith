"use client";

import { useEffect, type RefObject } from "react";

// Calls `onProgress` with 0..1 as a tall section scrolls through its sticky
// viewport. Runs once per frame at most, straight to the DOM, so React never
// re-renders while scrolling.
export function useScrollProgress(sectionRef: RefObject<HTMLElement | null>, onProgress: (progress: number) => void) {
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let frame: number | undefined;

    const update = () => {
      frame = undefined;
      const distance = section.offsetHeight - window.innerHeight;
      const progress = distance > 0 ? -section.getBoundingClientRect().top / distance : 0;
      onProgress(Math.min(1, Math.max(0, progress)));
    };

    const request = () => {
      if (frame === undefined) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
    };
    // The callback only writes to refs, so it never needs to re-subscribe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRef]);
}
