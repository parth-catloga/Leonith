"use client";

import { gsap } from "gsap";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    label: "Bigger",
    lines: [
      [{ text: "Bigger surfaces, fewer lines," }],
      [{ text: "so every room feels" }],
      [{ text: "open", accent: true }, { text: " and " }, { text: "endless.", accent: true }],
    ],
  },
  {
    label: "Bolder",
    lines: [
      [{ text: "Bolder veins, richer tones," }],
      [{ text: "and a floor that makes a" }],
      [{ text: "statement.", accent: true }],
    ],
  },
  {
    label: "Better",
    lines: [
      [{ text: "Better stone, better finish," }],
      [{ text: "and a home made to " }, { text: "last.", accent: true }],
    ],
  },
];

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const lenis = useLenis();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let animationFrame: number | undefined;

    const update = () => {
      animationFrame = undefined;
      const scrollDistance = section.offsetHeight - window.innerHeight;
      const progress = -section.getBoundingClientRect().top / scrollDistance;
      const nextStep = Math.floor(progress * steps.length);

      setActiveStep(Math.min(steps.length - 1, Math.max(0, nextStep)));
    };

    const requestUpdate = () => {
      if (animationFrame === undefined) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    const copy = copyRef.current;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!copy || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const tween = gsap.fromTo(
      copy.querySelectorAll("[data-line]"),
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" },
    );

    return () => {
      tween.kill();
    };
  }, [activeStep]);

  const scrollToStep = (step: number) => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = section.offsetHeight - window.innerHeight;

    const top = sectionTop + ((step + 0.5) / steps.length) * scrollDistance;

    // Goes through Lenis when it is running, so the two scrolls don't fight.
    if (lenis) {
      lenis.scrollTo(top);
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="expertise"
      aria-label="Expertise"
      className="relative h-[300svh] bg-cream font-[family-name:var(--font-geist-sans)] text-black"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden px-4 pb-6 pt-28 lg:px-14 lg:pb-8">
        <div className="relative min-h-0 flex-1 pt-12 lg:pt-[12svh]">
          <div className="lg:max-w-[70%]">
            <div
              ref={copyRef}
              className="min-h-[3.5em] text-[clamp(1.75rem,5.05vw,5.5rem)] font-light leading-[1.16] tracking-[-0.07em]"
            >
              {steps[activeStep].lines.map((line, lineIndex) => (
                <span key={`${activeStep}-${lineIndex}`} className="-mb-[0.28em] block overflow-hidden pb-[0.28em]">
                  <span data-line className="inline-block whitespace-pre-wrap">
                    {line.map((segment) =>
                      segment.accent ? (
                        <span
                          key={segment.text}
                          className="font-[family-name:var(--font-fraunces)] text-[1.17em] font-normal italic leading-none text-[#E20114]"
                        >
                          {segment.text}
                        </span>
                      ) : (
                        segment.text
                      ),
                    )}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 right-0 flex flex-col items-end text-[clamp(2.25rem,6.5vw,6.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.07em]">
            {steps.map((step, stepIndex) => (
              <button
                key={step.label}
                type="button"
                className="group relative cursor-pointer uppercase"
                aria-pressed={stepIndex === activeStep}
                onClick={() => scrollToStep(stepIndex)}
              >
                <span className="block whitespace-nowrap text-black/20">{step.label}</span>
                {/* Wipes in from the top, like ink filling the word. */}
                <span
                  className={`absolute inset-x-[-0.1em] -inset-y-[0.1em] whitespace-nowrap px-[0.1em] py-[0.1em] text-black transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:[clip-path:inset(0)] ${
                    stepIndex === activeStep ? "[clip-path:inset(0)]" : "[clip-path:inset(0_0_100%)]"
                  }`}
                  aria-hidden="true"
                >
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
