import { useEffect, useRef, useState } from "react";
import JKLogo from "./JKLogo";
import { portfolioData } from "../data/portfolio";

interface HomeSectionProps {
  onLatestWorks: () => void;
  onAboutMe: () => void;
}

/* ── Typewriter hook ─────────────────────────────────────────────────────── */
const useTypewriter = (words: string[], speed = 80, pause = 2000) => {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const cur = words[wi];
    let t: ReturnType<typeof setTimeout>;
    if (!del && ci <= cur.length) {
      t = setTimeout(() => { setDisplay(cur.slice(0, ci)); setCi(c => c + 1); }, speed);
    } else if (!del && ci > cur.length) {
      t = setTimeout(() => setDel(true), pause);
    } else if (del && ci >= 0) {
      t = setTimeout(() => { setDisplay(cur.slice(0, ci)); setCi(c => c - 1); }, speed / 2.5);
    } else {
      setDel(false);
      setWi(w => (w + 1) % words.length);
    }
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed, pause]);

  return display;
};

/* ── Particle field canvas (background layer) ────────────────────────────── */
const ParticleField = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Floating dots
    const dots = Array.from({ length: 80 }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      r:  Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    // Connection lines between nearby dots
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
      });

      // Lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(0,150,255,${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Dots
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,180,255,${d.alpha})`;
        ctx.fill();
      });

      id = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
};

/* ── Scan-line sweep effect ──────────────────────────────────────────────── */
const ScanLine = () => (
  <div className="scanline-wrap" aria-hidden="true">
    <div className="scanline" />
  </div>
);

/* ── Glitch text component ───────────────────────────────────────────────── */
const GlitchName = ({ name }: { name: string }) => (
  <h1 className="home-name glitch" data-text={name} aria-label={name}>
    {name}
  </h1>
);

/* ── Main HomeSection ────────────────────────────────────────────────────── */
const HomeSection = ({ onLatestWorks, onAboutMe }: HomeSectionProps) => {
  const typed = useTypewriter([
    portfolioData.title,
    "React Developer",
    "TypeScript Expert",
    "UI/UX Enthusiast",
    "Problem Solver",
    "Full Stack Engineer",
  ]);

  const [visible, setVisible] = useState(false);
  const [countUp, setCountUp] = useState({ exp: 0, proj: 0, clients: 0 });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Count-up animation for stats
  useEffect(() => {
    if (!visible) return;
    const targets = { exp: 3, proj: 20, clients: 15 };
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCountUp({
        exp:     Math.round(ease * targets.exp),
        proj:    Math.round(ease * targets.proj),
        clients: Math.round(ease * targets.clients),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible]);

  return (
    <section className="home-section" id="home">
      {/* Layer 0 — particle field */}
      <ParticleField />

      {/* Layer 1 — scan line sweep */}
      <ScanLine />

      {/* Layer 2 — grid + vignette */}
      <div className="home-grid-overlay" aria-hidden="true" />
      <div className="home-vignette"     aria-hidden="true" />

      {/* ── LEFT CONTENT ─────────────────────────────────────────────────── */}
      <div className={`home-content ${visible ? "home-content--in" : ""}`}>

        {/* Status badge */}
        <div className="home-badge">
          <span className="home-badge-dot" />
          <span>Available for work</span>
        </div>

        {/* Greeting */}
        <p className="home-greeting">Hello, I'm</p>

        {/* Glitch name */}
        <GlitchName name={portfolioData.fullName} />

        {/* Typewriter role */}
        <div className="home-role-wrap">
          <span className="home-role-bracket">&lt;</span>
          <span className="home-role-text">{typed}</span>
          <span className="home-role-cursor">_</span>
          <span className="home-role-bracket">/&gt;</span>
        </div>

        {/* Tagline */}
        <p className="home-tagline">{portfolioData.tagline}</p>

        {/* CTA */}
        <div className="home-cta">
          <button className="btn-about" onClick={onAboutMe}>
            About Me
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <a href={`mailto:${portfolioData.email}`} className="btn-hire">
            Hire Me
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div className="home-stats">
          <div className="home-stat">
            <span className="home-stat-num">{countUp.exp}+</span>
            <span className="home-stat-label">Years Exp.</span>
          </div>
          <div className="home-stat-sep" />
          <div className="home-stat">
            <span className="home-stat-num">{countUp.proj}+</span>
            <span className="home-stat-label">Projects</span>
          </div>
          <div className="home-stat-sep" />
          <div className="home-stat">
            <span className="home-stat-num">{countUp.clients}+</span>
            <span className="home-stat-label">Clients</span>
          </div>
        </div>

        {/* Tech pills */}
        <div className="home-tech-pills">
          {["React", "TypeScript", "Node.js", "Next.js"].map((t) => (
            <span key={t} className="home-tech-pill">{t}</span>
          ))}
        </div>
      </div>

      {/* ── CENTER LOGO ──────────────────────────────────────────────────── */}
      <div className="home-logo-wrap">
        <div className="home-logo-halo halo-1" />
        <div className="home-logo-halo halo-2" />
        <div className="home-logo-halo halo-3" />
        <JKLogo />
      </div>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <div className="latest-works-wrap">
        <button className="btn-latest-works" onClick={onLatestWorks}>
          Latest Works
        </button>
        <div className="scroll-arrow">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
