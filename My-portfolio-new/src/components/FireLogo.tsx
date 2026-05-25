import { useEffect, useRef } from "react";

/**
 * JK Logo — replicates the exact star geometry from the reference image:
 *
 *  • A large upward triangle  (top spike)
 *  • A horizontal crossbar    (mid-section)
 *  • Two diagonal legs        (bottom-left & bottom-right spikes)
 *  • An inner inverted triangle connecting the crossbar to the bottom
 *  • All stroked with a cyan→blue gradient, no fill
 *  • Subtle blue glow that pulses
 *  • "JK" text centred inside the star
 *
 * The shape is drawn with canvas lineTo so every segment is available
 * for fire-particle emission along the edges.
 */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}

const FireLogo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 580;
    const H = 600;
    canvas.width  = W;
    canvas.height = H;

    // ── Key anchor points (matching the reference image geometry) ────────────
    //
    //           T  (top spike)
    //          / \
    //         /   \
    //        /  ↑  \
    //      TL──────TR   ← crossbar (horizontal line)
    //      |\ inner /|
    //      | \  ▽  / |
    //      |  IC──IC  |
    //      |  /    \  |
    //     BL         BR  (bottom-left / bottom-right spikes)
    //
    // All coordinates are relative to canvas centre.

    const cx = W / 2;
    const cy = H / 2 + 10;

    // Outer star points
    const T  = { x: cx,        y: cy - 260 }; // top spike
    const TL = { x: cx - 210,  y: cy - 30  }; // crossbar left
    const TR = { x: cx + 210,  y: cy - 30  }; // crossbar right
    const BL = { x: cx - 230,  y: cy + 260 }; // bottom-left spike
    const BR = { x: cx + 230,  y: cy + 260 }; // bottom-right spike

    // Inner triangle vertices (the inverted triangle inside the star)
    const IL = { x: cx - 100,  y: cy - 30  }; // inner-left  (on crossbar)
    const IR = { x: cx + 100,  y: cy - 30  }; // inner-right (on crossbar)
    const IB = { x: cx,        y: cy + 130 }; // inner-bottom

    // ── All line segments (for particle emission + drawing) ──────────────────
    type Seg = [{ x: number; y: number }, { x: number; y: number }];
    const segments: Seg[] = [
      // Outer large triangle (top spike)
      [T,  TL],
      [T,  TR],
      // Crossbar
      [TL, TR],
      // Left leg to bottom-left spike
      [TL, BL],
      // Right leg to bottom-right spike
      [TR, BR],
      // Inner inverted triangle
      [IL, IR],
      [IL, IB],
      [IR, IB],
      // Bottom cross lines (connecting inner bottom to outer bottom spikes)
      [IB, BL],
      [IB, BR],
    ];

    // ── Particles ─────────────────────────────────────────────────────────────
    const particles: Particle[] = [];

    const spawnParticle = () => {
      const seg = segments[Math.floor(Math.random() * segments.length)];
      const t   = Math.random();
      const x   = seg[0].x + t * (seg[1].x - seg[0].x);
      const y   = seg[0].y + t * (seg[1].y - seg[0].y);
      const maxLife = 30 + Math.random() * 40;
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -(Math.random() * 2.2 + 0.5),
        life: maxLife, maxLife,
        size: Math.random() * 5 + 1.5,
      });
    };

    // ── Gradient helper (top-to-bottom, cyan → deep blue) ────────────────────
    const makeGrad = (y0: number, y1: number) => {
      const g = ctx.createLinearGradient(cx, y0, cx, y1);
      g.addColorStop(0,    "#00e8ff"); // bright cyan at top
      g.addColorStop(0.35, "#0099ff");
      g.addColorStop(0.65, "#0055ee");
      g.addColorStop(1,    "#0033bb"); // deep blue at bottom
      return g;
    };

    // ── Draw the star ─────────────────────────────────────────────────────────
    const drawStar = (glow: number) => {
      ctx.save();
      ctx.lineCap  = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 4.5;

      const shadowAlpha = 0.7 + glow * 0.3;
      ctx.shadowColor = `rgba(0,160,255,${shadowAlpha})`;
      ctx.shadowBlur  = 14 + glow * 18;

      const grad = makeGrad(T.y, BR.y);
      ctx.strokeStyle = grad;

      // ── Outer left side: T → TL → BL ──────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(T.x,  T.y);
      ctx.lineTo(TL.x, TL.y);
      ctx.lineTo(BL.x, BL.y);
      ctx.stroke();

      // ── Outer right side: T → TR → BR ─────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(T.x,  T.y);
      ctx.lineTo(TR.x, TR.y);
      ctx.lineTo(BR.x, BR.y);
      ctx.stroke();

      // ── Crossbar TL → TR ──────────────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(TL.x, TL.y);
      ctx.lineTo(TR.x, TR.y);
      ctx.stroke();

      // ── Inner inverted triangle ────────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(IL.x, IL.y);
      ctx.lineTo(IR.x, IR.y);
      ctx.lineTo(IB.x, IB.y);
      ctx.closePath();
      ctx.stroke();

      // ── Inner bottom → outer bottom spikes ────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(IB.x, IB.y);
      ctx.lineTo(BL.x, BL.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(IB.x, IB.y);
      ctx.lineTo(BR.x, BR.y);
      ctx.stroke();

      ctx.restore();
    };

    // ── Draw "JK" text centred inside the star ────────────────────────────────
    const drawJK = (glow: number) => {
      ctx.save();
      ctx.font          = "bold 88px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign     = "center";
      ctx.textBaseline  = "middle";
      ctx.shadowBlur    = 20 + glow * 20;
      ctx.shadowColor   = "rgba(0,180,255,0.95)";

      const tg = ctx.createLinearGradient(cx - 70, cy - 40, cx + 70, cy + 40);
      tg.addColorStop(0,   "#ffffff");
      tg.addColorStop(0.4, "#a0e8ff");
      tg.addColorStop(1,   "#0088ff");
      ctx.fillStyle = tg;

      // Position text in the upper-centre of the star (above inner triangle)
      ctx.fillText("JK", cx, cy - 80);
      ctx.restore();
    };

    // ── Animation loop ────────────────────────────────────────────────────────
    let tick = 0;
    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      tick++;
      const glow = Math.sin(tick * 0.035) * 0.5 + 0.5;

      // Spawn particles along the star edges
      for (let i = 0; i < 4; i++) spawnParticle();

      // Update & draw fire particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy -= 0.04;
        p.vx += (Math.random() - 0.5) * 0.18;
        p.life--;

        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const ratio = p.life / p.maxLife;
        const alpha = ratio * 0.75;
        const size  = p.size * ratio;

        // Fire colour: white → yellow → orange → red based on life
        let r = 255, g = 255, b = 255;
        if (ratio < 0.8) { g = Math.round(200 * ratio + 55); b = Math.round(100 * ratio); }
        if (ratio < 0.5) { g = Math.round(140 * ratio);      b = 0; }
        if (ratio < 0.25){ r = 255; g = Math.round(80 * ratio * 4); b = 0; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      drawStar(glow);
      drawJK(glow);

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        maxWidth: "580px",
        height: "auto",
        display: "block",
      }}
    />
  );
};

export default FireLogo;
