import { useEffect, useRef } from "react";

type AtmosphereProps = { variant: "stars" | "particles"; className?: string };

export function Atmosphere({ variant, className = "" }: AtmosphereProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0,
      width = 0,
      height = 0,
      mouseX = 0,
      mouseY = 0,
      lastShootingStar = 0,
      dots: { x: number; y: number; r: number; a: number; v: number }[] = [];
    const resize = () => {
      const rect = el.getBoundingClientRect(),
        dpr = Math.min(devicePixelRatio, 1.5);
      width = rect.width;
      height = rect.height;
      el.width = width * dpr;
      el.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(
        480,
        Math.max(
          70,
          Math.floor((width * height) / (innerWidth < 700 ? 7000 : 3500)),
        ),
      );
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * (variant === "stars" ? 1.4 : 2.2) + 0.25,
        a: Math.random() * 0.7 + 0.12,
        v: Math.random() * 0.012 + 0.003,
      }));
    };
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    };
    const draw = (t: number) => {
      context.clearRect(0, 0, width, height);
      dots.forEach((dot, i) => {
        context.beginPath();
        context.fillStyle =
          variant === "stars"
            ? `rgba(230,238,255,${dot.a * (reduce ? 1 : 0.68 + Math.sin(t * dot.v + i) * 0.32)})`
            : `rgba(225,208,190,${dot.a * 0.3})`;
        context.arc(
          dot.x + mouseX * dot.r,
          dot.y + mouseY * dot.r,
          dot.r,
          0,
          Math.PI * 2,
        );
        context.fill();
      });
      if (variant === "stars" && !reduce && t - lastShootingStar > 7600) {
        lastShootingStar = t;
        const x = width * (0.15 + Math.random() * 0.7),
          y = height * (0.08 + Math.random() * 0.35);
        const gradient = context.createLinearGradient(x, y, x - 120, y + 65);
        gradient.addColorStop(0, "rgba(255,255,255,.9)");
        gradient.addColorStop(1, "rgba(190,205,255,0)");
        context.strokeStyle = gradient;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - 120, y + 65);
        context.stroke();
      }
      if (!reduce) frame = requestAnimationFrame(draw);
    };
    resize();
    draw(0);
    addEventListener("resize", resize);
    addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
    };
  }, [variant]);
  return (
    <canvas
      aria-hidden="true"
      ref={canvas}
      className={`atmosphere ${className}`}
    />
  );
}

export function Thread() {
  return (
    <svg
      className="thread"
      viewBox="0 0 100 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M50 0 C 6 90, 92 155, 48 245 S 6 395, 56 480 S 95 610, 45 710 S 15 815, 56 900" />
    </svg>
  );
}
