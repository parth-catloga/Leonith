"use client";

import { ArrowRight } from "lucide-react";
import type { MouseEventHandler, ReactNode } from "react";

type CtaButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "light" | "dark";
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  target?: string;
  rel?: string;
  disabled?: boolean;
};

// The fill and arrows animate on `group-hover`, so they also play when the button sits inside a
// hovered `group` (a blog card, say). The text colour needs both rules: `hover:` for hovering the
// button itself (group-hover only matches descendants of a group, never the group element) and
// `group-hover:` for hovering a parent group.
const variantClasses = {
  light: {
    button: "border-white bg-white text-zinc-950 hover:text-white group-hover:text-white focus-visible:text-white",
    fill: "bg-zinc-950",
    arrow: "text-white",
  },
  dark: {
    button: "border-zinc-950 bg-zinc-950 text-cream hover:text-zinc-950 group-hover:text-zinc-950 focus-visible:text-zinc-950",
    fill: "bg-cream",
    arrow: "text-zinc-950",
  },
};

function CtaContents({ children, variant }: { children: ReactNode; variant: NonNullable<CtaButtonProps["variant"]> }) {
  const styles = variantClasses[variant];

  return (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-[calc(100%-2.75rem)] right-1 z-0 rounded-full ${styles.fill} transition-[inset,left,right,border-radius] duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:inset-y-0 group-hover:left-0 group-hover:right-0 group-focus-visible:inset-y-0 group-focus-visible:left-0 group-focus-visible:right-0`}
      />
      <span className="relative z-10 whitespace-nowrap">{children}</span>
      <span
        aria-hidden="true"
        className={`absolute right-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center ${styles.arrow}`}
      >
        <ArrowRight
          className="absolute left-1/2 top-1/2 size-5 -translate-x-[170%] -translate-y-1/2 scale-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:-translate-x-1/2 group-hover:scale-100 group-focus-visible:-translate-x-1/2 group-focus-visible:scale-100"
          strokeWidth={1.8}
        />
        <ArrowRight
          className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:translate-x-[70%] group-hover:scale-0 group-focus-visible:translate-x-[70%] group-focus-visible:scale-0"
          strokeWidth={1.8}
        />
      </span>
    </>
  );
}

export default function CtaButton({
  children,
  href,
  className = "",
  variant = "dark",
  type = "button",
  onClick,
  target,
  rel,
  disabled = false,
}: CtaButtonProps) {
  const styles = variantClasses[variant];
  const baseClassName = `group relative inline-flex h-12 w-fit items-center overflow-hidden rounded-full border px-5 pr-14 font-mono text-xs font-medium leading-none tracking-[-0.04em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 ${styles.button} ${className}`;

  if (href) {
    return (
      <a
        className={baseClassName}
        href={href}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
        rel={rel}
        target={target}
      >
        <CtaContents variant={variant}>{children}</CtaContents>
      </a>
    );
  }

  return (
    <button
      className={baseClassName}
      disabled={disabled}
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
      type={type}
    >
      <CtaContents variant={variant}>{children}</CtaContents>
    </button>
  );
}
