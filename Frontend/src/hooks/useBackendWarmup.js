import { useEffect, useRef, useState } from 'react';

// Reads from Vite env — works in both dev and production automatically
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * useBackendWarmup
 *
 * Pings the backend health-check endpoint on app mount to wake Render
 * from its cold-start sleep before the user reaches the contact form.
 *
 * Returns:
 *   isWarm  {boolean} — true once backend has responded successfully
 *   isWaking {boolean} — true while the ping is in flight
 *
 * Behaviour:
 *   - Fires once on mount, never again
 *   - Runs silently in background — zero UI impact
 *   - AbortController cleans up if component unmounts before ping completes
 *   - Failure is non-critical (form still works, just cold)
 */
export function useBackendWarmup() {
  const [isWarm,  setIsWarm]  = useState(false);
  const [isWaking, setIsWaking] = useState(false);
  const hasRun = useRef(false); // guard against StrictMode double-invoke

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const controller = new AbortController();

    const ping = async () => {
      setIsWaking(true);
      try {
        const res = await fetch(BACKEND_URL, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store', // must actually hit the server, not CDN cache
        });

        if (res.ok) {
          setIsWarm(true);
          console.log('[Warmup] ✅ Backend is awake and ready');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Non-critical — form submit will still work, just starts cold
          console.warn('[Warmup] Backend ping failed — server may still be sleeping:', err.message);
        }
      } finally {
        setIsWaking(false);
      }
    };

    ping();

    return () => controller.abort();
  }, []);

  return { isWarm, isWaking };
}
