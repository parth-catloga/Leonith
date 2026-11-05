import Image from "next/image";
import { contactDetails } from "./contactDetails";
import IntroReveal from "./IntroReveal";
import SocialLinks from "./SocialLinks";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/showroom", label: "Digital Collection" },
  { href: "/contact", label: "Contact" },
];

export function HomeIntro() {
  return (
    <section id="about" aria-label="About us" className="bg-cream px-4 text-black lg:px-14">
      <div className="flex min-h-svh flex-col items-center justify-center gap-10 py-20 text-center">
        <IntroReveal />
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
        <ul className="flex flex-col gap-4">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-opacity hover:opacity-60">
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
        <Image
          src="/logos/leonith-logo-black.png"
          alt="Leonith"
          width={1600}
          height={566}
          className="h-auto w-32 self-start"
        />
      </div>

      <p className="border-t border-black/15 py-5 text-[0.65rem] uppercase tracking-[0.14em]">
        © 2026 Leonith Tiles. All rights reserved.
      </p>
    </footer>
  );
}
