import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Lock, Zap, Star } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { projects } from '../data/portfolioData';

function useScrollReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return { ref, isInView };
}

/** Iron Man interface project card */
function ProjectCard({ project, index, onOpen }) {
  const { ref, isInView } = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  const isFuture = project.status === 'future';

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(project)}
      className={`project-card ${isFuture ? 'future-project' : ''}`}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top status bar */}
      <div style={{
        height: 3,
        background: project.gradient,
        boxShadow: hovered ? `0 0 12px ${project.color}80` : 'none',
        transition: 'box-shadow 0.4s',
      }} />

      {/* Project visual header */}
      <div style={{
        height: 180,
        background: `rgba(3, 5, 8, 0.9)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.4s',
        }} />

        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          width: 200, height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${project.color}15 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.4s',
        }} />

        {/* Project icon */}
        <motion.div
          animate={hovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            width: 76, height: 76,
            borderRadius: '12px',
            background: 'rgba(6, 10, 18, 0.92)',
            border: `1px solid ${project.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            fontSize: '2.2rem',
            zIndex: 1,
            boxShadow: hovered ? `0 0 25px ${project.color}30` : 'none',
            transition: 'box-shadow 0.4s',
          }}
        >
          {project.icon}
        </motion.div>

        {/* Badges */}
        {project.featured && (
          <div style={{
            position: 'absolute',
            top: '0.7rem', right: '0.7rem',
            padding: '0.22rem 0.65rem',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.35)',
            borderRadius: '3px',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: '#ffd700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            <Star size={9} fill="#ffd700" />
            FEATURED
          </div>
        )}

        {isFuture && (
          <div style={{
            position: 'absolute',
            top: '0.7rem', left: '0.7rem',
            padding: '0.22rem 0.65rem',
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '3px',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            <Zap size={9} />
            FUTURE
          </div>
        )}

        {/* HUD corner brackets */}
        {[
          { top: 8, left: 8, borderTop: true, borderLeft: true },
          { top: 8, right: 8, borderTop: true, borderRight: true },
          { bottom: 8, left: 8, borderBottom: true, borderLeft: true },
          { bottom: 8, right: 8, borderBottom: true, borderRight: true },
        ].map((corner, ci) => (
          <div key={ci} style={{
            position: 'absolute',
            width: 12, height: 12,
            ...corner,
            borderColor: `${project.color}50`,
            borderStyle: 'solid',
            borderWidth: 0,
            ...(corner.borderTop ? { borderTopWidth: 1.5 } : {}),
            ...(corner.borderBottom ? { borderBottomWidth: 1.5 } : {}),
            ...(corner.borderLeft ? { borderLeftWidth: 1.5 } : {}),
            ...(corner.borderRight ? { borderRightWidth: 1.5 } : {}),
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 0.3s',
          }} />
        ))}
      </div>

      {/* Card content */}
      <div style={{ padding: '1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.15rem',
            color: '#e8f4fd',
            letterSpacing: '0.01em',
          }}>
            {project.title}
          </h3>
          <span style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            color: `${project.color}90`,
            border: `1px solid ${project.color}25`,
            padding: '0.15rem 0.5rem',
            borderRadius: '2px',
          }}>
            {project.category}
          </span>
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          lineHeight: 1.75,
          marginBottom: '1.1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
          {project.tech.map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isFuture ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255,215,0,0.06)',
              border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: '4px',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: '#ffd700',
              cursor: 'default',
            }}>
              <Lock size={12} />
              CLASSIFIED — IN DEV
            </div>
          ) : (
            <>
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  flex: 1,
                  justifyContent: 'center',
                }}
                whileHover={{ background: 'rgba(255,255,255,0.08)', color: '#e8f4fd' }}
              >
                <FaGithub size={14} /> GitHub
              </motion.a>
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  background: project.gradient,
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  flex: 1,
                  justifyContent: 'center',
                  boxShadow: `0 2px 12px ${project.color}30`,
                }}
                whileHover={{ opacity: 0.9, scale: 1.02 }}
              >
                <ExternalLink size={14} /> Live Demo
              </motion.a>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/** Project detail modal */
function ProjectModal({ project, onClose }) {
  if (!project) return null;
  const isFuture = project.status === 'future';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="hud-panel"
        style={{
          width: '100%',
          maxWidth: 620,
          background: 'rgba(6, 10, 18, 0.99)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${project.color}15`,
        }}
      >
        {/* Modal gradient top */}
        <div style={{ height: 4, background: project.gradient }} />

        {/* Modal header visual */}
        <div style={{
          height: 180,
          background: `rgba(3, 5, 8, 0.95)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '25px 25px',
          }} />
          <div style={{
            position: 'absolute',
            width: 200, height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${project.color}10 0%, transparent 70%)`,
          }} />
          <div style={{ fontSize: '3.5rem', position: 'relative', zIndex: 1 }}>{project.icon}</div>
          <motion.button
            onClick={onClose}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              width: 34, height: 34,
              background: 'rgba(6, 10, 18, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)',
            }}
            whileHover={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.4)' }}
          >
            <X size={15} />
          </motion.button>
        </div>

        <div style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#e8f4fd',
              letterSpacing: '0.02em',
            }}>
              {project.title}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <span style={{
                padding: '0.2rem 0.7rem',
                background: `${project.color}12`,
                border: `1px solid ${project.color}30`,
                borderRadius: '3px',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                color: project.color,
              }}>
                {project.category}
              </span>
              {isFuture && (
                <span style={{
                  padding: '0.2rem 0.7rem',
                  background: 'rgba(255,215,0,0.08)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: '#ffd700',
                }}>
                  FUTURE PROJECT
                </span>
              )}
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {project.description}
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              ◆ Tech Stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.tech.map((t) => (
                <span key={t} className="tech-tag" style={{ fontSize: '0.8rem' }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {isFuture ? (
              <div style={{
                flex: 1,
                padding: '0.8rem',
                background: 'rgba(255,215,0,0.06)',
                border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: '4px',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                color: '#ffd700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}>
                <Lock size={14} />
                UNDER CONSTRUCTION — CLASSIFIED BUILD
              </div>
            ) : (
              <>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-outline"
                  style={{ flex: 1, justifyContent: 'center', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <FaGithub size={15} /> GitHub
                </a>
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ExternalLink size={15} /> Live Demo
                  </span>
                </a>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const { ref: headRef, isInView: headInView } = useScrollReveal();

  return (
    <section id="projects" className="section">
      <div className="container">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '3.5rem' }}
        >
          <div className="hud-label" style={{ marginBottom: '0.75rem' }}>04 — Mission Log</div>
          <h2 className="section-title">
            Deployed <span className="gradient-text-arc">Systems</span>
          </h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            Real production systems. Not tutorials. Not clones. Built from first principles with architecture that scales.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={setActiveProject}
            />
          ))}
        </div>

        {/* View more GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: '3.5rem' }}
        >
          <a
            href="https://github.com/bhuvanwarshe"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FaGithub size={16} />
            All Systems on GitHub
          </a>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
