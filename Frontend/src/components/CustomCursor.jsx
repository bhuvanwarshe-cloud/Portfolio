import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const [cursorState, setCursorState] = useState('default'); // 'default', 'hover', 'click'
  
  const cursorRef = useRef(null);
  const outerRef = useRef(null);
  const requestRef = useRef(null);

  // Keep track of actual mouse position
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Keep track of lagging position for smooth follow
  const smoothMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    // Check mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.classList.remove('cursor-none-global');
      cancelAnimationFrame(requestRef.current);
      return;
    }
    
    document.body.classList.add('cursor-none-global');

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const updateCursor = () => {
      // Linear interpolation for smooth trailing effect
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.15;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.15;

      if (cursorRef.current && outerRef.current) {
        // Inner cursor snaps instantly. Tip of CSS/SVG is at 0,0, so we just use clientX and clientY.
        // We subtract 2px to account for the stroke/padding in the SVG.
        cursorRef.current.style.transform = `translate3d(${mouse.current.x - 2}px, ${mouse.current.y - 2}px, 0)`;
        
        // Outer ring trails smoothly. We want its center to be at the mouse tip!
        outerRef.current.style.transform = `translate3d(${smoothMouse.current.x}px, ${smoothMouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(updateCursor);
    };

    requestRef.current = requestAnimationFrame(updateCursor);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      document.body.classList.remove('cursor-none-global');
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const INTERACTIVE_SELECTORS = [
      'a', 'button', 'input', 'textarea', 
      '[role="button"]', '.project-card', 
      '.glass-hud', '.mindset-card', '.tech-tag'
    ];

    const isInteractive = (target) => {
      return INTERACTIVE_SELECTORS.some(selector => target.closest?.(selector));
    };

    const handleMouseOver = (e) => {
      if (isInteractive(e.target)) {
        setCursorState(prev => prev === 'click' ? 'click' : 'hover');
      }
    };

    const handleMouseOut = (e) => {
      if (isInteractive(e.target)) {
        setCursorState(prev => prev === 'click' ? 'click' : 'default');
      }
    };

    const handleMouseDown = () => setCursorState('click');
    const handleMouseUp = (e) => {
      setCursorState(isInteractive(e.target) ? 'hover' : 'default');
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile]);

  if (isMobile) return null;

  // Variants for the outer glowing trail
  const outerVariants = {
    default: {
      scale: 1,
      opacity: 0,
      width: 30,
      height: 30,
      backgroundColor: 'rgba(0, 212, 255, 0)',
      border: '1px solid rgba(0, 212, 255, 0)',
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.2,
      opacity: 1,
      width: 40,
      height: 40,
      backgroundColor: 'rgba(0, 212, 255, 0.05)',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)',
      transition: { duration: 0.2 }
    },
    click: {
      scale: 1.8,
      opacity: 0, // Quick ripple fading out
      width: 40,
      height: 40,
      backgroundColor: 'rgba(0, 212, 255, 0)',
      border: '2px solid rgba(0, 212, 255, 0.8)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  // Variants for the inner real pointer
  const innerVariants = {
    default: {
      scale: 1,
      filter: 'drop-shadow(0px 0px 4px rgba(0, 212, 255, 0.5))',
      transition: { duration: 0.15 }
    },
    hover: {
      scale: 1.15,
      filter: 'drop-shadow(0px 0px 8px rgba(0, 212, 255, 0.9))',
      transition: { duration: 0.15 }
    },
    click: {
      scale: 0.9,
      filter: 'drop-shadow(0px 0px 12px rgba(0, 212, 255, 1))',
      transition: { duration: 0.1 }
    }
  };

  const cursorContent = (
    <div className="custom-cursor-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 999999, isolation: 'isolate' }}>
      
      {/* Outer Glo/Ripple Trail */}
      <motion.div
        ref={outerRef}
        initial="default"
        animate={cursorState}
        variants={outerVariants}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
          zIndex: 999999
        }}
      >
        {/* Optional inner crosshair on hover */}
        <AnimatePresence>
          {cursorState === 'hover' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                width: 4, height: 4,
                borderRadius: '50%',
                background: 'rgba(0, 212, 255, 0.5)',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner Real Pointer (Stylized Arrow) */}
      <motion.div
        ref={cursorRef}
        initial="default"
        animate={cursorState}
        variants={innerVariants}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          willChange: 'transform',
          transformOrigin: 'top left',
          zIndex: 999999
        }}
      >
        {/* SVG Arrow - Precise Tip is at (2, 2) which we translate off in the JS logic */}
        <svg 
          width="24" height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Pointer Shape */}
          <path 
            d="M2 2L10.5 22L13 14.5L20 12L2 2Z" 
            fill="white" 
            stroke="#00d4ff" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
          {/* Futuristic Inner Line Detail */}
          <path 
            d="M6 7L11.5 12.5" 
            stroke="#00d4ff" 
            strokeWidth="1" 
            strokeLinecap="round" 
          />
        </svg>
      </motion.div>
    </div>
  );

  return createPortal(cursorContent, document.body);
}
