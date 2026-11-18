"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import CtaButton from "@/components/ui/cta-button";

// `href` makes the whole card a link and adds a "Read more" button under the text.
export type StoryCard = { title: string; image: string; alt: string; body: ReactNode; href?: string };

// Mobile layout for the application stories: the cards sit in a stack that pins below the
// navbar, and scrolling down flicks the top card up and away to reveal the next one.
// The section is one screen tall per card, so normal page scrolling drives it and nothing
// hijacks the visitor's swipe. Visitors who prefer reduced motion get the cards in a plain list.
// `titleTag` is h2 on the application pages and h3 where the stack sits under its own section heading.
export default function StoryStack({
  stories,
  titleTag: Title = "h2",
}: {
  stories: StoryCard[];
  titleTag?: "h2" | "h3";
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section?.setAttribute("data-static", "");
      return;
    }

    const last = stories.length - 1;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      // 0 while the first card is on top, up to `last` once the final card is showing.
      const progress = Math.min(Math.max(-rect.top / Math.max(travel, 1), 0), 1) * last;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const offset = index - progress;
        // Cards still waiting in the stack hide their button, so it can't peek out below the front card.
        card.toggleAttribute("data-behind", offset > 0.5);
        if (offset < 0) {
          // Leaving: slide up past the top with a slight tilt. It stays opaque so its text
          // never shows through over the next card's.
          card.style.transform = `translateY(${offset * 115}%) rotate(${offset * 5}deg)`;
        } else {
          // Waiting underneath: a little lower and smaller per place in the stack.
          const depth = Math.min(offset, 2);
          card.style.transform = `translateY(${depth * 14}px) scale(${1 - depth * 0.05})`;
        }
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [stories.length]);

  return (
    <div
      ref={sectionRef}
      // One screen of scroll per card; the sticky stage below stays in view while it runs.
      style={{ height: `${stories.length * 100}svh` }}
      className="group/stack -mx-4 data-[static]:!h-auto"
    >
      <div className="sticky top-24 flex h-[calc(100svh-6rem)] flex-col px-4 pb-12 group-data-[static]/stack:static group-data-[static]/stack:pb-0 group-data-[static]/stack:h-auto">
        <div className="relative flex-1 group-data-[static]/stack:flex group-data-[static]/stack:flex-col group-data-[static]/stack:gap-10">
          {stories.map((story, index) => (
            <article
              key={story.title}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              style={{ zIndex: stories.length - index }}
              className="group/card absolute inset-0 flex origin-bottom flex-col overflow-hidden rounded-xl border border-black/10 bg-cream will-change-transform group-data-[static]/stack:relative group-data-[static]/stack:inset-auto"
            >
              <div className="relative min-h-0 flex-[1_1_45%] group-data-[static]/stack:aspect-[4/5] group-data-[static]/stack:flex-none">
                <Image src={story.image} alt={story.alt} fill sizes="100vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-3 p-5">
                <span className="text-xs uppercase tracking-[0.14em] text-[#E20114]">0{index + 1}</span>
                <Title className="font-display text-[1.6rem] uppercase leading-[1.05] tracking-[-0.02em]">
                  {story.href ? (
                    <Link href={story.href} className="after:absolute after:inset-0">
                      {story.title}
                    </Link>
                  ) : (
                    story.title
                  )}
                </Title>
                <p className="text-[13px] leading-[1.6] tracking-[-0.03em] text-black/70">{story.body}</p>
                {story.href && (
                  // Sits above the card-wide link so it gets its own focus and hover fill.
                  <CtaButton href={story.href} className="relative z-10 mt-1 group-data-[behind]/card:invisible">
                    Read more
                  </CtaButton>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
