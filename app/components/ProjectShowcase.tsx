"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CtaButton from "@/components/ui/cta-button";
import { sizeRanges, type SizeRange } from "./sizeRanges";
import { whatsappLink } from "./contactDetails";

function whatsappEnquiryLink(range: SizeRange) {
  const size = range.title.replace(/\s+/g, " ").trim();
  const message = range.comingSoon
    ? `Hi Leonith, please let me know when the ${size} slabs arrive.`
    : `Hi Leonith, I'd like to enquire about the ${size} slab (${range.thickness}).`;

  return whatsappLink(message);
}

function RangeDetails({ range }: { range: SizeRange }) {
  return (
    <>
      <div className="flex max-w-md flex-col gap-6">
        <div className="flex flex-col gap-3">
          {range.nsfCertified && (
            <p className="mb-2 flex items-center gap-3 text-xs uppercase tracking-[0.14em]">
              <Image src="/logos/nsf-badge.png" alt="" width={48} height={48} className="size-12" />
              NSF certified
            </p>
          )}
          <h2 className="whitespace-pre-line font-display text-[clamp(2rem,3.6vw,3.5rem)] uppercase leading-none">{range.title}</h2>
          <p className="text-xs uppercase tracking-[0.14em]">{range.thickness}</p>
        </div>
        <p className="text-sm leading-relaxed">{range.description}</p>
        <CtaButton href={whatsappEnquiryLink(range)} target="_blank" rel="noopener noreferrer">
          Enquire
        </CtaButton>
      </div>
    </>
  );
}

// Phones get the desktop effect in one column: the section pins below the navbar and
// scrolling stacks each slab over the last while the details above crossfade to match.
function MobileRangeSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = sizeRanges.length;

  useEffect(() => {
    const track = trackRef.current;

    if (!track || !window.matchMedia("(max-width: 1023px)").matches) {
      return;
    }

    let frame: number | undefined;
    const update = () => {
      frame = undefined;
      const pin = track.firstElementChild as HTMLElement | null;
      const distance = track.offsetHeight - (pin?.offsetHeight ?? window.innerHeight);
      const top = pin ? parseFloat(getComputedStyle(pin).top) : 0;
      const scrolled = top - track.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, scrolled / Math.max(1, distance))) * (count - 1);

      // The images read this var directly, so React only re-renders when the text swaps.
      track.style.setProperty("--slide", String(progress));
      setActive(Math.round(progress));
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
  }, [count]);

  return (
    // Each slab gets about 70% of a screen of scrolling while the view stays pinned.
    <div
      ref={trackRef}
      className="relative [--slide:0] lg:hidden"
      style={{ height: `calc(100svh - var(--nav) + ${(count - 1) * 70}svh)` }}
      aria-label="Slab sizes"
    >
      <div className="sticky top-[var(--nav)] flex h-[calc(100svh-var(--nav))] flex-col gap-6">
        {/* Every slide's text shares one grid cell, so the block keeps the tallest height and nothing jumps. */}
        <div className="grid">
          {sizeRanges.map((range, index) => (
            <div
              key={range.title}
              className={`col-start-1 row-start-1 flex flex-col gap-6 transition-[opacity,visibility] duration-500 ${
                index === active ? "visible opacity-100" : "invisible opacity-0"
              }`}
              aria-hidden={index !== active}
            >
              <RangeDetails range={range} />
            </div>
          ))}
        </div>

        {/* Bleeds past the section's side padding so the slabs run edge to edge. */}
        <div className="relative -mx-4 min-h-0 flex-1 overflow-hidden">
          {sizeRanges.map((range, index) => {
            const image = range.images[0];

            return (
              <figure
                key={range.title}
                className="absolute inset-0 will-change-transform"
                // Slab n rises from below as --slide goes from n-1 to n, covering the one before.
                style={{ transform: `translateY(calc(clamp(0, ${index} - var(--slide), 1) * 100%))` }}
              >
                <div
                  role="img"
                  aria-label={image.caption}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(/textures/${image.texture}.webp)` }}
                />
                <figcaption className="absolute inset-x-4 bottom-4 flex justify-between gap-4 text-xs uppercase tracking-[0.14em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                  <span>{image.caption}</span>
                  <span>
                    {index + 1} / {count}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
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
        className="grid gap-8 [--nav:6rem] lg:grid-cols-2"
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

        <MobileRangeSlider />

        <div className="relative z-10 hidden lg:-mr-14 lg:block">
          {sizeRanges.map((range, rangeIndex) => (
            // `contents` keeps every image sticky against the whole column, so each
            // one stacks over the last across ranges.
            <div key={range.title} className="mb-16 last:mb-0 lg:contents">
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
