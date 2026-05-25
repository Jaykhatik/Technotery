import { useEffect, useRef } from "react";

/**
 * JK Logo Canvas
 * ─────────────────────────────────────────────────────────────────────────────
 * Layers (back → front):
 *  1. Deep radial glow behind the star
 *  2. Rotating outer ring with tick marks
 *  3. Rotating dashed orbit ring
 *  4. The star geometry (same structure as reference image)
 *  5. Electric arc sparks along the star edges
 *  6. Blue fire / energy particles emitting from every edge
 *  7. "JK" text with chromatic-aberration shimmer
 *  8. Lens-flare dot at the top spike
 */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  type: "fire" | "spark" | "glow";
}

type Pt = { x: number; y: number };

const lerp = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const JKLogo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 640, H = 640;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2, cy = H / 2 + 10;

    // ── Star geometry ─────────────────────────────────────────────────────────
    const T:  Pt = { x: cx,       y: cy - 270 };
    const TL: Pt = { x: cx - 215, y: cy - 35  };
    const TR: Pt = { x: cx + 215, y: cy - 35  };
    const BL: Pt = { x: cx - 235, y: cy + 265 };
    const BR: Pt = { x: cx + 235, y: cy + 265 };
    const IL: Pt = { x: cx - 105, y: cy - 35  };
    const IR: Pt = { x: cx + 105, y: cy - 35  };
    const IB: Pt = { x: cx,       y: cy + 135 };

    type Seg = [Pt, Pt];
    const segments: Seg[] = [
      [T, TL], [T, TR],
      [TL, TR],
      [TL, BL], [TR, BR],
      [IL, IR], [IL, IB], [IR, IB],
      [IB, BL], [IB, BR],
    ];

    // ── Particles ─────────────────────────────────────────────────────────────
    const particles: Particle[] = [];

    const spawnFire = () => {
      const seg = segments[Math.floor(Math.random() * segments.length)];
      const t = Math.random();
      const p = lerp(seg[0], seg[1], t);
      const maxLife = 40 + Math.random() * 50;
      particles.push({
        x: p.x, y: p.y,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 3 + 0.8),
        life: maxLife, maxLife,
        size: Math.random() * 6 + 2,
        type: "fire",
      });
    };

    const spawnSpark = () => {
      const seg = segments[Math.floor(Math.random() * segments.length)];
      const t = Math.random();
      const p = lerp(seg[0], seg[1], t);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      const maxLife = 15 + Math.random() * 20;
      particles.push({
        x: p.x, y: p.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife, maxLife,
        size: Math.random() * 2 + 0.5,
        type: "spark",
      });
    };

    const spawnGlow = () => {
      const seg = segments[Math.floor(Math.random() * segments.length)];
      const t = Math.random();
      const p = lerp(seg[0], seg[1], t);
      const maxLife = 60 + Math.random() * 40;
      particles.push({
        x: p.x, y: p.y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: maxLife, maxLife,
        size: Math.random() * 18 + 8,
        type: "glow",
      });
    };

    // ── Gradient factory ──────────────────────────────────────────────────────
    const starGrad = () => {
      const g = ctx.createLinearGradient(cx, T.y, cx, BR.y);
      g.addColorStop(0,    "#00f0ff");
      g.addColorStop(0.25, "#00aaff");
      g.addColorStop(0.55, "#0055ff");
      g.addColorStop(0.8,  "#0033cc");
      g.addColorStop(1,    "#001a99");
      return g;
    };

    // ── Draw deep background glow ─────────────────────────────────────────────
    const drawBgGlow = (pulse: number) => {
      const r = 260 + pulse * 30;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   `rgba(0,100,255,${0.12 + pulse * 0.06})`);
      g.addColorStop(0.5, `rgba(0,60,200,${0.06 + pulse * 0.03})`);
      g.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    };

    // ── Draw rotating outer ring ──────────────────────────────────────────────
    const drawRing = (tick: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tick * 0.004);

      // Outer dashed ring
      ctx.beginPath();
      ctx.arc(0, 0, 300, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,150,255,0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tick marks
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        const len = i % 3 === 0 ? 10 : 5;
        const r1 = 295, r2 = r1 - len;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.strokeStyle = i % 3 === 0 ? "rgba(0,200,255,0.35)" : "rgba(0,150,255,0.15)";
        ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      ctx.restore();

      // Inner counter-rotating ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-tick * 0.007);
      ctx.beginPath();
      ctx.arc(0, 0, 270, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,100,255,0.08)";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 18]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    };

    // ── Draw the star ─────────────────────────────────────────────────────────
    const drawStar = (pulse: number) => {
      ctx.save();
      ctx.lineCap  = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 4;
      ctx.shadowColor = `rgba(0,160,255,${0.8 + pulse * 0.2})`;
      ctx.shadowBlur  = 16 + pulse * 24;
      ctx.strokeStyle = starGrad();

      const paths: Pt[][] = [
        [T, TL, BL],
        [T, TR, BR],
        [TL, TR],
        [IL, IR, IB],
        [IB, BL],
        [IB, BR],
      ];

      paths.forEach((pts) => {
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
      });

      // Second pass — thinner bright core line
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6;
      ctx.strokeStyle = `rgba(180,240,255,${0.5 + pulse * 0.3})`;
      paths.forEach((pts) => {
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
      });

      ctx.restore();
    };

    // ── Draw "JK" with chromatic aberration ──────────────────────────────────
    const drawJK = (tick: number, pulse: number) => {
      const shimmer = Math.sin(tick * 0.06) * 2;
      const font = "bold 96px 'Segoe UI', 'Arial Black', sans-serif";
      const yPos = cy - 90;

      ctx.save();
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Chromatic aberration — red channel offset
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#ff3366";
      ctx.fillText("JK", cx - 2 + shimmer, yPos + 1);

      // Chromatic aberration — blue channel offset
      ctx.fillStyle = "#00ffff";
      ctx.fillText("JK", cx + 2 - shimmer, yPos - 1);

      ctx.globalAlpha = 1;

      // Main text glow
      ctx.shadowBlur  = 30 + pulse * 30;
      ctx.shadowColor = "rgba(0,180,255,1)";

      const tg = ctx.createLinearGradient(cx - 80, yPos - 50, cx + 80, yPos + 50);
      tg.addColorStop(0,   "#ffffff");
      tg.addColorStop(0.3, "#c0eeff");
      tg.addColorStop(0.7, "#60c0ff");
      tg.addColorStop(1,   "#0080ff");
      ctx.fillStyle = tg;
      ctx.fillText("JK", cx, yPos);

      // Subtle outline
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(0,200,255,0.3)";
      ctx.lineWidth = 0.5;
      ctx.strokeText("JK", cx, yPos);

      ctx.restore();
    };

    // ── Lens flare at top spike ───────────────────────────────────────────────
    const drawFlare = (pulse: number) => {
      ctx.save();
      const alpha = 0.5 + pulse * 0.5;

      // Main dot
      const g = ctx.createRadialGradient(T.x, T.y, 0, T.x, T.y, 18);
      g.addColorStop(0,   `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.3, `rgba(100,220,255,${alpha * 0.7})`);
      g.addColorStop(1,   "rgba(0,100,255,0)");
      ctx.beginPath();
      ctx.arc(T.x, T.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Cross streaks
      ctx.strokeStyle = `rgba(200,240,255,${alpha * 0.6})`;
      ctx.lineWidth = 0.8;
      [0, Math.PI / 2].forEach((angle) => {
        ctx.beginPath();
        ctx.moveTo(T.x + Math.cos(angle) * 25, T.y + Math.sin(angle) * 25);
        ctx.lineTo(T.x - Math.cos(angle) * 25, T.y - Math.sin(angle) * 25);
        ctx.stroke();
      });

      ctx.restore();
    };

    // ── Draw particles ────────────────────────────────────────────────────────
    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.life--;

        if (p.type === "fire") {
          p.vy -= 0.05;
          p.vx += (Math.random() - 0.5) * 0.2;
        } else if (p.type === "spark") {
          p.vx *= 0.94;
          p.vy *= 0.94;
        }

        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const ratio = p.life / p.maxLife;

        if (p.type === "fire") {
          // Blue fire: white → cyan → blue → transparent
          const r = Math.round(lerp({ x: 255, y: 0 }, { x: 0, y: 0 }, 1 - ratio).x);
          const g2 = Math.round(200 * ratio + 55);
          const b  = 255;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * ratio, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g2},${b},${ratio * 0.8})`;
          ctx.fill();
        } else if (p.type === "spark") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,240,255,${ratio * 0.9})`;
          ctx.fill();
        } else {
          // Glow blob
          const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * ratio);
          gr.addColorStop(0,   `rgba(0,150,255,${ratio * 0.15})`);
          gr.addColorStop(1,   "rgba(0,80,255,0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * ratio, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.fill();
        }
      }
    };

    // ── Main loop ─────────────────────────────────────────────────────────────
    let tick = 0;
    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      tick++;

      const pulse  = Math.sin(tick * 0.035) * 0.5 + 0.5;
      const pulse2 = Math.sin(tick * 0.06 + 1) * 0.5 + 0.5;

      // Spawn
      if (tick % 2 === 0) spawnFire();
      if (tick % 2 === 0) spawnFire();
      if (tick % 8 === 0) spawnSpark();
      if (tick % 12 === 0) spawnGlow();

      drawBgGlow(pulse);
      drawRing(tick);
      drawParticles();
      drawStar(pulse);
      drawJK(tick, pulse2);
      drawFlare(pulse2);

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", maxWidth: "640px", height: "auto", display: "block" }}
    />
  );
};

export default JKLogo;
