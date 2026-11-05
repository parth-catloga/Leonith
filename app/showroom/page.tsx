import type { Metadata } from "next";
import SiteNavbar from "../components/SiteNavbar";
import Showroom from "../components/showroom/Showroom";

export const metadata: Metadata = {
  title: "Virtual showroom | Leonith",
  description: "Walk the Leonith showroom online: all seven slab sizes on their own displays, built to true scale, with every tile in the collection.",
};

export default function ShowroomPage() {
  return (
    <>
      <SiteNavbar />
      <main className="bg-cream font-label text-black">
        <Showroom />
      </main>
    </>
  );
}
