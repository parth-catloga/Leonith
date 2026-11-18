"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers resize the viewport as the address bar shows and hides. Without
// this, every resize re-measures the pin mid-scroll and the hero jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

// Derived from the supplied 4K source at 1080p with frequent keyframes so
// browsers can seek smoothly in both scroll directions.
const VIDEO_SOURCE = "/videos/hero-video-scroll.mp4";
// Ignore sub-frame differences while still allowing the browser to render every frame.
const MINIMUM_SEEK_DELTA = 1 / 120;

// Phones scrub a still-frame sequence on a canvas instead: mobile browsers seek
// <video> slowly, and a landscape video cropped to a portrait screen shows only a
// narrow, blurry strip. These frames are the centre of the 4K source cut to
// 1080 × 1920 (every third frame, 212 in all, about 13 MB).
const MOBILE_QUERY = "(max-width: 1023px), (pointer: coarse)";
const FRAME_COUNT = 212;
const SOURCE_DURATION = 21.2;
const frameSource = (index: number) => `/videos/hero-frames/${String(index + 1).padStart(3, "0")}.jpg`;

// Coarse frames first (every 16th, then 8th, …) so scrubbing works across the whole
// range almost at once and fills in detail as the rest arrive.
function frameLoadOrder() {
  const order: number[] = [];
  const seen = new Set<number>();
  for (let step = 16; step >= 1; step /= 2) {
    for (let index = 0; index < FRAME_COUNT; index += step) {
      if (!seen.has(index)) {
        seen.add(index);
        order.push(index);
      }
    }
  }
  if (!seen.has(FRAME_COUNT - 1)) {
    order.splice(1, 0, FRAME_COUNT - 1);
  }
  return order;
}

// Pins the hero and maps scroll to 0–1 over the first 90% of the pin, then holds the
// final frame for the remaining distance before the page content is revealed.
function createScrollTimeline(section: HTMLElement, duration: number, onProgress: (progress: number) => void) {
  const playhead = { progress: 0 };
  const finalFrameHold = { progress: 0 };

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * 3, duration * 240)}`,
      pin: true,
      // Keep the frame locked to the real scroll position. A scrub delay can
      // otherwise let the pin release while the frame is still catching up.
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  timeline.to(
    playhead,
    { progress: 1, duration: 0.9, ease: "none", onUpdate: () => onProgress(playhead.progress) },
    0,
  );
  timeline.to(finalFrameHold, { progress: 1, duration: 0.1, ease: "none" }, 0.9);
}

export default function ScrollVideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const section = sectionRef.current;

    if (!video || !canvas || !section) {
      return;
    }

    let context: gsap.Context | undefined;
    let animationFrame: number | undefined;
    let cancelled = false;

    if (window.matchMedia(MOBILE_QUERY).matches) {
      const drawing = canvas.getContext("2d");
      if (!drawing) {
        section.dataset.videoState = "error";
        return;
      }

      section.dataset.videoState = "ready";
      video.hidden = true;
      canvas.hidden = false;

      const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
      let targetFrame = 0;
      let drawnFrame = -1;

      // Closest frame that has finished loading, searching outward from the target.
      const nearestLoaded = (index: number) => {
        for (let offset = 0; offset < FRAME_COUNT; offset += 1) {
          if (frames[index - offset]) return index - offset;
          if (frames[index + offset]) return index + offset;
        }
        return -1;
      };

      const sizeCanvas = () => {
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * scale);
        canvas.height = Math.round(canvas.clientHeight * scale);
        drawnFrame = -1;
      };

      const draw = () => {
        animationFrame = undefined;
        const index = nearestLoaded(targetFrame);
        const image = index >= 0 ? frames[index] : undefined;

        if (!image || index === drawnFrame) {
          return;
        }

        // object-fit: cover, done by hand.
        const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
        const width = image.naturalWidth * scale;
        const height = image.naturalHeight * scale;
        drawing.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
        drawnFrame = index;
      };

      const requestDraw = () => {
        if (animationFrame === undefined) {
          animationFrame = requestAnimationFrame(draw);
        }
      };

      const handleResize = () => {
        sizeCanvas();
        requestDraw();
      };

      sizeCanvas();
      window.addEventListener("resize", handleResize);

      // Six requests at a time keeps the connection busy without starving other assets.
      const queue = frameLoadOrder();
      const loadNext = () => {
        const index = queue.shift();
        if (index === undefined || cancelled) {
          return;
        }
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          if (cancelled) return;
          frames[index] = image;
          // Redraw if this frame is closer to where the scroll is than what's shown.
          if (Math.abs(index - targetFrame) < Math.abs(drawnFrame - targetFrame) || drawnFrame < 0) {
            drawnFrame = -1;
            requestDraw();
          }
          loadNext();
        };
        image.onerror = loadNext;
        image.src = frameSource(index);
      };
      for (let request = 0; request < 6; request += 1) {
        loadNext();
      }

      context = gsap.context(() => {
        createScrollTimeline(section, SOURCE_DURATION, (progress) => {
          const next = Math.round(progress * (FRAME_COUNT - 1));
          if (next !== targetFrame) {
            targetFrame = next;
            requestDraw();
          }
        });
      }, section);

      return () => {
        cancelled = true;
        window.removeEventListener("resize", handleResize);
        if (animationFrame !== undefined) {
          cancelAnimationFrame(animationFrame);
        }
        context?.revert();
      };
    }

    const initializeScrollAnimation = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        section.dataset.videoState = "error";
        return;
      }

      section.dataset.videoState = "ready";
      const duration = video.duration;
      let lastTargetTime = -1;
      let pendingTime = 0;

      const renderVideoFrame = () => {
        animationFrame = undefined;

        if (
          pendingTime === 0 ||
          pendingTime === duration ||
          Math.abs(video.currentTime - pendingTime) >= MINIMUM_SEEK_DELTA
        ) {
          video.currentTime = pendingTime;
        }
      };

      context = gsap.context(() => {
        createScrollTimeline(section, duration, (progress) => {
          const nextTime = Math.min(duration, Math.max(0, progress * duration));

          if (Math.abs(nextTime - lastTargetTime) >= MINIMUM_SEEK_DELTA || nextTime === 0 || nextTime === duration) {
            lastTargetTime = nextTime;
            pendingTime = nextTime;
            if (animationFrame === undefined) {
              animationFrame = requestAnimationFrame(renderVideoFrame);
            }
          }
        });
      }, section);
    };

    const handleMetadata = () => initializeScrollAnimation();
    const handleError = () => {
      section.dataset.videoState = "error";
    };

    video.addEventListener("loadedmetadata", handleMetadata, { once: true });
    video.addEventListener("error", handleError, { once: true });
    video.src = VIDEO_SOURCE;

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("error", handleError);
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
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
      {/* Phones only: shows the first frame until the canvas draws. */}
      <canvas
        ref={canvasRef}
        hidden
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={{ backgroundImage: "url(/videos/hero-frames/001.jpg)" }}
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
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
            <path id="scroll-to-discover-arc" d="M 20.53 92.36 A 42 42 0 1 1 99.47 92.36" fill="none" />
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
