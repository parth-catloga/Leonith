import Image from "next/image";
import { contactDetails } from "./contactDetails";
import CtaButton from "@/components/ui/cta-button";
import SocialLinks from "./SocialLinks";
import { contactLink, navigationLinks } from "./navLinks";

// Every page in the menu, plus Contact.
const footerLinks = [...navigationLinks, contactLink];

const strong = "font-semibold text-black";

// About: heading, intro with key phrases picked out and the button on the left, about video on the right.
export function HomeIntro() {
  return (
    <section
      id="about"
      aria-label="About us"
      className="flex items-center bg-cream px-4 py-24 text-black md:min-h-[100svh] md:py-28 lg:px-14"
    >
      <div className="grid w-full gap-14 md:grid-cols-12 md:items-center">
        <div className="flex flex-col items-start gap-10 md:col-span-6">
          <h2 className="font-display text-[clamp(2.75rem,5.4vw,5.75rem)] uppercase leading-[0.92] tracking-[-0.01em]">
            Leonith
            <br />
            Marmo
            <br />
            Estetico<span className="text-[#E20114]">.</span>
          </h2>
          <p className="max-w-xl text-sm uppercase leading-[1.9] tracking-[0.1em] text-black/70">
            <span className={strong}>Leonith</span> makes <span className={strong}>large-format porcelain slabs</span> in
            Morbi, Gujarat. Formats up to 1600 × 3200 mm mean fewer joints, so kitchens, walls and floors read as{" "}
            <span className={strong}>one continuous surface</span>, with veining from Calacatta to Nero.
          </p>
          <CtaButton href="/about">Discover more</CtaButton>
        </div>
        {/* 4:5 portrait frame that fills its column on laptop screens. On very wide screens the
            width is capped so the frame is never taller than 78% of the screen. Export the video
            at 4:5 (1080 × 1350) so nothing is cropped; a different ratio is cropped to fit. */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden md:col-span-5 md:col-start-8 md:mx-0 md:w-[min(100%,calc(78svh*4/5))] md:max-w-none md:justify-self-end">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/about-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

// The contact page leaves out the "Let's Talk" row, since it links back to itself.
export function ContactFooter({ showCta = true }: { showCta?: boolean }) {
  return (
    <footer id="contact" className="bg-cream px-4 font-label text-black lg:px-14">
      {showCta ? (
        <a
          href="/contact"
          className="flex items-center justify-between border-y border-black/15 py-6 transition-opacity hover:opacity-60"
        >
          <h2 className="font-display text-4xl uppercase lg:text-5xl">Let&apos;s Talk</h2>
          <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M0 16h46M32 2l14 14-14 14" />
          </svg>
        </a>
      ) : (
        <div className="border-t border-black/15" />
      )}

      <div className="flex flex-col gap-10 py-12 text-xs uppercase tracking-[0.14em] md:flex-row md:justify-between lg:pb-24">
        {/* Fills the first column top to bottom, then the second. */}
        <ul className="grid grid-flow-col grid-rows-4 gap-x-12 gap-y-4 self-start">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="whitespace-nowrap transition-opacity hover:opacity-60">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          <h3>General enquiries</h3>
          <div className="flex flex-col items-start gap-3 normal-case leading-relaxed tracking-normal">
            <a href={`mailto:${contactDetails.email}`} className="hover:underline">
              {contactDetails.email}
            </a>
            <a href={`tel:${contactDetails.phoneHref}`} className="hover:underline">
              {contactDetails.phone}
            </a>
            <p>{contactDetails.addressLines.join(" ")}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3>Follow us</h3>
          <SocialLinks />
        </div>
      </div>

      {/* Bottom row: copyright on the left, logo on the right. */}
      <div className="flex items-center justify-between gap-6 border-t border-black/15 py-5">
        <p className="text-[0.65rem] uppercase tracking-[0.14em]">© 2026 Leonith Tiles. All rights reserved.</p>
        <Image
          src="/logos/leonith-logo-black.png"
          alt="Leonith"
          width={1600}
          height={566}
          className="h-auto w-24 shrink-0 lg:w-32"
        />
      </div>
    </footer>
  );
}
