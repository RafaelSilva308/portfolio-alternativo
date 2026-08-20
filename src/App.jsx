import { useCallback, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import FeatureSections from "./components/FeatureSections";
import ProjectsCarousel from "./components/ProjectsCarousel";
import About from "./components/About";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Cockpit from "./three/Cockpit";

export default function App() {
  const [cockpitOpen, setCockpitOpen] = useState(false);

  const openCockpit = useCallback(() => setCockpitOpen(true), []);
  const closeCockpit = useCallback(() => setCockpitOpen(false), []);

  return (
    <>
      <Header onPlay={openCockpit} />
      <main>
        <Hero active={!cockpitOpen} />
        <Marquee />
        <FeatureSections />
        <ProjectsCarousel />
        <About />
        <CTA onPlay={openCockpit} />
      </main>
      <Footer />
      {cockpitOpen && <Cockpit onClose={closeCockpit} />}
    </>
  );
}
