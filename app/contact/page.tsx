import type { Metadata } from "next";
import SiteNavbar from "../components/SiteNavbar";
import ContactForm from "../components/ContactForm";
import SocialLinks from "../components/SocialLinks";
import { ContactFooter } from "../components/HomeSections";
import { contactDetails } from "../components/contactDetails";

export const metadata: Metadata = {
  title: "Contact | Leonith",
  description: "Get in touch with Leonith about slabs, samples and trade enquiries.",
};

type Line = { text: string; href?: string };

const contactBlocks: { title: string; paragraphs: Line[][] }[] = [
  {
    title: "General Enquiries",
    paragraphs: [
      [
        { text: contactDetails.email, href: `mailto:${contactDetails.email}` },
        { text: `Phone: ${contactDetails.phone}`, href: `tel:${contactDetails.phoneHref}` },
      ],
      [{ text: "Leonith Tiles" }, ...contactDetails.addressLines.map((text) => ({ text }))],
    ],
  },
];

export default function ContactPage() {
  return (
    <>
      <SiteNavbar />
      <main className="bg-cream font-label text-black">
        <div className="px-4 pb-24 pt-32 lg:px-14 lg:pb-32 lg:pt-40">
          <h1 className="font-display text-[2.5rem] uppercase leading-[0.9] tracking-[-0.02em] lg:text-[4rem]">
            Contact
          </h1>

          {/* One divider runs across both columns. */}
          <div className="mt-14 grid gap-12 border-t border-black/15 pt-8 lg:grid-cols-[3fr_4fr] lg:gap-8">
            {contactBlocks.map((block) => (
              <section key={block.title}>
                <h2 className="font-display text-2xl uppercase leading-[1.2] tracking-[-0.02em]">
                  {block.title}
                </h2>
                <div className="mt-8 flex flex-col gap-8 text-sm leading-[1.4] tracking-[-0.03em]">
                  {block.paragraphs.map((lines) => (
                    <p key={lines[0].text}>
                      {lines.map((line, index) => (
                        <span key={line.text}>
                          {index > 0 && <br />}
                          {line.href ? (
                            <a href={line.href} className="hover:underline">
                              {line.text}
                            </a>
                          ) : (
                            line.text
                          )}
                        </span>
                      ))}
                    </p>
                  ))}
                  <SocialLinks />
                </div>
              </section>
            ))}

            {/* Stacked on phones, so it keeps its own divider there. */}
            <section
              aria-labelledby="enquiry-heading"
              className="border-t border-black/15 pt-8 lg:border-0 lg:pt-0"
            >
              <h2
                id="enquiry-heading"
                className="font-display text-2xl uppercase leading-[1.2] tracking-[-0.02em]"
              >
                Send an Enquiry
              </h2>
              <div className="mt-10">
                <ContactForm />
              </div>
            </section>
          </div>
        </div>
      </main>
      <ContactFooter showCta={false} />
    </>
  );
}
