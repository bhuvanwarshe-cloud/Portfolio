import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail, ExternalLink, Zap } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { personalInfo, socialLinks } from '../data/portfolioData';

/** Typing animation hook */
function useTypingEffect(words, typingSpeed = 75, deletingSpeed = 40, pauseMs = 2200) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    let timeout;
    if (!deleting && displayed === word) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && displayed === '') {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    } else if (!deleting) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), typingSpeed);
    } else {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length - 1)), deletingSpeed);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return displayed;
}

const TYPED_WORDS = [
  'Building real systems…',
  'Future AI Engineer…',
  'Full Stack Developer…',
  'Problem Architect…',
  'Code. Ship. Repeat.',
];

const ICON_MAP = {
  github: FaGithub,
  linkedin: FaLinkedin,
  mail: Mail,
};

/** Profile Image Visual — Stark HUD style */
function ProfileVisual({ imageUrl = "/profile.jpg" }) {
  return (
    <div className="arc-reactor" style={{ width: 340, height: 340, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer decorative rings */}
      <div className="arc-ring arc-ring-4" style={{ width: '100%', height: '100%', animationDuration: '15s', opacity: 0.6 }} />
      <div className="arc-ring arc-ring-3" style={{ width: '85%', height: '85%', animationDuration: '20s', animationDirection: 'reverse', opacity: 0.4 }} />

      {/* Image Container with floating effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{ 
          opacity: { duration: 1.2, ease: "easeOut" },
          scale: { duration: 1.2, ease: "easeOut" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          width: 250, height: 250,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(0, 212, 255, 0.4)',
          boxShadow: '0 0 35px rgba(0, 212, 255, 0.25), inset 0 0 20px rgba(0, 212, 255, 0.5)',
          zIndex: 10,
          background: 'rgba(6, 10, 18, 0.9)'
        }}
      >
        <motion.img 
          src={imageUrl} 
          alt="Bhuvan Warshe" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) saturate(0.85) brightness(0.95)' }}
          whileHover={{ scale: 1.08, filter: 'contrast(1.15) saturate(1.1) brightness(1.05)' }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Glass overlay */}
        <div style={{
           position: 'absolute', inset: 0,
           background: 'radial-gradient(circle, transparent 40%, rgba(0,212,255,0.2) 100%)',
           pointerEvents: 'none'
        }} />
        
        {/* Scanning line animation */}
        <motion.div
           animate={{ top: ['-10%', '110%'] }}
           transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
           style={{
             position: 'absolute', left: 0, right: 0, height: 2,
             background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.8), transparent)',
             boxShadow: '0 0 12px rgba(0,212,255,0.5)',
             pointerEvents: 'none'
           }}
        />
      </motion.div>

      {/* Floating HUD Brackets around the image */}
      {[
        { top: '8%', left: '8%', transform: '' },
        { top: '8%', right: '8%', transform: 'scaleX(-1)' },
        { bottom: '8%', left: '8%', transform: 'scaleY(-1)' },
        { bottom: '8%', right: '8%', transform: 'scale(-1)' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 25, height: 25,
          borderTop: '3px solid rgba(0,212,255,0.8)',
          borderLeft: '3px solid rgba(0,212,255,0.8)',
          ...pos,
        }} />
      ))}

      {/* Floating data readout */}
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-hud)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: 'rgba(0,212,255,0.7)',
          whiteSpace: 'nowrap',
        }}
      >
        ARC-3.7 ONLINE
      </motion.div>
    </div>
  );
}

/** Floating HUD data chip */
function HudChip({ label, value, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 150 }}
      style={{
        position: 'absolute',
        padding: '0.4rem 0.85rem',
        background: 'rgba(6, 10, 18, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 212, 255, 0.25)',
        borderRadius: '4px',
        fontFamily: 'var(--font-hud)',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        color: '#00d4ff',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        whiteSpace: 'nowrap',
        boxShadow: '0 0 15px rgba(0,212,255,0.1)',
        clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
        ...style,
      }}
      className="float"
    >
      <span style={{ color: 'rgba(0,212,255,0.5)', fontSize: '0.5rem' }}>◆</span>
      <span style={{ color: 'rgba(255,255,255,0.5)', marginRight: 2 }}>{label}:</span>
      <span>{value}</span>
    </motion.div>
  );
}

export default function Hero() {
  const typedText = useTypingEffect(TYPED_WORDS);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section id="hero" className="hero section">
      {/* Moving grid bg */}
      <div className="hero-grid-bg" />
      {/* Center glow */}
      <div className="hero-glow-center" />

      {/* Ambient light streaks */}
      {[15, 35, 65, 85].map((left, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: 0,
            width: 1,
            height: '100%',
            background: `linear-gradient(180deg, transparent, rgba(0,212,255,${0.02 + i * 0.01}), transparent)`,
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4 + i, delay: i * 0.8, repeat: Infinity }}
        />
      ))}

      <div className="container" style={{ width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* ── LEFT: Text Content ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: 640 }}
          >
            {/* Status badge */}
            <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.35rem 1rem',
                background: 'rgba(0, 212, 255, 0.06)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '3px',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#00d4ff',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              }}>
                <span className="status-dot" />
                System Online — Available for Work
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                lineHeight: 1.0,
                letterSpacing: '0.02em',
                marginBottom: '0.6rem',
              }}
            >
              <span className="gradient-text-hero">
                {personalInfo.name}
              </span>
            </motion.h1>

            {/* Role */}
            <motion.div
              variants={itemVariants}
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.75rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(0,212,255,0.7)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ width: 30, height: 1, background: 'rgba(0,212,255,0.5)' }} />
              {personalInfo.role}
              <span style={{ width: 30, height: 1, background: 'rgba(0,212,255,0.5)' }} />
            </motion.div>

            {/* Typing animation */}
            <motion.div
              variants={itemVariants}
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '1.5rem',
                minHeight: '2.2rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Zap size={16} color="#00d4ff" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
              <span style={{ color: '#e8f4fd' }}>{typedText}</span>
              <span className="typing-cursor" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                marginBottom: '2.2rem',
                maxWidth: 500,
                borderLeft: '2px solid rgba(0,212,255,0.3)',
                paddingLeft: '1rem',
              }}
            >
              "{personalInfo.tagline}"
              <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Powered by discipline, driven by innovation. Tony's tech. Cap's integrity.
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}
            >
              <motion.a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ExternalLink size={14} />
                  View Projects
                </span>
              </motion.a>
              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} />
                  Contact Me
                </span>
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
            >
              <span style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}>
                Connect
              </span>
              <div style={{ width: 20, height: 1, background: 'rgba(0,212,255,0.3)' }} />
              {socialLinks.slice(0, 3).map((link) => {
                const Icon = ICON_MAP[link.icon] || ExternalLink;
                return (
                  <motion.a
                    key={link.icon}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    style={{
                      width: 38, height: 38,
                      borderRadius: '4px',
                      border: '1px solid rgba(0, 212, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      background: 'rgba(6, 10, 18, 0.8)',
                    }}
                    whileHover={{
                      scale: 1.1,
                      color: '#00d4ff',
                      borderColor: 'rgba(0, 212, 255, 0.5)',
                      boxShadow: '0 0 15px rgba(0, 212, 255, 0.25)',
                      backgroundColor: 'rgba(0, 212, 255, 0.08)',
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={16} />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Arc Reactor Visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: 'flex', justifyContent: 'center', position: 'relative', minHeight: 380 }}
          >
            {/* Floating HUD data chips */}
            <HudChip label="STATUS" value="ACTIVE" style={{ top: '5%', left: '-5%' }} delay={1.0} />
            <HudChip label="STACK" value="FULL" style={{ top: '15%', right: '0%' }} delay={1.2} />
            <HudChip label="MODE" value="BUILD" style={{ bottom: '20%', left: '-8%' }} delay={1.4} />
            <HudChip label="OUTPUT" value="PROD" style={{ bottom: '10%', right: '2%' }} delay={1.6} />

            {/* Profile Visual with float animation */}
            <motion.div>
              <ProfileVisual />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          cursor: 'pointer',
        }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '0.55rem',
          color: 'rgba(0,212,255,0.5)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}>
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} color="rgba(0,212,255,0.5)" />
        </motion.div>
      </motion.div>
    </section>
  );
}
