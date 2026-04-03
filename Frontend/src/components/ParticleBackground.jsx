import { useEffect, useRef } from 'react';

/**
 * Iron Man HUD-style animated particle background
 * Features: energy particles, connecting lines, mouse interaction, cursor glow
 */
export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const glowRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Detect mobile for reduced particles
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 40 : 90;
    const CONNECTION_DIST = isMobile ? 100 : 150;
    const MOUSE_REPEL_DIST = 120;

    // Color palette — arc reactor blues and stark reds
    const COLORS = [
      'rgba(0, 212, 255, ',  // arc blue
      'rgba(0, 140, 255, ',  // mid blue
      'rgba(100, 200, 255, ', // light blue
      'rgba(255, 32, 32, ',  // stark red (rare)
    ];

    // Init particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorBase = COLORS[Math.random() < 0.85 ? Math.floor(Math.random() * 3) : 3];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.5 + 0.2,
        colorBase,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update + draw particles
      particles.forEach((p, i) => {
        // Mouse repel
        const dx = p.x - mx;
        const dy = p.y - my;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < MOUSE_REPEL_DIST) {
          const force = (MOUSE_REPEL_DIST - distToMouse) / MOUSE_REPEL_DIST;
          p.vx += (dx / distToMouse) * force * 0.15;
          p.vy += (dy / distToMouse) * force * 0.15;
        }

        // Friction
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulse alpha
        const pulse = Math.sin(frame * p.pulseSpeed + p.pulseOffset) * 0.25 + 0.75;
        const finalAlpha = p.alpha * pulse;

        // Draw particle — glow dot
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        grd.addColorStop(0, `${p.colorBase}${finalAlpha})`);
        grd.addColorStop(0.4, `${p.colorBase}${finalAlpha * 0.4})`);
        grd.addColorStop(1, `${p.colorBase}0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Bright center dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${Math.min(finalAlpha + 0.3, 1)})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const cdx = p.x - other.x;
          const cdy = p.y - other.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (dist < CONNECTION_DIST) {
            const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Mouse attraction lines to nearby particles
      if (mx > 0 && my > 0) {
        particles.forEach((p) => {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.4;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });

        // Cursor glow circle
        const cursorGrd = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        cursorGrd.addColorStop(0, 'rgba(0, 212, 255, 0.08)');
        cursorGrd.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx.beginPath();
        ctx.arc(mx, my, 80, 0, Math.PI * 2);
        ctx.fillStyle = cursorGrd;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse tracker
    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px';
        glowRef.current.style.top = e.clientY + 'px';
      }
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Particle canvas */}
      <canvas ref={canvasRef} id="particle-canvas" />

      {/* Scanlines overlay */}
      <div className="hud-scanline" />

      {/* Cursor glow (DOM-based for smooth movement) */}
      <div
        ref={glowRef}
        className="cursor-glow"
        style={{ opacity: 0.8 }}
      />
    </>
  );
}
