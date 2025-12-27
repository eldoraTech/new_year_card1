// Stronger sparkle:        const glowAlpha = 0.5 + Math.sin(p.sparkle) * 0.5;
// Bigger glow:         ctx.shadowBlur = 22;
// Less confetti:    const COUNT = 80;

import { useEffect, useRef } from "react";

const COLORS = [
  "255, 215, 150", // gold
  "255, 99, 132",  // red
  "54, 162, 235",  // blue
  "153, 102, 255", // purple
  "255, 159, 64",  // orange
  "75, 192, 192"   // teal
];

export default function SparkleGlowConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let pieces = [];

    const COUNT = 120;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // CREATE CONFETTI (START FROM TOP)
    function createConfetti() {
      pieces = Array.from({ length: COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * -height, // start ABOVE screen
        vx: Math.random() * 0.6 - 0.3,
        vy: Math.random() * 1.2 + 0.6,
        size: Math.random() * 5 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.08 - 0.04,
        sparkle: Math.random() * Math.PI * 2,
        sparkleSpeed: Math.random() * 0.08 + 0.04
      }));
    }

    createConfetti();

    function animate() {
      ctx.clearRect(0, 0, width, height);

      pieces.forEach(p => {
        // FALL DOWN
        p.y += p.vy;
        p.x += p.vx;

        // ROTATION & SPARKLE
        p.rotation += p.rotationSpeed;
        p.sparkle += p.sparkleSpeed;

        // RESET WHEN REACH BOTTOM
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        const glowAlpha = 0.4 + Math.sin(p.sparkle) * 0.4;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // GLOW
        ctx.shadowBlur = 18;
        ctx.shadowColor = `rgba(${p.color}, ${glowAlpha})`;

        // SPARKLE BRIGHTNESS
        ctx.globalAlpha = glowAlpha;

        ctx.fillStyle = `rgba(${p.color}, 1)`;
        ctx.fillRect(
          -p.size / 2,
          -p.size / 2,
          p.size,
          p.size * 1.6
        );

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none"
      }}
    />
  );
}
