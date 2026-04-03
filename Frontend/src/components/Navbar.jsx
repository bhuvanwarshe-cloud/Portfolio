import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks, personalInfo } from '../data/portfolioData';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const initials = personalInfo.name.split(' ').map(n => n[0]).join('');

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo — HUD style */}
        <motion.a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
        >
          {/* Arc reactor dot */}
          <div style={{
            width: 28, height: 28,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff 0%, #00d4ff 50%, rgba(0,212,255,0.2) 100%)',
            boxShadow: '0 0 12px #00d4ff, 0 0 24px rgba(0,212,255,0.4)',
            flexShrink: 0,
            animation: 'pulse-glow 2.5s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-hud)',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.2em',
            background: 'linear-gradient(135deg, #00d4ff, #fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {initials}.EXE
          </span>
        </motion.a>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="hidden md:flex">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className={`nav-link ${activeSection === link.href.replace('#', '') ? 'active' : ''}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              {link.label}
            </motion.a>
          ))}

          {/* Hire Me CTA */}
          <motion.a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1.4rem',
              background: 'linear-gradient(135deg, #00d4ff, #0080ff)',
              color: '#000',
              fontFamily: 'var(--font-hud)',
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: 'none',
              borderRadius: '3px',
              clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              boxShadow: '0 0 15px rgba(0,212,255,0.3)',
            }}
          >
            Hire Me
          </motion.a>
        </nav>

        {/* Mobile Hamburger */}
        <motion.button
          id="hamburger-btn"
          className={`hamburger md:hidden flex flex-col gap-1.5 p-2 ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {menuOpen ? (
            <X size={20} color="#00d4ff" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </div>
          )}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(3, 5, 8, 0.98)',
              backdropFilter: 'blur(30px)',
              borderTop: '1px solid rgba(0, 212, 255, 0.15)',
              borderBottom: '1px solid rgba(0, 212, 255, 0.08)',
              overflow: 'hidden',
            }}
          >
            <div className="container" style={{ padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="nav-link"
                    style={{ fontSize: '0.9rem' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                  className="btn-primary"
                  style={{ display: 'inline-flex', width: 'fit-content', marginTop: '0.5rem' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <span>Hire Me</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD bottom bar (scrolled state) */}
      {scrolled && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #00d4ff, #ff2020, #00d4ff, transparent)',
            opacity: 0.6,
          }}
        />
      )}
    </header>
  );
}
