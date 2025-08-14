import React, { useEffect } from "react";

export default function SectionWithParticles({ children }) {
  useEffect(() => {
    const canvas = document.getElementById('particles-bg');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const colors = ['#01a7bd', '#23d7eb', '#008ba3'];
    const maxDistance = 150; // максимальное расстояние для соединения линиями
    const particleCount = Math.floor(window.innerWidth / 10); // фиксированное количество частиц

    let canvasWidth = window.innerWidth/2;
    let canvasHeight = window.innerHeight/2;

    function resizeCanvas() {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createParticles() {
      if (particles.length === 0) {
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
          });
        }
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // точки
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // линии
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(1, 167, 189, ${1 - distance / maxDistance})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function updateParticles() {
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvasWidth) p.speedX *= -1;
        if (p.y < 0 || p.y > canvasHeight) p.speedY *= -1;
      });
    }

    function animate() {
      drawParticles();
      updateParticles();
      requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <canvas id="particles-bg" style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}></canvas>
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}