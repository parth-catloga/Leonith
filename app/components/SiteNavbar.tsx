"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocialLinks from "./SocialLinks";

const navigationLinks = [
  { href: "/about", label: "About" },
  { href: "/showroom", label: "Digital Collection" },
  { href: "/contact", label: "Contact" },
];

// Pages that open on a dark full-screen hero, where the bar starts clear.
const HERO_PAGES = ["/", "/about"];

// Full-screen pages where the bar stays see-through over the page itself.
// The showroom is light, so the bar keeps the dark logo and links.
const CLEAR_PAGES = ["/showroom"];

// Roughly half the navbar height, so it turns dark as the cream page reaches it.
const NAV_SWITCH_OFFSET = 48;

export default function SiteNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isPastHero, setIsPastHero] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);

  useEffect(() => {
    // Looked up on every scroll, since streamed page content can arrive after this runs.
    const handleScroll = () => {
      const content = document.querySelector("[data-after-hero]");

      setIsPastHero(!!content && content.getBoundingClientRect().top <= NAV_SWITCH_OFFSET);

      // Sections marked data-nav-dark (like Collection) show through a clear bar.
      setIsOverDark(
        [...document.querySelectorAll("[data-nav-dark]")].some((section) => {
          const { top, bottom } = section.getBoundingClientRect();
          return top <= NAV_SWITCH_OFFSET && bottom > NAV_SWITCH_OFFSET;
        }),
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  const closeMenu = () => setIsMenuOpen(false);
  // Pages without a hero start on cream. Dark sections show through, so the bar
  // goes clear with the light logo.
  const isOnCream = (!HERO_PAGES.includes(pathname) || isPastHero) && !isOverDark;
  const isDark = isMenuOpen || isOnCream;
  const isClear = CLEAR_PAGES.includes(pathname);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 px-4 py-5 transition-colors duration-500 sm:px-8 lg:px-14 ${
          isOnCream && !isMenuOpen && !isClear ? "bg-cream" : ""
        }`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between">
          <Link
            href="/#top"
            className={`block transition-opacity hover:opacity-70 ${isDark ? "" : "drop-shadow-md"}`}
            onClick={closeMenu}
          >
            <Image
              src={isDark ? "/logos/leonith-logo-black.png" : "/logos/leonith-logo-white.png"}
              alt="Leonith"
              width={600}
              height={200}
              className="h-auto w-32 sm:w-40"
              priority
            />
          </Link>

          <div className="flex items-center gap-6 lg:gap-8">
            <button
              type="button"
              className={`relative grid h-12 w-12 place-items-center ${
                isDark ? "text-zinc-950" : "text-white drop-shadow-md"
              }`}
              aria-expanded={isMenuOpen}
              aria-controls="site-menu"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="sr-only">Menu</span>
              <span className="relative block h-4 w-8" aria-hidden="true">
                {[0, 1, 2, 3].map((line) => (
                  <span
                    key={line}
                    className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${
                      isMenuOpen && line === 0
                        ? "top-2 rotate-45"
                        : isMenuOpen && line === 3
                          ? "top-2 -rotate-45"
                          : isMenuOpen
                            ? "top-2 opacity-0"
                            : ""
                    }`}
                    style={!isMenuOpen ? { top: `${line * 5}px` } : undefined}
                  />
                ))}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        id="site-menu"
        className={`fixed inset-0 z-40 overflow-hidden ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="absolute inset-0 grid grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((panel) => (
            <div
              key={panel}
              className={`bg-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] ${
                isMenuOpen ? "translate-y-0" : "-translate-y-full"
              }`}
              style={{
                transitionDelay: isMenuOpen ? `${panel * 70}ms` : `${(2 - panel) * 70}ms`,
              }}
            />
          ))}
        </div>

        <div
          className={`relative grid min-h-svh grid-rows-[1fr_auto] px-6 pb-10 pt-28 transition-all duration-500 ease-out sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)] lg:grid-rows-1 lg:px-14 lg:pb-14 lg:pt-32 ${
            isMenuOpen ? "translate-y-0 opacity-100 delay-200" : "-translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col justify-between lg:pr-16">
            <div className="flex flex-col gap-4 sm:gap-6">
              {navigationLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex w-fit items-center gap-4 whitespace-nowrap font-display text-[1.6rem] font-normal uppercase tracking-[-0.02em] text-zinc-950 transition-opacity hover:opacity-50 sm:text-5xl lg:text-[1.8rem] xl:text-[2.4rem] 2xl:text-[3rem]"
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={closeMenu}
                >
                  {link.label}
                  <span className="text-2xl opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100 sm:text-3xl">→</span>
                </a>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-5 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              <span>Follow US</span>
              <SocialLinks tabIndex={isMenuOpen ? 0 : -1} />
            </div>
          </div>

          <div className="relative mt-10 hidden min-h-0 overflow-hidden bg-zinc-950 lg:mt-0 lg:block">
            {isMenuOpen && (
              <video
                className="h-full w-full object-cover opacity-75"
                src="/videos/hero-video-scroll.mp4"
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      </div>
    </>
  );
}
