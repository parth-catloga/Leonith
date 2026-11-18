import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CtaButton from "@/components/ui/cta-button";
import SiteNavbar from "../../components/SiteNavbar";
import ScrollMotion from "../../components/ScrollMotion";
import Breadcrumbs from "../../components/Breadcrumbs";
import { ContactFooter } from "../../components/HomeSections";
import { blogHref, blogPosts, findPost, formatPostDate } from "../../components/blogPosts";

// Renders **phrase** as bold black text inside a muted paragraph.
function Emphasis({ text }: { text: string }) {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-black">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

// Each post is prerendered; any other slug hits notFound() below.
export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = findPost((await params).slug);
  return post ? { title: `${post.title} | Leonith`, description: post.excerpt } : {};
}

type Params = PageProps<"/blog/[slug]">["params"];

// Same pattern as the application pages: navbar and footer render at once, the post waits on params.
export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <>
      <SiteNavbar />
      <Suspense fallback={<main className="min-h-svh bg-cream" />}>
        <PostContent params={params} />
      </Suspense>
      <ContactFooter />
    </>
  );
}

async function PostContent({ params }: { params: Params }) {
  const post = findPost((await params).slug);
  if (!post) notFound();

  const more = blogPosts.filter(({ slug }) => slug !== post.slug).slice(0, 3);

  return (
    <main className="bg-cream font-label text-black">
      <ScrollMotion className="px-4 pb-24 pt-32 lg:px-14 lg:pb-40 lg:pt-40">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.category }]} />
        <h1 className="max-w-5xl font-display text-[2.25rem] uppercase leading-[0.95] tracking-[-0.02em] lg:text-[4rem]">
          {post.title}
        </h1>
        <p className="mt-6 text-xs uppercase tracking-[0.14em] text-black/50">
          <span className="text-[#E20114]">{post.category}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {post.readMinutes} min read
        </p>

        {/* Lead photo; the image drifts inside its frame (see ScrollMotion). */}
        <div data-fade className="mt-14 border-t border-black/15 pt-8">
          <div className="relative aspect-[16/9] overflow-hidden">
            <div data-parallax className="absolute inset-x-0 -inset-y-[8%]">
              <Image src={post.image} alt={post.alt} fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>
        </div>

        {/* Article body in a readable column. */}
        <article className="mx-auto mt-16 flex max-w-2xl flex-col gap-6 lg:mt-24">
          <p className="font-display text-[clamp(1.4rem,2vw,1.9rem)] leading-[1.25] tracking-[-0.01em]">{post.excerpt}</p>
          {post.body.map((block) =>
            block.startsWith("## ") ? (
              <h2
                key={block}
                className="mt-6 font-display text-[clamp(1.5rem,2.2vw,2rem)] uppercase leading-[1.05] tracking-[-0.02em]"
              >
                {block.slice(3)}
              </h2>
            ) : (
              <p key={block} className="text-sm leading-[1.8] tracking-[-0.03em] text-black/70 lg:text-base">
                <Emphasis text={block} />
              </p>
            ),
          )}
          <div className="mt-6">
            <CtaButton href="/contact">Talk to us</CtaButton>
          </div>
        </article>

        {/* Three more posts to keep reading. */}
        <section aria-labelledby="more-heading" className="mt-24 border-t border-black/15 pt-8 lg:mt-40">
          <h2 id="more-heading" className="mb-10 text-xs uppercase tracking-[0.14em] text-black/50 lg:mb-14">
            More from the blog
          </h2>
          <ul className="grid gap-x-4 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((other) => (
              <li key={other.slug} data-fade>
                <Link href={blogHref(other.slug)} className="group flex flex-col gap-5">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={other.image}
                      alt={other.alt}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#E20114]">{other.category}</p>
                  <h3 className="font-display text-[1.6rem] uppercase leading-[1.05] tracking-[-0.02em] transition-colors group-hover:text-[#E20114]">
                    {other.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </ScrollMotion>
    </main>
  );
}
