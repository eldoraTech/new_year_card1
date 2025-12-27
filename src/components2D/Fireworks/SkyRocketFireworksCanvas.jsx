// Launch speed         vy: -7 - Math.random() * 2
// Explosion height     if (r.y < height * 0.35)
// Bigger explosions    const RING_PARTICLES = 140;

import { useEffect, useRef } from "react";

const COLORS = [
  "255, 215, 150", // gold
  "255, 99, 132",  // red
  "54, 162, 235",  // blue
  "153, 102, 255", // purple
  "255, 159, 64",  // orange
  "75, 192, 192"   // teal
];

export default function SkyRocketFireworksCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let rockets = [];
    let particles = [];

    const AUTO_LAUNCH_INTERVAL = 2500;
    const CORE_PARTICLES = 50;
    const RING_PARTICLES = 160;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // 🚀 CREATE ROCKET
    function launchRocket(x = Math.random() * width) {
      rockets.push({
        x,
        y: height + 10,
        vx: (Math.random() - 0.5) * 1,
        vy: -7 - Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        exploded: false
      });
    }

    // 💥 EXPLOSION (MULTI-LAYER)
    function explode(x, y, color) {
      // CORE
      for (let i = 0; i < CORE_PARTICLES; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3,
          life: 60,
          alpha: 1,
          color
        });
      }

      // OUTER RING
      for (let i = 0; i < RING_PARTICLES; i++) {
        const angle = (Math.PI * 2 * i) / RING_PARTICLES;
        const speed = Math.random() * 4 + 3;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2,
          life: 80,
          alpha: 1,
          color
        });
      }
    }

    // AUTO ROCKETS
    const autoLaunch = setInterval(() => {
      launchRocket();
    }, AUTO_LAUNCH_INTERVAL);

    // CLICK → ROCKET
    function handleClick(e) {
      launchRocket(e.clientX);
    }

    window.addEventListener("click", handleClick);

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // 🚀 UPDATE ROCKETS
      rockets = rockets.filter(r => !r.exploded);

      rockets.forEach(r => {
        r.x += r.vx;
        r.y += r.vy;

        // TRAIL
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r.color},0.7)`;
        ctx.lineWidth = 2;
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + 30); // trail height is 30
        ctx.stroke();

        // EXPLODE NEAR TOP
        if (r.y < height * 0.35) {
          r.exploded = true;
          explode(r.x, r.y, r.color);
        }
      });

      // 💥 UPDATE PARTICLES
      particles = particles.filter(p => p.life > 0);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015;
        p.life--;
        p.alpha -= 0.012;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(${p.color},0.9)`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      clearInterval(autoLaunch);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none"
      }}
    />
  );
}
