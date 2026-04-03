import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { mindsetValues } from '../data/portfolioData';

function useScrollReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return { ref, isInView };
}

function MindsetCard({ value, index }) {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mindset-card hud-panel"
      style={{ '--card-color': value.color }}
      whileHover={{ y: -6, borderColor: `${value.color}35` }}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute',
        top: -40, left: -40,
        width: 120, height: 120,
        borderRadius: '50%',
        background: value.color,
        opacity: 0.05,
        filter: 'blur(35px)',
        pointerEvents: 'none',
      }} />

      {/* Icon + label row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: 52, height: 52,
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${value.color}12`,
          border: `1px solid ${value.color}30`,
          fontSize: '1.6rem',
          flexShrink: 0,
          position: 'relative',
        }}>
          {value.icon}
          <div style={{
            position: 'absolute',
            top: 3, right: 3,
            width: 5, height: 5,
            borderRadius: '50%',
            background: value.color,
            boxShadow: `0 0 6px ${value.color}`,
            opacity: 0.8,
          }} />
        </div>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#e8f4fd',
            letterSpacing: '0.03em',
            marginBottom: '0.15rem',
          }}>
            {value.title}
          </h3>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.58rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: `${value.color}80`,
          }}>
            ◆ {value.subtitle}
          </div>
        </div>
      </div>

      <p style={{
        color: 'var(--text-secondary)',
        lineHeight: 1.8,
        fontSize: '0.95rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {value.description}
      </p>

      {/* Bottom accent line (hover activates via CSS ::after) */}
      <style>{`
        .mindset-card::after {
          background: ${value.color} !important;
        }
      `}</style>
    </motion.div>
  );
}

export default function Mindset() {
  const { ref: headRef, isInView: headInView } = useScrollReveal();

  return (
    <section id="mindset" className="section" style={{
      background: 'linear-gradient(180deg, transparent 0%, rgba(255,32,32,0.02) 40%, rgba(0,212,255,0.02) 80%, transparent 100%)',
    }}>
      <div className="container">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '1.5rem', textAlign: 'center' }}
        >
          <div className="hud-label" style={{ marginBottom: '0.75rem', justifyContent: 'center' }}>05 — Core Directives</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            The <span className="gradient-text-stark">Stark</span> &amp;{' '}
            <span className="gradient-text-arc">Cap</span> Protocol
          </h2>
          <div className="section-divider" style={{ margin: '1rem auto 2rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto 3.5rem', textAlign: 'center' }}>
            Two forces. One developer. What separates good from iconic is not just skill — it's the system you live by.
          </p>
        </motion.div>

        {/* Two-column banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            marginBottom: '3rem',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid rgba(0,212,255,0.1)',
          }}
        >
          {[
            {
              side: 'TONY STARK',
              icon: '⚡',
              tagline: '"Sometimes you gotta run before you can walk."',
              traits: ['Relentless iteration', 'Think 3 moves ahead', 'Build the impossible'],
              color: '#ef4444',
              bg: 'rgba(239,68,68,0.04)',
            },
            {
              side: 'STEVE ROGERS',
              icon: '🛡️',
              tagline: '"I can do this all day."',
              traits: ['Never cut corners', 'Ship with integrity', 'Discipline over motivation'],
              color: '#00d4ff',
              bg: 'rgba(0,212,255,0.04)',
            },
          ].map((half) => (
            <div key={half.side} style={{
              padding: '2rem',
              background: half.bg,
              borderBottom: `3px solid ${half.color}`,
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{half.icon}</div>
              <div style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: half.color,
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
              }}>
                {half.side}
              </div>
              <blockquote style={{
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                borderLeft: `2px solid ${half.color}40`,
                paddingLeft: '0.75rem',
              }}>
                {half.tagline}
              </blockquote>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {half.traits.map((t) => (
                  <li key={t} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: half.color, flexShrink: 0 }}>→</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Value cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {mindsetValues.map((value, i) => (
            <MindsetCard key={value.title} value={value} index={i} />
          ))}
        </div>

        {/* Final synthesis message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '3.5rem',
            padding: '2rem',
            background: 'rgba(6, 10, 18, 0.9)',
            border: '1px solid rgba(0,212,255,0.12)',
            borderRadius: '8px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gradient backdrop */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.58rem',
            letterSpacing: '0.25em',
            color: 'rgba(0,212,255,0.5)',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            position: 'relative',
          }}>
            ◆ DEVELOPER DNA ◆
          </div>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            color: '#e8f4fd',
            maxWidth: 700,
            margin: '0 auto',
            lineHeight: 1.6,
            position: 'relative',
          }}>
            "I build with Tony's <span className="gradient-text-stark">fire</span>, ship with Cap's <span className="gradient-text-arc">discipline</span>, and measure success by the system still running at 2AM."
          </p>
          <div style={{
            marginTop: '1rem',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            color: 'var(--text-muted)',
          }}>
            — Bhuvan Warshe
          </div>
        </motion.div>
      </div>
    </section>
  );
}
