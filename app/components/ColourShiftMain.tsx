"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// The page background fades to charcoal while a section marked
// data-colour-scheme="dark" crosses the middle of the screen, and back to cream
// once it leaves, like the "HBA at a glance" block on hba.com/about. Text
// flips with it, so neighbouring sections stay readable during the switch.
export default function ColourShiftMain({ className = "", children }: { className?: string; children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const main = mainRef.current;

    if (!main) {
      return;
    }

    const update = () => {
      const middle = window.innerHeight / 2;
      setIsDark(
        [...main.querySelectorAll('[data-colour-scheme="dark"]')].some((section) => {
          const { top, bottom } = section.getBoundingClientRect();
          return top <= middle && bottom > middle;
        }),
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <main
      ref={mainRef}
      data-dark={isDark}
      // Lets the navbar go clear with the light logo while the page is dark.
      data-nav-dark={isDark ? "" : undefined}
      className={`group/scheme transition-colors duration-[750ms] ${
        isDark ? "bg-[#181818] text-[#fbfbf9]" : "bg-cream text-black"
      } ${className}`}
    >
      {children}
    </main>
  );
}
