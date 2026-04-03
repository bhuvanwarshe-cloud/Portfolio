import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '../data/portfolioData';

function useScrollReveal(margin = '-60px') {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });
  return { ref, isInView };
}

/** HUD-style skill bar */
function SkillBar({ name, level, delay = 0, color = '#00d4ff' }) {
  const { ref, isInView } = useScrollReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -15 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{ marginBottom: '1rem' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', alignItems: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          fontWeight: 500,
          color: hovered ? color : '#e8f4fd',
          transition: 'color 0.3s',
        }}>
          {name}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.5 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: color,
            opacity: 0.8,
          }}
        >
          {level}%
        </motion.span>
      </div>

      {/* Track */}
      <div className="skill-bar-track">
        {/* Segment ticks */}
        {[25, 50, 75].map((tick) => (
          <div key={tick} style={{
            position: 'absolute',
            left: `${tick}%`,
            top: 0,
            width: 1,
            height: '100%',
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1,
          }} />
        ))}

        {/* Fill */}
        <motion.div
          className="skill-bar-fill"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: level / 100 } : {}}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: hovered ? `0 0 8px ${color}80` : 'none',
            color,
          }}
        />
      </div>
    </motion.div>
  );
}

/** Skill category — HUD panel */
function SkillCategory({ category, icon, color, items, categoryIndex }) {
  const { ref, isInView } = useScrollReveal();
  const [panelHover, setPanelHover] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
      className="hud-panel"
      style={{
        padding: '1.8rem',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(6, 10, 18, 0.9)',
        border: `1px solid ${panelHover ? color + '40' : color + '18'}`,
        transition: 'border-color 0.4s ease',
        cursor: 'default',
      }}
      onMouseEnter={() => setPanelHover(true)}
      onMouseLeave={() => setPanelHover(false)}
      whileHover={{ y: -4 }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: -30, right: -30,
        width: 140, height: 140,
        borderRadius: '50%',
        background: color,
        opacity: panelHover ? 0.08 : 0.04,
        filter: 'blur(40px)',
        pointerEvents: 'none',
        transition: 'opacity 0.4s',
      }} />

      {/* Top scanning line (appears on hover) */}
      {panelHover && (
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0, height: '100%',
            width: 60,
            background: `linear-gradient(90deg, transparent, ${color}15, transparent)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Category header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.6rem' }}>
        <div style={{
          width: 42, height: 42,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${color}12`,
          border: `1px solid ${color}30`,
          borderRadius: '6px',
          fontSize: '1.3rem',
          position: 'relative',
        }}>
          {icon}
          {/* Corner dots */}
          <div style={{ position: 'absolute', top: 2, left: 2, width: 3, height: 3, background: color, opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 3, height: 3, background: color, opacity: 0.6 }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: '#e8f4fd',
            letterSpacing: '0.03em',
          }}>
            {category}
          </div>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.58rem',
            letterSpacing: '0.15em',
            color: `${color}80`,
            textTransform: 'uppercase',
          }}>
            {items.length} skills
          </div>
        </div>
      </div>

      {/* Skill bars */}
      {items.map((skill, i) => (
        <SkillBar
          key={skill.name}
          name={skill.name}
          level={skill.level}
          delay={categoryIndex * 0.08 + i * 0.06}
          color={color}
        />
      ))}

      {/* Bottom line accent */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0,
        width: panelHover ? '100%' : '30%',
        height: '2px',
        background: `linear-gradient(90deg, ${color}, transparent)`,
        transition: 'width 0.5s ease',
        opacity: 0.6,
      }} />
    </motion.div>
  );
}

export default function Skills() {
  const { ref: headRef, isInView: headInView } = useScrollReveal();

  const extras = [
    'Socket.io', 'Stripe API', 'OpenRouter AI', 'JWT Auth',
    'Zod', 'React Query', 'Axios', 'Multer', 'Nodemailer',
    'Bcrypt', 'CORS', 'Helmet.js', 'PM2', 'Nginx',
  ];

  return (
    <section id="skills" className="section" style={{
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.02) 50%, transparent 100%)',
    }}>
      <div className="container">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '4rem' }}
        >
          <div className="hud-label" style={{ marginBottom: '0.75rem' }}>03 — Tech Arsenal</div>
          <h2 className="section-title">
            My <span className="gradient-text-arc">Combat</span> Systems
          </h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            A battle-tested stack across the full development spectrum — from responsive UIs to resilient backend infrastructure.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '1.5rem',
        }}>
          {skills.map((cat, i) => (
            <SkillCategory
              key={cat.category}
              {...cat}
              categoryIndex={i}
            />
          ))}
        </div>

        {/* Additional techs cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ marginTop: '3.5rem' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.2rem',
          }}>
            <div style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: 'rgba(0,212,255,0.5)',
              textTransform: 'uppercase',
            }}>
              Also in the Arsenal
            </div>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,212,255,0.1)' }} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {extras.map((tech, i) => (
              <motion.span
                key={tech}
                className="tech-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
