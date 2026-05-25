import { useState, useEffect, useRef } from "react";
import HexBackground from "./components/HexBackground";
import Navbar from "./components/Navbar";
import SocialSidebar from "./components/SocialSidebar";
import HomeSection from "./components/HomeSection";
import AboutModal from "./components/AboutModal";
import ProjectsSection from "./components/ProjectsSection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import "./index.css";

type Section = "home" | "about" | "projects" | "services" | "contact";

function App() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Lock / unlock scroll on body (only when about modal is NOT open)
  useEffect(() => {
    if (aboutOpen) return; // modal manages its own lock
    if (!scrollUnlocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [scrollUnlocked, aboutOpen]);

  // Track active section on scroll
  useEffect(() => {
    if (!scrollUnlocked) return;
    const handleScroll = () => {
      const sections: Section[] = ["home", "about", "projects", "services", "contact"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            setActiveSection(id as Section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollUnlocked]);

  const handleLatestWorks = () => {
    setScrollUnlocked(true);
    setActiveSection("projects");
    setTimeout(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // About Me → open modal instead of scrolling
  const handleAboutMe = () => {
    setAboutOpen(true);
  };

  const handleNavigate = (section: string) => {
    if (section === "about") {
      setAboutOpen(true);
      return;
    }
    if (section !== "home") setScrollUnlocked(true);
    setActiveSection(section as Section);
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="app" ref={mainRef}>
      <HexBackground />
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <SocialSidebar />

      <main className="main-content">
        <HomeSection onLatestWorks={handleLatestWorks} onAboutMe={handleAboutMe} />
        {/* About is now a modal — keep a hidden anchor for nav */}
        <div id="about" style={{ position: "absolute", visibility: "hidden" }} />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
      </main>

      <footer className="footer">
        <p>
          Designed & Built by <span className="footer-name">JK</span> · {new Date().getFullYear()}
        </p>
      </footer>

      {/* About modal */}
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}

export default App;
