import { useEffect, useRef } from "react";

const COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcbef",
  "#6bff95",
  "#d77bff",
  "#ff9f43",
  "#ff8fab",
  "#90dbf4"
];

export default function BalloonPopCanvas() {
  const canvasRef = useRef(null);
  const popsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let balloons = [];

    const COUNT = 10;
    const BASE_UP_SPEED = 1.4;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnBalloon() {
      return {
        x: Math.random() * w,
        y: h + Math.random() * h * 0.6,
        vy: -(BASE_UP_SPEED + Math.random()),
        r: 22 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        sway: Math.random() * Math.PI * 2,
        tailPhase: Math.random() * Math.PI * 2
      };
    }

    balloons = Array.from({ length: COUNT }, spawnBalloon);

    function popBalloon(b) {
      for (let i = 0; i < 20; i++) {
        const a = Math.random() * Math.PI * 2;
        popsRef.current.push({
          x: b.x,
          y: b.y,
          vx: Math.cos(a) * (2 + Math.random() * 2),
          vy: Math.sin(a) * (2 + Math.random() * 2),
          life: 20
        });
      }
    }

    function handleClick(e) {
      const mx = e.clientX;
      const my = e.clientY;

      balloons.forEach((b, i) => {
        const dx = mx - b.x;
        const dy = my - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < b.r) {
          popBalloon(b);
          balloons[i] = spawnBalloon();
        }
      });
    }

    window.addEventListener("click", handleClick);

    function drawTail(b) {
      const segments = 8;
      const length = 50;

      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1.4;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const wave =
          Math.sin(b.tailPhase + t * 4 + b.sway) * (6 * t);

        const x = b.x + wave;
        const y = b.y + b.r - t * length+50;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    function drawBalloon(b) {
      // 🎗 Twisted tail
      drawTail(b);

      // 🎈 Balloon body
      const grad = ctx.createRadialGradient(
        b.x - b.r / 3,
        b.y - b.r / 3,
        4,
        b.x,
        b.y,
        b.r
      );
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(1, b.color);

      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.ellipse(b.x, b.y, b.r, b.r * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      balloons.forEach(b => {
        b.y += b.vy;
        b.sway += 0.04;
        b.tailPhase += 0.06;
        b.x += Math.sin(b.sway) * 0.3;

        if (b.y < -b.r * 2) {
          Object.assign(b, spawnBalloon());
        }

        drawBalloon(b);
      });

      popsRef.current = popsRef.current.filter(p => p.life > 0);

      popsRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.life / 20})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
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
        zIndex: 3,
        pointerEvents: "auto"
      }}
    />
  );
}
