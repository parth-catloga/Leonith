import Link from "next/link";

type Crumb = { label: string; href?: string };

// Trail shown above a page title, e.g. Home / Applications / Kitchens.
// The last crumb is the current page and isn't a link.
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 lg:mb-8">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-3">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-black/50 transition-colors hover:text-black">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-black">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-black/30">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
