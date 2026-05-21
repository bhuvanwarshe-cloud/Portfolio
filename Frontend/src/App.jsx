import { lazy, Suspense } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Hero from './sections/Hero';
import Footer from './components/Footer';
import { useBackendWarmup } from './hooks/useBackendWarmup';

// Lazy-load sections below the fold
const About = lazy(() => import('./sections/About'));
const Skills = lazy(() => import('./sections/Skills'));
const Projects = lazy(() => import('./sections/Projects'));
const Mindset = lazy(() => import('./sections/Mindset'));
const Contact = lazy(() => import('./sections/Contact'));

/** HUD-style skeleton loader */
function SectionLoader() {
  return (
    <div style={{
      minHeight: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {/* Arc reactor mini */}
        <div style={{
          width: 36, height: 36,
          borderRadius: '50%',
          border: '2px solid rgba(0,212,255,0.3)',
          borderTopColor: '#00d4ff',
          animation: 'spin 1s linear infinite',
          boxShadow: '0 0 15px rgba(0,212,255,0.3)',
        }} />
        <div style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          color: 'rgba(0,212,255,0.5)',
          textTransform: 'uppercase',
          animation: 'blink 1.5s ease-in-out infinite',
        }}>
          Loading...
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Ping the backend on app load to wake it from Render cold start
  useBackendWarmup();

  return (
    <>
      {/* Custom HUD Cursor */}
      <CustomCursor />

      {/* Animated particle background with cursor glow */}
      <ParticleBackground />

      {/* Sticky HUD navbar */}
      <Navbar />

      {/* Main content */}
      <main>
        {/* Hero — eagerly loaded (above the fold) */}
        <Hero />

        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Mindset />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
