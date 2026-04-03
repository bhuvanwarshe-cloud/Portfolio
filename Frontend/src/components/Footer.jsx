import { motion } from 'framer-motion';
import { Mail, Heart } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { personalInfo, navLinks, socialLinks } from '../data/portfolioData';

const ICON_MAP = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  mail: Mail,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      position: 'relative',
      z: 1,
      borderTop: '1px solid rgba(0,212,255,0.1)',
    }}>
      {/* Gradient top border glow */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, #00d4ff, #ff2020, #00d4ff, transparent)',
        opacity: 0.4,
      }} />

      <div style={{
        background: 'rgba(3, 5, 8, 0.98)',
        backdropFilter: 'blur(20px)',
        padding: '3rem 0 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}>
            {/* Brand */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '0.75rem',
              }}>
                <div style={{
                  width: 22, height: 22,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #fff 0%, #00d4ff 50%, rgba(0,212,255,0.2) 100%)',
                  boxShadow: '0 0 8px #00d4ff',
                }} />
                <span style={{
                  fontFamily: 'var(--font-hud)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  background: 'linear-gradient(135deg, #00d4ff, #fff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  BW.EXE
                </span>
              </div>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                lineHeight: 1.7,
                maxWidth: 220,
              }}>
                Building real systems. Powered by discipline, innovation, and too much coffee.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <div style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                color: 'rgba(0,212,255,0.5)',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                ◆ Navigation
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' }); }}
                    style={{
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-hud)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#00d4ff'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Social */}
            <div>
              <div style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                color: 'rgba(0,212,255,0.5)',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                ◆ Connect
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {socialLinks.map((link) => {
                  const Icon = ICON_MAP[link.icon] || Mail;
                  return (
                    <motion.a
                      key={link.icon}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-hud)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.08em',
                        transition: 'color 0.2s',
                      }}
                      whileHover={{ color: '#00d4ff', x: 3 }}
                    >
                      <Icon size={14} />
                      {link.label}
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Stack */}
            <div>
              <div style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                color: 'rgba(0,212,255,0.5)',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                ◆ Built With
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['React', 'Framer Motion', 'Tailwind CSS', 'Vite'].map((tech) => (
                  <span key={tech} className="tech-tag" style={{ fontSize: '0.65rem' }}>{tech}</span>
                ))}
              </div>
              <div style={{
                marginTop: '1.2rem',
                padding: '0.6rem 0.8rem',
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.12)',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'rgba(0,212,255,0.6)',
              }}>
                status: <span style={{ color: '#10b981' }}>operational</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(0,212,255,0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
            }}>
              © {year} {personalInfo.name} — All Rights Reserved
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
            }}>
              Built with
              <Heart size={12} color="#ef4444" fill="#ef4444" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
              and
              <span style={{ color: '#00d4ff' }}>arc reactor energy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
