import { useEffect, useRef } from "react";

interface Hexagon {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  angle: number;
}

const HexBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const hexagons: Hexagon[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create hexagons
    for (let i = 0; i < 55; i++) {
      hexagons.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 50 + 20,
        opacity: Math.random() * 0.18 + 0.04,
        speed: Math.random() * 0.3 + 0.05,
        drift: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI * 2,
      });
    }

    const drawHex = (
      x: number,
      y: number,
      size: number,
      opacity: number,
      filled: boolean
    ) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      if (filled) {
        ctx.fillStyle = `rgba(30, 40, 50, ${opacity})`;
        ctx.fill();
      }
      ctx.strokeStyle = `rgba(60, 80, 100, ${opacity * 1.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      hexagons.forEach((hex) => {
        hex.y -= hex.speed;
        hex.x += hex.drift;
        hex.angle += 0.002;

        if (hex.y + hex.size < 0) {
          hex.y = canvas.height + hex.size;
          hex.x = Math.random() * canvas.width;
        }
        if (hex.x > canvas.width + hex.size) hex.x = -hex.size;
        if (hex.x < -hex.size) hex.x = canvas.width + hex.size;

        drawHex(hex.x, hex.y, hex.size, hex.opacity, Math.random() > 0.5);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default HexBackground;
