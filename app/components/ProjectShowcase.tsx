"use client";

import { useEffect, useRef, useState } from "react";
import PillLink from "./PillLink";
import { sizeRanges, type SizeRange } from "./sizeRanges";

function RangeDetails({ range }: { range: SizeRange }) {
  return (
    <>
      <div className="flex max-w-md flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="whitespace-pre-line font-display text-[clamp(2rem,3.6vw,3.5rem)] uppercase leading-none">{range.title}</h2>
          <p className="text-xs uppercase tracking-[0.14em]">{range.thickness}</p>
        </div>
        <p className="text-sm leading-relaxed">{range.description}</p>
        <PillLink href="/contact">Enquire</PillLink>
      </div>
    </>
  );
}

export default function ProjectShowcase() {
  const showcaseRef = useRef<HTMLElement>(null);
  const [activeRange, setActiveRange] = useState(0);

  useEffect(() => {
    const showcase = showcaseRef.current;

    if (!showcase) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rangeStarts = showcase.querySelectorAll("[data-range-start]");
    const reveal = showcase.querySelector<HTMLElement>("[data-reveal]");
    let navHeight = 0;
    let lastProgress = -1;
    let animationFrame: number | undefined;

    const measure = () => {
      navHeight = parseFloat(getComputedStyle(showcase).getPropertyValue("--nav")) * 16;
    };

    // Measured from the live position because the hero's pin spacer changes the
    // page height after this component mounts.
    const update = () => {
      animationFrame = undefined;
      const scrolled = navHeight - showcase.getBoundingClientRect().top;
      const progress = reduceMotion ? 1 : Math.min(1, Math.max(0, scrolled / (window.innerHeight * 0.5)));

      // Only the reveal element gets the value, so nothing else restyles while scrolling.
      if (reveal && progress !== lastProgress) {
        lastProgress = progress;
        reveal.style.setProperty("--reveal", String(progress));
      }

      // Swap the text once a range's first image has covered half the screen.
      let nextRange = 0;
      rangeStarts.forEach((start, index) => {
        if (start.getBoundingClientRect().top <= window.innerHeight / 2) {
          nextRange = index;
        }
      });
      setActiveRange(nextRange);
    };

    const requestUpdate = () => {
      if (animationFrame === undefined) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    const handleResize = () => {
      measure();
      requestUpdate();
    };

    measure();
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", handleResize);
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    // `overflow-x: clip` hides the reveal sliding past the right edge without
    // breaking the sticky columns the way `overflow: hidden` would.
    <div id="work" className="bg-cream px-4 text-black [overflow-x:clip] lg:px-14">
      <article
        ref={showcaseRef}
        className="grid gap-8 pb-16 [--nav:6rem] lg:grid-cols-2 lg:pb-32"
      >
        <div className="relative hidden lg:sticky lg:top-[var(--nav)] lg:block lg:h-[calc(100svh-var(--nav))]">
          {sizeRanges.map((range, rangeIndex) => (
            <div
              key={range.title}
              className={`absolute inset-0 flex flex-col justify-end gap-6 py-6 pr-6 transition-[opacity,visibility] duration-500 ${
                rangeIndex === activeRange ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <RangeDetails range={range} />
            </div>
          ))}
        </div>

        <div className="relative z-10 lg:-mr-14">
          {sizeRanges.map((range, rangeIndex) => (
            // `contents` keeps every image sticky against the whole column, so each
            // one stacks over the last across ranges.
            <div key={range.title} className="mb-16 last:mb-0 lg:contents">
              <div className="mb-8 flex flex-col gap-8 lg:hidden">
                <RangeDetails range={range} />
              </div>

              {range.images.map((image, imageIndex) => {
                const expandsFromFullWidth = rangeIndex === 0 && imageIndex === 0;

                return (
                  <div key={image.caption} className="contents">
                    <figure
                      data-range-start={imageIndex === 0 ? "" : undefined}
                      className="relative mb-2 aspect-[4/5] sm:aspect-[4/3] lg:sticky lg:top-[var(--nav)] lg:mb-0 lg:aspect-auto lg:h-[calc(100svh-var(--nav))]"
                    >
                      {expandsFromFullWidth ? (
                        // The window slides right while the image slides back by the same
                        // amount, so the image stays put as its left edge closes in. Both
                        // are transforms, which the GPU handles without repainting.
                        <div
                          data-reveal
                          className="absolute inset-y-0 right-0 w-full overflow-hidden [--reveal:0] max-lg:-inset-x-4 max-lg:w-auto lg:w-[calc(200%+2rem)] lg:translate-x-[calc(var(--reveal)*(50%+1rem))] lg:will-change-transform"
                        >
                          <div
                            role="img"
                            aria-label={image.caption}
                            className="absolute inset-0 bg-cover bg-center lg:-translate-x-[calc(var(--reveal)*(50%+1rem))] lg:will-change-transform"
                            style={{ backgroundImage: `url(/textures/${image.texture}.webp)` }}
                          />
                        </div>
                      ) : (
                        <div
                          role="img"
                          aria-label={image.caption}
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(/textures/${image.texture}.webp)` }}
                        />
                      )}
                      <figcaption className="absolute inset-x-4 bottom-4 flex justify-end text-xs uppercase tracking-[0.14em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                        <span>
                          {imageIndex + 1} / {range.images.length}
                        </span>
                      </figcaption>
                    </figure>
                    {/* Holds the first image in place while it narrows to its column. */}
                    {expandsFromFullWidth && <div className="hidden h-[60svh] lg:block" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
