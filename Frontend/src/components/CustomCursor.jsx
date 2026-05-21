import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);

  // Refs for DOM elements — we drive ALL animations via rAF, zero Framer involvement
  const innerRef = useRef(null);
  const outerRef = useRef(null);
  const rafRef   = useRef(null);

  // Raw mouse position (updated on every mousemove)
  const mouse     = useRef({ x: -200, y: -200 });
  // Smoothed trailing position (lerped in rAF loop)
  const smoothPos = useRef({ x: -200, y: -200 });
  // Current interactive state: 'default' | 'hover' | 'click'
  const stateRef  = useRef('default');

  /* ─── Mobile detection ─── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ─── Main rAF loop + event listeners ─── */
  useEffect(() => {
    if (isMobile) {
      document.body.classList.remove('cursor-none-global');
      return;
    }

    document.body.classList.add('cursor-none-global');

    /* ── Mouse move ── */
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    /* ── Interactive target detection ── */
    const SELECTORS = ['a', 'button', 'input', 'textarea',
      '[role="button"]', '.project-card', '.glass-hud',
      '.mindset-card', '.tech-tag'];
    const isInteractive = (t) => SELECTORS.some(s => t.closest?.(s));

    const onOver  = (e) => { if (isInteractive(e.target) && stateRef.current !== 'click') stateRef.current = 'hover'; };
    const onOut   = (e) => { if (isInteractive(e.target) && stateRef.current !== 'click') stateRef.current = 'default'; };
    const onDown  = ()  => { stateRef.current = 'click'; };
    const onUp    = (e) => { stateRef.current = isInteractive(e.target) ? 'hover' : 'default'; };

    window.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseover',  onOver);
    document.addEventListener('mouseout',   onOut);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);

    /* ── rAF loop — drives every visual change directly via style ── */
    const lerp = (a, b, t) => a + (b - a) * t;

    // Scale/opacity lookup table — no React state, no re-renders
    const stateStyles = {
      default: { outerScale: 1,   outerOpacity: 0,   innerScale: 1,    glow: 4  },
      hover:   { outerScale: 1.2, outerOpacity: 1,   innerScale: 1.15, glow: 8  },
      click:   { outerScale: 1.8, outerOpacity: 0.6, innerScale: 0.9,  glow: 12 },
    };

    // Current animated scale values (lerped separately)
    const animated = { outerScale: 1, outerOpacity: 0, innerScale: 1 };

    const tick = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Lerp trailing position
      smoothPos.current.x = lerp(smoothPos.current.x, mx, 0.14);
      smoothPos.current.y = lerp(smoothPos.current.y, my, 0.14);

      const sx = smoothPos.current.x;
      const sy = smoothPos.current.y;

      const target = stateStyles[stateRef.current] || stateStyles.default;

      // Lerp scale & opacity so they animate smoothly too
      animated.outerScale   = lerp(animated.outerScale,   target.outerScale,   0.12);
      animated.outerOpacity = lerp(animated.outerOpacity, target.outerOpacity, 0.12);
      animated.innerScale   = lerp(animated.innerScale,   target.innerScale,   0.15);

      // Apply to DOM directly — no React re-render
      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate3d(${mx - 2}px, ${my - 2}px, 0) scale(${animated.innerScale})`;
        innerRef.current.style.filter =
          `drop-shadow(0 0 ${target.glow}px rgba(0,212,255,${0.5 + (target.glow / 24)}))`;
      }

      if (outerRef.current) {
        outerRef.current.style.transform =
          `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%) scale(${animated.outerScale})`;
        outerRef.current.style.opacity = animated.outerOpacity;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.body.classList.remove('cursor-none-global');
    };
  }, [isMobile]);

  if (isMobile) return null;

  const cursorContent = (
    <div
      style={{
        position: 'fixed', top: 0, left: 0,
        width: 0, height: 0,            // zero footprint — elements are absolutely positioned
        pointerEvents: 'none',
        zIndex: 999999,
      }}
    >
      {/* ── Outer trailing ring ── */}
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 38, height: 38,
          borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.4)',
          background: 'rgba(0,212,255,0.04)',
          boxShadow: '0 0 12px rgba(0,212,255,0.2)',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          opacity: 0,                    // starts hidden — rAF controls this
        }}
      />

      {/* ── Inner sharp pointer ── */}
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          pointerEvents: 'none',
          willChange: 'transform, filter',
          transformOrigin: 'top left',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main pointer shape */}
          <path d="M2 2L10.5 22L13 14.5L20 12L2 2Z"
            fill="white" stroke="#00d4ff" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Futuristic inner detail line */}
          <path d="M6 7L11.5 12.5"
            stroke="#00d4ff" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );

  return createPortal(cursorContent, document.body);
}
