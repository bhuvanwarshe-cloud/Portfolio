import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { personalInfo, codeSnippet } from '../data/portfolioData';
import { Shield, Zap, Coffee, Code2 } from 'lucide-react';

function useScrollReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return { ref, isInView };
}

function AnimatedStat({ value, label, icon, delay = 0 }) {
  const { ref, isInView } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="hud-panel"
      style={{
        textAlign: 'center',
        padding: '1.5rem 1rem',
        background: 'rgba(6, 10, 18, 0.92)',
        border: '1px solid rgba(0, 212, 255, 0.12)',
        borderRadius: '8px',
        flex: '1 1 120px',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{ borderColor: 'rgba(0, 212, 255, 0.35)', y: -3 }}
    >
      {/* Glow bg */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(0,212,255,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        fontFamily: 'var(--font-hud)',
        fontSize: 'clamp(2rem, 4vw, 2.8rem)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #00d4ff, #fff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '0.02em',
        marginBottom: '0.3rem',
        position: 'relative',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-hud)',
        fontSize: '0.6rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(0,212,255,0.6)',
        position: 'relative',
      }}>
        {label}
      </div>
    </motion.div>
  );
}

export default function About() {
  const { ref: sectionRef, isInView } = useScrollReveal();

  const traits = [
    { icon: <Shield size={16} />, label: 'Discipline', desc: 'Captain America values', color: '#00d4ff' },
    { icon: <Zap size={16} />, label: 'Innovation', desc: 'Tony Stark drive', color: '#ef4444' },
    { icon: <Code2 size={16} />, label: 'Builder', desc: 'Real execution mindset', color: '#a855f7' },
    { icon: <Coffee size={16} />, label: 'Consistency', desc: 'Show up every day', color: '#f59e0b' },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        {/* Heading */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '4rem' }}
        >
          <div className="hud-label" style={{ marginBottom: '0.75rem' }}>02 — Identity File</div>
          <h2 className="section-title">
            The <span className="gradient-text-arc">Developer</span> Behind the Code
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'start',
        }}>
          {/* ── Left: Identity Card & Code Block ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Clean Profile Image — Captain America Style (Structured, clear) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              marginBottom: '2rem',
              padding: '1.25rem',
              background: 'rgba(6, 10, 18, 0.6)',
              border: '1px solid rgba(0, 212, 255, 0.15)',
              borderRadius: '12px',
              borderLeft: '4px solid #00d4ff',
            }}>
              <div style={{
                width: 70, height: 70,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                flexShrink: 0
              }}>
                <img 
                  src="/profile.jpg" 
                  alt="Bhuvan Warshe Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) contrast(1.1)' }} 
                />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: '#e8f4fd', marginBottom: '0.2rem' }}>
                  Bhuvan Warshe
                </div>
                <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(0, 212, 255, 0.8)', textTransform: 'uppercase' }}>
                  Clearance Level: Admin
                </div>
              </div>
            </div>

            <div className="code-block hud-panel" style={{ position: 'relative' }}>
              {/* Mac dots + filename */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem', alignItems: 'center' }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 6px rgba(239,68,68,0.5)' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 6px rgba(245,158,11,0.5)' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
                <span style={{ marginLeft: '0.75rem', fontFamily: 'var(--font-mono)', color: 'rgba(0,212,255,0.5)', fontSize: '0.72rem' }}>
                  bhuvan.config.js
                </span>
              </div>

              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                {codeSnippet.split('\n').map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.2rem', lineHeight: '1.75' }}>
                    <span style={{ color: '#1e3a4f', width: '1.5rem', textAlign: 'right', userSelect: 'none', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                      {i + 1}
                    </span>
                    <span
                      style={{ color: '#8bafc7', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                      dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/\/\/.+/, (m) => `<span style="color:#4a6580;font-style:italic">${m}</span>`)
                          .replace(/\b(const|let|async|await|return|new|this)\b/g, '<span style="color:#a855f7">$1</span>')
                          .replace(/"([^"]+)"/g, '<span style="color:#34d399">"$1"</span>')
                          .replace(/'([^']+)'/g, "<span style='color:#34d399'>'$1'</span>")
                          .replace(/\b(developer|solve|think|ship|plan|build|values|name|stack|philosophy|currentlyBuilding|mindset)\b/g, '<span style="color:#00d4ff">$1</span>')
                          .replace(/\/\/ .+/g, (m) => `<span style="color:rgba(0,212,255,0.35)">⟵ ${m.slice(3)}</span>`),
                      }}
                    />
                  </div>
                ))}
              </pre>

              {/* Blinking caret */}
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  display: 'inline-block',
                  width: 7, height: 14,
                  background: '#00d4ff',
                  boxShadow: '0 0 8px #00d4ff',
                  marginTop: '0.3rem',
                  borderRadius: 1,
                }}
              />
            </div>

            {/* Traits panel */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginTop: '1.5rem',
            }}>
              {traits.map((trait, i) => (
                <motion.div
                  key={trait.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(6, 10, 18, 0.9)',
                    border: `1px solid ${trait.color}25`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                  whileHover={{ borderColor: `${trait.color}60`, y: -2 }}
                >
                  <span style={{ color: trait.color }}>{trait.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.65rem', letterSpacing: '0.1em', color: trait.color }}>{trait.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{trait.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Story Content ── */}
          <div>
            {/* Story paragraphs */}
            {personalInfo.bio.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.9,
                  fontSize: '1.05rem',
                  marginBottom: '1.4rem',
                }}
              >
                {para}
              </motion.p>
            ))}

            {/* Two-part philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ marginBottom: '2rem' }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}>
                {[
                  { icon: '⚡', label: 'TONY STARK', desc: 'Innovation, boldness, relentless iteration.', color: '#ef4444' },
                  { icon: '🛡️', label: 'STEVE ROGERS', desc: 'Discipline, integrity, duty to ship right.', color: '#00d4ff' },
                ].map((item) => (
                  <div key={item.label} style={{
                    padding: '1rem',
                    background: `rgba(6, 10, 18, 0.9)`,
                    border: `1px solid ${item.color}25`,
                    borderRadius: '6px',
                    borderLeft: `3px solid ${item.color}`,
                  }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{item.icon}</div>
                    <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.6rem', letterSpacing: '0.15em', color: item.color, marginBottom: '0.3rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Current Focus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.75 }}
              style={{
                padding: '1rem 1.2rem',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '6px',
                marginBottom: '2rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🔭</span>
              <div>
                <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#10b981', marginBottom: '0.2rem' }}>CURRENT DIRECTIVE</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Building scalable full-stack systems & deep-diving into AI integration for intelligent apps.
                </div>
              </div>
            </motion.div>

            {/* Resume CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
            >
              <a href={personalInfo.resume} download className="btn-primary" style={{ display: 'inline-flex' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📄 Download Resume
                </span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '4rem' }}
        >
          {personalInfo.stats.map((stat, i) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} delay={0.6 + i * 0.1} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
