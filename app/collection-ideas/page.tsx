import type { Metadata } from "next";
import SiteNavbar from "../components/SiteNavbar";
import CollectionIdeas from "../components/collection-ideas/CollectionIdeas";

export const metadata: Metadata = {
  title: "Collection ideas | Leonith",
  description: "Working prototypes of nine layouts for the Leonith collection page.",
  robots: { index: false },
};

export default function CollectionIdeasPage() {
  return (
    <>
      <SiteNavbar />
      <main className="min-h-svh bg-cream font-label text-black">
        <CollectionIdeas />
      </main>
    </>
  );
}
