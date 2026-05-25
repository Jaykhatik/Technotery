import { useState, useEffect, useRef, useCallback } from "react";
import { portfolioData } from "../data/portfolio";

type Service = (typeof portfolioData.services)[0] & { tags?: string[] };

/* ─────────────────────────────────────────────────────────────────────────────
   Card deck layout:
   • index 0  → front card  (center, full color, raised)
   • index 1  → back-left   (rotated -18°, shifted left, lighter color)
   • index 2  → back-right  (rotated +18°, shifted right, lighter color)
   • index 3+ → hidden (waiting in queue)
   Deck cycles every 2.4 s: front → back of queue, next card becomes front.
───────────────────────────────────────────────────────────────────────────── */

/** Hex → {r,g,b} */
const hexRgb = (hex: string) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

/* ── Floating particle canvas (front card only) ─────────────────────────── */
const CardParticles = ({ color }: { color: string }) => {
  const ref    = useRef<HTMLCanvasElement>(null);
  const animId = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = (canvas.width  = canvas.offsetWidth  || 320);
    const H = (canvas.height = canvas.offsetHeight || 420);
    const { r, g, b } = hexRgb(color);

    const dots = Array.from({ length: 30 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      size: Math.random() * 2.2 + 0.4,
      a: Math.random() * 0.55 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${d.a})`;
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / 90) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId.current);
  }, [color]);

  return (
    <canvas ref={ref} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, borderRadius: "inherit",
    }} />
  );
};

/* ── Single card in the deck ────────────────────────────────────────────── */
type DeckPos = "front" | "back-left" | "back-right" | "hidden";

const DeckCard = ({
  service,
  pos,
  onClick,
}: {
  service: Service;
  pos: DeckPos;
  onClick: () => void;
}) => {
  const { r, g, b } = hexRgb(service.color);
  const isFront = pos === "front";

  return (
    <div
      className={`deck-card deck-card--${pos}`}
      style={{
        "--dc-r": r, "--dc-g": g, "--dc-b": b,
        "--dc-color": service.color,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {/* Particle layer — front only */}
      {isFront && <CardParticles color={service.color} />}

      {/* Scan sweep — front only */}
      {isFront && <div className="deck-scan" />}

      {/* Top shimmer bar */}
      <div className="deck-bar" />

      {/* Corner glow */}
      <div className="deck-corner-glow" />

      {/* ── Card content ── */}
      <div className="deck-content">
        {/* Icon circle */}
        <div className="deck-icon-circle">
          <div className="deck-icon-ring" />
          <div className="deck-icon-ring deck-icon-ring--2" />
          <span className="deck-icon">{service.icon}</span>
        </div>

        {/* Title */}
        <h3 className="deck-title">{service.title}</h3>

        {/* Description — front only */}
        {isFront && (
          <p className="deck-desc">{service.description}</p>
        )}

        {/* Tags */}
        {isFront && service.tags && (
          <div className="deck-tags">
            {service.tags.map(t => (
              <span key={t} className="deck-tag">{t}</span>
            ))}
          </div>
        )}

        {/* "Click to cycle" hint on front */}
        {isFront && (
          <div className="deck-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            Click to cycle
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main ServicesSection ───────────────────────────────────────────────── */
const ServicesSection = () => {
  const services = portfolioData.services as Service[];
  const [queue, setQueue]   = useState<Service[]>(services);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rotate: move front card to back of queue
  const cycle = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setQueue(q => [...q.slice(1), q[0]]);
      setAnimating(false);
    }, 380);
  }, [animating]);

  const startAuto = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(cycle, 2600);
  }, [cycle]);

  const stopAuto = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  const handlePause = () => {
    setPaused(true);
    stopAuto();
  };

  const handleResume = () => {
    setPaused(false);
    startAuto();
  };

  const handleClick = () => {
    cycle();
  };

  // Assign deck positions
  const getPos = (idx: number): DeckPos => {
    if (idx === 0) return "front";
    if (idx === 1) return "back-left";
    if (idx === 2) return "back-right";
    return "hidden";
  };

  return (
    <section className="section services-section" id="services">
      {/* Header */}
      <div className="section-header">
        <span className="section-tag">What I Offer</span>
        <h2 className="section-title">My Services</h2>
        <p className="section-subtitle">
          Cards cycle automatically — hover to pause, click to cycle manually.
        </p>
      </div>

      {/* Status */}
      <div className="svc-status">
        <span className={`svc-status-dot ${paused ? "svc-status-dot--paused" : ""}`} />
        <span className="svc-status-label">{paused ? "Paused" : "Auto-cycling"}</span>
      </div>

      {/* Deck stage */}
      <div
        className={`deck-stage ${animating ? "deck-stage--animating" : ""}`}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        {/* Render back cards first (z-order), then front on top */}
        {[2, 1, 0].map(idx => {
          const service = queue[idx];
          if (!service) return null;
          return (
            <DeckCard
              key={service.title}
              service={service}
              pos={getPos(idx)}
              onClick={idx === 0 ? handleClick : () => {}}
            />
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="deck-dots">
        {services.map((s) => (
          <div
            key={s.title}
            className={`deck-dot ${queue[0]?.title === s.title ? "deck-dot--active" : ""}`}
            style={{ "--dc-color": s.color } as React.CSSProperties}
          />
        ))}
      </div>

      {/* All services list below */}
      <div className="svc-list">
        {services.map((s) => (
          <div
            key={s.title}
            className={`svc-list-item ${queue[0]?.title === s.title ? "svc-list-item--active" : ""}`}
            style={{ "--dc-color": s.color } as React.CSSProperties}
            onClick={() => {
              const idx = queue.findIndex(q => q.title === s.title);
              if (idx > 0) {
                setQueue(q => {
                  const newQ = [...q];
                  const [item] = newQ.splice(idx, 1);
                  return [item, ...newQ];
                });
              }
            }}
          >
            <span className="svc-list-icon">{s.icon}</span>
            <span className="svc-list-title">{s.title}</span>
            <div className="svc-list-bar" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
