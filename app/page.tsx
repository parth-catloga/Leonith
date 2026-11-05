import SiteNavbar from "./components/SiteNavbar";
import ScrollVideoHero from "./components/ScrollVideoHero";
import { ContactFooter, HomeIntro } from "./components/HomeSections";
import ExpertiseSection from "./components/ExpertiseSection";
import ProjectShowcase from "./components/ProjectShowcase";
import CollectionSection from "./components/CollectionSection";

export default function Home() {
  return (
    <>
      <SiteNavbar />
      <main id="top" className="bg-zinc-50 font-sans dark:bg-black">
        <ScrollVideoHero />
        <div id="home-content" data-after-hero className="font-label">
          <HomeIntro />
          <ExpertiseSection />
          <ProjectShowcase />
          <CollectionSection />
          <ContactFooter />
        </div>
      </main>
    </>
  );
}
