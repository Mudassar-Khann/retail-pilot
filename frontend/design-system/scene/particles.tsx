"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticleEngineProps {
  density?: number;
  speed?: "still" | "drifting" | "active";
  behavior?: "ambient" | "orbit" | "flow";
  color?: string;
  className?: string;
}

export function ParticleEngine({
  density = 50,
  speed = "drifting",
  behavior = "ambient",
  color = "rgba(255,255,255,0.15)",
  className
}: ParticleEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{ x: number, y: number, vx: number, vy: number, radius: number }> = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / (100000 / density));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: speed === "still" ? 0 : (Math.random() - 0.5) * (speed === "active" ? 1 : 0.2),
          vy: speed === "still" ? 0 : (Math.random() - 0.5) * (speed === "active" ? 1 : 0.2),
          radius: Math.random() * 1.5 + 0.5
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      particles.forEach(p => {
        if (behavior === "flow") {
          p.x += p.vx + 0.2; // slight wind
          p.y += p.vy;
        } else if (behavior === "orbit") {
          // crude orbit math around center
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.sqrt(dx*dx + dy*dy);
          p.x += (dy / dist) * (speed === "active" ? 2 : 0.5);
          p.y -= (dx / dist) * (speed === "active" ? 2 : 0.5);
        } else {
          p.x += p.vx;
          p.y += p.vy;
        }

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    resize();
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed, behavior, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none mix-blend-screen", className)}
    />
  );
}
