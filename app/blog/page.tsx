import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/ui/cta-button";
import SiteNavbar from "../components/SiteNavbar";
import ScrollMotion from "../components/ScrollMotion";
import Breadcrumbs from "../components/Breadcrumbs";
import { ContactFooter } from "../components/HomeSections";
import { blogHref, blogPosts, formatPostDate, type BlogPost } from "../components/blogPosts";

export const metadata: Metadata = {
  title: "Blog | Leonith",
  description: "Guides, design ideas, care tips and projects from Leonith, the large-format porcelain slab specialists.",
};

// Category · date · read time, shown above every post title.
function PostMeta({ post }: { post: BlogPost }) {
  return (
    <p className="text-xs uppercase tracking-[0.14em] text-black/50">
      <span className="text-[#E20114]">{post.category}</span>
      <span aria-hidden="true"> · </span>
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      <span aria-hidden="true"> · </span>
      {post.readMinutes} min read
    </p>
  );
}

// Same header as the applications and contact pages, then every post in a grid.
export default function BlogPage() {
  return (
    <>
      <SiteNavbar />
      <main className="bg-cream font-label text-black">
        <ScrollMotion className="px-4 pb-24 pt-32 lg:px-14 lg:pb-40 lg:pt-40">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
          <h1 className="font-display text-[2.5rem] uppercase leading-[0.9] tracking-[-0.02em] lg:text-[4rem]">Blog</h1>

          {/* All posts, newest first, three to a row on desktop. */}
          <section aria-labelledby="latest-heading" className="mt-14 border-t border-black/15 pt-8">
            <h2 id="latest-heading" className="mb-10 text-xs uppercase tracking-[0.14em] text-black/50 lg:mb-14">
              Latest articles
            </h2>
            <ul className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
              {blogPosts.map((post) => (
                <li key={post.slug} data-fade className="flex">
                  {/* Rounded card with the photo inset in its own rounded frame. The title's link
                      stretches over the whole card, and hovering anywhere on it lifts the card, zooms
                      the photo and plays the button's fill animation (the button reacts to `group`). */}
                  <article className="group relative flex w-full flex-col rounded-xl border border-black/10 bg-cream p-2 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={post.image}
                        alt={post.alt}
                        fill
                        sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col items-start gap-4 px-3 pb-3 pt-5">
                      <PostMeta post={post} />
                      <h3 className="font-display text-[1.6rem] uppercase leading-[1.05] tracking-[-0.02em]">
                        <Link href={blogHref(post.slug)} className="after:absolute after:inset-0 after:rounded-xl">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm leading-[1.7] tracking-[-0.03em] text-black/70">{post.excerpt}</p>
                      <CtaButton href={blogHref(post.slug)} className="z-10 mt-auto">
                        Read article
                      </CtaButton>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </ScrollMotion>
      </main>
      <ContactFooter />
    </>
  );
}
