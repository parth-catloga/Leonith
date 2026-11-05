"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Derived from the supplied 4K source at 1080p with frequent keyframes so
// browsers can seek smoothly in both scroll directions.
const VIDEO_SOURCE = "/videos/hero-video-scroll.mp4";
// Ignore sub-frame differences while still allowing the browser to render every frame.
const MINIMUM_SEEK_DELTA = 1 / 120;

export default function ScrollVideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section) {
      return;
    }

    let context: gsap.Context | undefined;
    let seekAnimationFrame: number | undefined;

    const initializeScrollAnimation = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        section.dataset.videoState = "error";
        return;
      }

      section.dataset.videoState = "ready";
      const duration = video.duration;
      const playhead = { progress: 0 };
      const finalFrameHold = { progress: 0 };
      let lastTargetTime = -1;
      let pendingTime = 0;

      context = gsap.context(() => {
        const renderVideoFrame = () => {
          seekAnimationFrame = undefined;

          if (
            pendingTime === 0 ||
            pendingTime === duration ||
            Math.abs(video.currentTime - pendingTime) >= MINIMUM_SEEK_DELTA
          ) {
            video.currentTime = pendingTime;
          }
        };

        const seekTo = (time: number) => {
          pendingTime = time;

          if (seekAnimationFrame === undefined) {
            seekAnimationFrame = requestAnimationFrame(renderVideoFrame);
          }
        };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 3, duration * 240)}`,
            pin: true,
            // Keep the video locked to the real scroll position. A scrub delay can
            // otherwise let the pin release while the decoder is still catching up.
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          playhead,
          {
            progress: 1,
            // Finish the video before the pin ends, then hold the final frame for
            // the remaining scroll distance before revealing the page content.
            duration: 0.9,
            ease: "none",
            onUpdate: () => {
              const nextTime = Math.min(duration, Math.max(0, playhead.progress * duration));

              if (
                Math.abs(nextTime - lastTargetTime) >= MINIMUM_SEEK_DELTA ||
                nextTime === 0 ||
                nextTime === duration
              ) {
                lastTargetTime = nextTime;

                seekTo(nextTime);
              }
            },
          },
          0,
        );

        // Extend the timeline after the video completes so the final frame remains
        // visible while the section is still pinned.
        timeline.to(finalFrameHold, { progress: 1, duration: 0.1, ease: "none" }, 0.9);
      }, section);
    };

    const handleMetadata = () => initializeScrollAnimation();
    const handleError = () => {
      section.dataset.videoState = "error";
    };

    video.addEventListener("loadedmetadata", handleMetadata, { once: true });
    video.addEventListener("error", handleError, { once: true });

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      initializeScrollAnimation();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("error", handleError);
      if (seekAnimationFrame !== undefined) {
        cancelAnimationFrame(seekAnimationFrame);
      }
      context?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh overflow-hidden bg-zinc-950"
      aria-label="Leonith introduction"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SOURCE}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)] sm:bottom-10"
        aria-hidden="true"
      >
        <svg viewBox="0 0 120 120" className="h-28 w-28 sm:h-32 sm:w-32">
          <defs>
            <path id="scroll-to-discover-arc" d="M 18 78 A 42 42 0 0 1 102 78" fill="none" />
          </defs>
          <text className="fill-current font-display text-[11px] tracking-[0.08em]">
            <textPath href="#scroll-to-discover-arc" startOffset="50%" textAnchor="middle">
              SCROLL TO DISCOVER
            </textPath>
          </text>
          <circle cx="60" cy="80" r="28" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.8" />
          <circle cx="60" cy="62" r="2.5" fill="currentColor">
            <animate attributeName="cy" values="62;98;62" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </section>
  );
}
