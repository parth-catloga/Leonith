// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { ArrowRight } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type PointerEvent,
} from "react";

const DEFAULT_HREF = "#";
const COMPACT_LAYOUT_BREAKPOINT = 1280;
const ANIMATION_DURATION_MS = 450;

export interface ArrowFillButtonOwnProps {
  btnText?: string;
  href?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  fillBgColor?: string;
  fillTextColor?: string;
  hoverFillBgColor?: string;
  hoverFillTextColor?: string;
  arrowColor?: string;
  hoverArrowColor?: string;
  animationDuration?: number;
  fillOnHover?: boolean;
}

export type ArrowFillButtonProps = ArrowFillButtonOwnProps & Omit<ComponentPropsWithoutRef<"a">, keyof ArrowFillButtonOwnProps>;

function ArrowFillButton({
  btnText = "Hover Me",
  href = DEFAULT_HREF,
  className = "",
  bgColor = "#ff5f00",
  textColor = "#ffffff",
  fillBgColor = "#ffffff",
  fillTextColor = "#ff5f00",
  hoverFillBgColor = "#ffffff",
  hoverFillTextColor = "#ff5f00",
  arrowColor,
  hoverArrowColor,
  animationDuration = ANIMATION_DURATION_MS,
  fillOnHover = true,
  ...props
}: ArrowFillButtonProps) {
  const [isReady, setIsReady] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const releaseTimeoutRef = useRef<number | null>(null);

  const usesUtilityBackground =
    className.includes("bg-") ||
    className.includes("from-") ||
    className.includes("via-") ||
    className.includes("to-");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${COMPACT_LAYOUT_BREAKPOINT - 1}px)`);

    const syncCompactLayout = (event: MediaQueryList | MediaQueryListEvent) => {
      const matches = event.matches;
      setIsCompactLayout(matches);

      if (!matches) {
        setIsPressed(false);
      }
    };

    syncCompactLayout(mediaQuery);
    mediaQuery.addEventListener("change", syncCompactLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncCompactLayout);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (releaseTimeoutRef.current) {
        window.clearTimeout(releaseTimeoutRef.current);
      }
    };
  }, []);

  const clearPressedState = () => {
    if (releaseTimeoutRef.current) {
      window.clearTimeout(releaseTimeoutRef.current);
    }

    releaseTimeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      releaseTimeoutRef.current = null;
    }, ANIMATION_DURATION_MS);
  };

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerDown?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    if (releaseTimeoutRef.current) {
      window.clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }

    setIsPressed(true);
  };

  const handlePointerUp = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerUp?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    clearPressedState();
  };

  const handlePointerCancel = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerCancel?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    clearPressedState();
  };

  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerEnter?.(event);

    if (event.pointerType === "mouse") {
      setIsHovered(true);
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerLeave?.(event);
    setIsHovered(false);
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerMove?.(event);

    if (event.pointerType === "mouse") {
      setIsHovered(true);
    }
  };

  return (
    <a
      href={href}
      {...props}
      data-pressed={isPressed ? "true" : "false"}
      data-hovered={isHovered ? "true" : "false"}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      data-fill-on-hover={fillOnHover ? "true" : "false"}
      className={`arrow-fill-button group relative inline-flex h-12 w-fit min-w-fit max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-full border border-(--btn-bg) px-5 pr-[calc(var(--icon-circle)+var(--icon-right)+1.25rem)] whitespace-nowrap font-medium text-xs leading-none [text-rendering:geometricPrecision] [--icon-circle:2.5rem] [--icon-right:0.35rem] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-md:h-11 max-md:px-4 max-md:pr-[calc(var(--icon-circle)+var(--icon-right)+1rem)] max-md:[--icon-circle:2.25rem] ${
        usesUtilityBackground ? "" : "bg-(--btn-bg)"
      } text-(--btn-text) ${className}`}
      style={{
        "--btn-bg": bgColor,
        "--btn-text": textColor,
        "--btn-fill-bg": fillBgColor,
        "--btn-fill-text": fillTextColor,
        "--btn-fill-bg-hover": hoverFillBgColor,
        "--btn-fill-text-hover": hoverFillTextColor,
        "--btn-arrow": arrowColor || fillTextColor,
        "--btn-arrow-hover": hoverArrowColor || hoverFillTextColor,
        "--btn-duration": `${animationDuration}ms`,
        visibility: isReady ? "visible" : "hidden",
      } as CSSProperties & Record<string, string | number>}
    >
      <span className="relative z-1 pb-px">{btnText}</span>

      <span
        aria-hidden="true"
        className={`arrow-fill-button__fill pointer-events-none absolute z-2 rounded-full bg-(--btn-fill-bg) inset-[var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))] ${
          isReady
            ? `transition-all duration-[var(--btn-duration)] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-data-[pressed=true]:bg-(--btn-fill-bg-hover) group-data-[pressed=true]:inset-0 ${fillOnHover ? "group-data-[hovered=true]:bg-(--btn-fill-bg-hover) group-data-[hovered=true]:inset-0" : ""}`
            : ""
        }`}
      />

      <span
        aria-hidden="true"
        className={`arrow-fill-button__copy pointer-events-none absolute inset-0 z-2 flex items-center px-5 pr-[calc(var(--icon-circle)+var(--icon-right)+1.25rem)] text-(--btn-fill-text) [clip-path:inset(var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle)))] max-md:px-4 max-md:pr-[calc(var(--icon-circle)+var(--icon-right)+1rem)] ${
          isReady
            ? `transition-all duration-[var(--btn-duration)] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-data-[pressed=true]:text-(--btn-fill-text-hover) group-data-[pressed=true]:[clip-path:inset(0_0_0_0)] ${fillOnHover ? "group-data-[hovered=true]:text-(--btn-fill-text-hover) group-data-[hovered=true]:[clip-path:inset(0_0_0_0)]" : ""}`
            : ""
        }`}
      >
        <span className="relative z-1 pb-px whitespace-nowrap">{btnText}</span>
      </span>

      <span
        className={`arrow-fill-button__circle absolute right-[var(--icon-right)] top-1/2 z-3 inline-flex h-[var(--icon-circle)] w-[var(--icon-circle)] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-(--btn-fill-bg) text-(--btn-arrow) ${
          isReady
            ? `transition-colors duration-[var(--btn-duration)] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-data-[pressed=true]:bg-(--btn-fill-bg-hover) group-data-[pressed=true]:text-(--btn-arrow-hover) ${fillOnHover ? "group-data-[hovered=true]:bg-(--btn-fill-bg-hover) group-data-[hovered=true]:text-(--btn-arrow-hover)" : ""}`
            : ""
        }`}
        style={{
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          maskImage: "radial-gradient(white, black)",
        }}
        aria-hidden="true"
      >
        <ArrowRight
          className={`arrow-fill-button__arrow-in pointer-events-none absolute left-1/2 top-1/2 size-5 max-md:size-4 translate-x-[-170%] -translate-y-1/2 origin-center scale-0 text-current ${
            isReady
              ? `transition-transform duration-[var(--btn-duration)] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-data-[pressed=true]:-translate-x-1/2 group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-100 ${fillOnHover ? "group-data-[hovered=true]:-translate-x-1/2 group-data-[hovered=true]:-translate-y-1/2 group-data-[hovered=true]:scale-100" : ""}`
              : ""
          }`}
          strokeWidth={1.8}
        />
        <ArrowRight
          className={`arrow-fill-button__arrow-out pointer-events-none absolute left-1/2 top-1/2 size-5 max-md:size-4 -translate-x-1/2 -translate-y-1/2 origin-center text-current ${
            isReady
              ? `transition-transform duration-[var(--btn-duration)] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-data-[pressed=true]:translate-x-[70%] group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-0 ${fillOnHover ? "group-data-[hovered=true]:translate-x-[70%] group-data-[hovered=true]:-translate-y-1/2 group-data-[hovered=true]:scale-0" : ""}`
              : ""
          }`}
          strokeWidth={1.8}
        />
      </span>
      <span aria-hidden="true" className="absolute inset-0 z-10 cursor-pointer" />
    </a>
  );
}

export default ArrowFillButton;
