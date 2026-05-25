import { useRef, useEffect, useState } from "react";
import { portfolioData } from "../data/portfolio";

// Laptop mockup SVG wrapper
const LaptopMockup = ({ color, num }: { color: string; num: number }) => (
  <div className="laptop-wrap">
    <svg
      viewBox="0 0 800 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="laptop-svg"
    >
      {/* Screen body */}
      <rect x="60" y="20" width="680" height="420" rx="18" fill="#1a1f2e" stroke="#2a3040" strokeWidth="3" />
      {/* Screen bezel inner */}
      <rect x="80" y="38" width="640" height="384" rx="8" fill="#0d1117" />
      {/* Screen content placeholder */}
      <rect x="80" y="38" width="640" height="384" rx="8" fill={`url(#screenGrad${num})`} />
      {/* Fake browser bar */}
      <rect x="80" y="38" width="640" height="32" rx="8" fill="rgba(255,255,255,0.04)" />
      <circle cx="104" cy="54" r="5" fill="#ff5f57" />
      <circle cx="122" cy="54" r="5" fill="#febc2e" />
      <circle cx="140" cy="54" r="5" fill="#28c840" />
      <rect x="200" y="46" width="300" height="16" rx="8" fill="rgba(255,255,255,0.06)" />
      {/* Fake content lines */}
      <rect x="100" y="90" width="200" height="12" rx="4" fill="rgba(255,255,255,0.08)" />
      <rect x="100" y="112" width="320" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
      <rect x="100" y="128" width="280" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
      <rect x="100" y="160" width="560" height="120" rx="8" fill={`rgba(${color},0.12)`} />
      <rect x="100" y="300" width="140" height="36" rx="8" fill={`rgba(${color},0.25)`} />
      {/* Keyboard base */}
      <rect x="20" y="440" width="760" height="28" rx="6" fill="#1a1f2e" stroke="#2a3040" strokeWidth="2" />
      <rect x="280" y="444" width="240" height="18" rx="4" fill="#141820" />
      {/* Bottom stand */}
      <path d="M20 468 L0 490 L800 490 L780 468 Z" fill="#141820" stroke="#2a3040" strokeWidth="1.5" />
      <defs>
        <linearGradient id={`screenGrad${num}`} x1="80" y1="38" x2="720" y2="422" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={`rgba(${color},0.15)`} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Intersection observer hook for scroll-in animation
const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

// Color palette per project
const projectColors = [
  "255,140,0",
  "0,191,255",
  "160,80,255",
  "0,220,130",
  "255,80,120",
  "255,200,0",
];

const ProjectRow = ({
  project,
  index,
}: {
  project: (typeof portfolioData.projects)[0];
  index: number;
}) => {
  const { ref, inView } = useInView(0.15);
  const isEven = index % 2 === 0;
  const color = projectColors[index % projectColors.length];

  return (
    <div
      ref={ref}
      className={`project-row ${isEven ? "project-row--left" : "project-row--right"} ${inView ? "project-row--visible" : ""}`}
    >
      {/* Timeline dot */}
      <div className="project-timeline">
        <div className="project-timeline-dot" style={{ background: `rgb(${color})`, boxShadow: `0 0 16px rgba(${color},0.7)` }} />
        <div className="project-timeline-line" />
      </div>

      {/* Laptop mockup */}
      <div className="project-visual">
        <LaptopMockup color={color} num={index} />
      </div>

      {/* Text content */}
      <div className="project-info">
        {project.featured && (
          <span className="project-featured-tag">⭐ Featured Project</span>
        )}
        <h3 className="project-name" style={{ color: `rgb(${color})` }}>
          {project.title}
        </h3>
        <p className="project-category">({project.tech[0]} Project)</p>
        <p className="project-description">{project.description}</p>

        <div className="project-tags">
          {project.tech.map((t) => (
            <span key={t} className="project-tag">#{t.toLowerCase().replace(/\s/g, "")}</span>
          ))}
        </div>

        <div className="project-actions">
          <a
            href={project.link}
            className="project-action-btn"
            target="_blank"
            rel="noopener noreferrer"
            style={{ borderColor: `rgba(${color},0.5)`, color: `rgb(${color})` }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Live Demo
          </a>
          <a
            href={project.github}
            className="project-action-btn project-action-btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  return (
    <section className="section projects-section" id="projects">
      <div className="section-header">
        <span className="section-tag">My Work</span>
        <h2 className="section-title">Latest Works</h2>
        <p className="section-subtitle">
          A selection of projects I've built — from concept to deployment.
        </p>
      </div>

      {/* Central timeline + alternating rows */}
      <div className="projects-timeline">
        {portfolioData.projects.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
