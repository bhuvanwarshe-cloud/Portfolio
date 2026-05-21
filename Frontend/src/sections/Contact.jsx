import { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Mail, Send, MapPin, CheckCircle, Loader, Wifi } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { personalInfo, socialLinks } from '../data/portfolioData';
import { useBackendWarmup } from '../hooks/useBackendWarmup';

// 90 seconds — enough for even the slowest Render cold start
const AXIOS_TIMEOUT_MS = 90_000;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function useScrollReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return { ref, isInView };
}

const SOCIAL_ICON_MAP = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  mail: Mail,
};

const SOCIAL_COLORS = {
  github: '#e8f4fd',
  linkedin: '#0077b5',
  twitter: '#1da1f2',
  mail: '#00d4ff',
};

export default function Contact() {
  const { ref: headRef, isInView } = useScrollReveal();
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  // Warm up the Render backend as soon as this section mounts
  const { isWarm, isWaking } = useBackendWarmup();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Sends the form — works whether backend is warm or cold
  const sendMessage = async () => {
    const response = await axios.post(`${API_URL}/api/contact`, {
      name:    form.name,
      email:   form.email,
      subject: form.subject,
      message: form.message,
    }, {
      timeout: AXIOS_TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const response = await sendMessage();

      if (response.data.success) {
        setStatus('sent');
      } else {
        setErrorMsg(response.data.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      let msg = 'Failed to send message. Please try again.';
      if (err.code === 'ECONNABORTED') {
        // Timed out even at 90s — extremely rare
        msg = 'The server took too long to respond. Please try again in a moment.';
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (!err.response) {
        // Network error — server unreachable
        msg = 'Cannot reach the server. Please check your connection and try again.';
      }
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  // One-click retry — resubmit the same form without clearing it
  const handleRetry = (e) => {
    setStatus('idle');
    setErrorMsg('');
    handleSubmit(e);
  };

  return (
    <section id="contact" className="section" style={{
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.02) 50%, transparent 100%)',
    }}>
      <div className="container">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <div className="hud-label" style={{ marginBottom: '0.75rem', justifyContent: 'center' }}>06 — Signal Channel</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Let's Build Something <span className="gradient-text-arc">Meaningful</span>
          </h2>
          <div className="section-divider" style={{ margin: '1rem auto 1.5rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            A great product starts with a great conversation. My signal is always open — reach out and let's architect something iconic.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          maxWidth: 980,
          margin: '0 auto',
        }}>
          {/* ── Left: Contact Info ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Intro message */}
            <div style={{
              padding: '1.5rem',
              background: 'rgba(6, 10, 18, 0.9)',
              border: '1px solid rgba(0,212,255,0.12)',
              borderRadius: '8px',
              marginBottom: '2rem',
              borderLeft: '3px solid #00d4ff',
            }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                Whether it's a full-stack project, a freelance gig, or just a chat about technology — I respond to every message personally.
              </p>
            </div>

            {/* Location */}
            <div style={{
              display: 'flex', gap: '0.75rem', alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '6px',
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#00d4ff', flexShrink: 0,
              }}>
                <MapPin size={17} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>LOCATION</div>
                <div style={{ fontWeight: 500, color: '#e8f4fd', fontSize: '0.95rem' }}>{personalInfo.location}</div>
              </div>
            </div>

            {/* Email */}
            <div style={{
              display: 'flex', gap: '0.75rem', alignItems: 'center',
              marginBottom: '2.5rem',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '6px',
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#00d4ff', flexShrink: 0,
              }}>
                <Mail size={17} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>EMAIL</div>
                <a href={`mailto:${personalInfo.email}`} style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>
                  {personalInfo.email}
                </a>
              </div>
            </div>

            {/* Social links */}
            <div>
              <div style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                ◆ Open Channels
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {socialLinks.map((link, i) => {
                  const Icon = SOCIAL_ICON_MAP[link.icon] || Mail;
                  const color = SOCIAL_COLORS[link.icon] || '#00d4ff';
                  return (
                    <motion.a
                      key={link.icon}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 1rem',
                        background: 'rgba(6, 10, 18, 0.9)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      whileHover={{
                        borderColor: `${color}40`,
                        color: color,
                        x: 4,
                      }}
                    >
                      <Icon size={17} />
                      <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{link.label}</span>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── Right: Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', height: '100%', minHeight: 360,
                  gap: '1.2rem', textAlign: 'center',
                  padding: '2rem',
                  background: 'rgba(6, 10, 18, 0.9)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: '8px',
                }}
              >
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                  <CheckCircle size={52} color="#10b981" />
                </motion.div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#e8f4fd', marginBottom: '0.5rem' }}>
                    Signal Received! 🚀
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: 300, fontSize: '0.95rem' }}>
                    Message transmitted. Bhuvan will respond within 24 hours.
                  </p>
                </div>
                <motion.button
                  onClick={() => { setStatus('idle'); setErrorMsg(''); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn-outline"
                  whileHover={{ scale: 1.05 }}
                  style={{ marginTop: '0.5rem' }}
                >
                  Send Another
                </motion.button>
              </motion.div>
            ) : (
              <div style={{
                padding: '2rem',
                background: 'rgba(6, 10, 18, 0.9)',
                border: '1px solid rgba(0,212,255,0.1)',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Top bar */}
                <div style={{ height: 2, background: 'linear-gradient(90deg, #00d4ff, #ff2020)', marginBottom: '1.75rem', borderRadius: '1px' }} />

                <div style={{
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.2em',
                  color: 'rgba(0,212,255,0.6)',
                  marginBottom: '1.5rem',
                  textTransform: 'uppercase',
                }}>
                  ◆ Compose Transmission
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label htmlFor="name" style={{ fontFamily: 'var(--font-hud)', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>Name</label>
                      <input id="name" name="name" type="text" required placeholder="Your Name" value={form.name} onChange={handleChange} className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="email" style={{ fontFamily: 'var(--font-hud)', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>Email</label>
                      <input id="email" name="email" type="email" required placeholder="your@email.com" value={form.email} onChange={handleChange} className="form-input" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" style={{ fontFamily: 'var(--font-hud)', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>Subject</label>
                    <input id="subject" name="subject" type="text" placeholder="Let's build something together" value={form.subject} onChange={handleChange} className="form-input" />
                  </div>

                  <div>
                    <label htmlFor="message" style={{ fontFamily: 'var(--font-hud)', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project or idea..."
                      value={form.message}
                      onChange={handleChange}
                      className="form-input"
                      style={{ resize: 'vertical', minHeight: 120 }}
                    />
                  </div>

                  {/* ── Server warm-up status indicator ── */}
                  <AnimatePresence>
                    {isWaking && status === 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          padding: '0.65rem 1rem',
                          background: 'rgba(0,212,255,0.05)',
                          border: '1px solid rgba(0,212,255,0.15)',
                          borderRadius: '6px',
                          color: 'rgba(0,212,255,0.7)',
                          fontSize: '0.8rem',
                          overflow: 'hidden',
                        }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        >
                          <Wifi size={13} />
                        </motion.div>
                        Connecting to server, please wait...
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Sending status banner ── */}
                  <AnimatePresence>
                    {status === 'sending' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          padding: '0.65rem 1rem',
                          background: 'rgba(0,212,255,0.05)',
                          border: '1px solid rgba(0,212,255,0.15)',
                          borderRadius: '6px',
                          color: 'rgba(0,212,255,0.8)',
                          fontSize: '0.8rem',
                          overflow: 'hidden',
                        }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader size={13} />
                        </motion.div>
                        {isWarm
                          ? 'Transmitting signal...'
                          : 'Connecting to server, please wait... (this may take up to 60s)'}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Error banner with retry ── */}
                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        style={{
                          padding: '0.75rem 1rem',
                          background: 'rgba(255,32,32,0.08)',
                          border: '1px solid rgba(255,32,32,0.3)',
                          borderRadius: '6px',
                          color: '#ff6b6b',
                          fontSize: '0.875rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                        }}
                      >
                        <span>⚠ {errorMsg}</span>
                        <button
                          type="button"
                          onClick={handleRetry}
                          style={{
                            alignSelf: 'flex-start',
                            background: 'rgba(255,32,32,0.15)',
                            border: '1px solid rgba(255,32,32,0.4)',
                            borderRadius: '4px',
                            color: '#ff6b6b',
                            padding: '0.3rem 0.8rem',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-hud)',
                            letterSpacing: '0.08em',
                          }}
                        >
                          ↺ Retry
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Submit button ── */}
                  <motion.button
                    type="submit"
                    className="btn-primary"
                    disabled={status === 'sending'}
                    whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {status === 'sending' ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <Loader size={15} />
                          </motion.div>
                          {isWarm ? 'Transmitting...' : 'Waking server...'}
                        </>
                      ) : (
                        <><Send size={15} /> Send Signal</>
                      )}
                    </span>
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
