import { useEffect } from 'react';

// The backend URL — reads from Vite env variable, falls back to localhost for dev
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * useBackendWarmup
 *
 * Sends a single lightweight GET request to the backend health-check endpoint
 * when the app first loads. This wakes up the Render free-tier server from its
 * cold-start sleep so it's ready by the time the user reaches the contact form.
 *
 * - Fires once on mount, never again (empty dependency array)
 * - Runs in the background — never blocks the UI
 * - Silently swallows errors (warmup failure is non-critical)
 * - Uses native fetch with a signal so it can be aborted on unmount
 */
export function useBackendWarmup() {
  useEffect(() => {
    const controller = new AbortController();

    const warmup = async () => {
      try {
        const res = await fetch(BACKEND_URL, {
          method: 'GET',
          signal: controller.signal,
          // No caching — we want to actually hit the server
          cache: 'no-store',
        });

        if (res.ok) {
          console.log('[Warmup] Backend is awake ✅');
        }
      } catch (err) {
        // AbortError is expected on unmount — ignore it silently
        if (err.name !== 'AbortError') {
          // Non-critical: warmup failed but user can still try submitting
          console.warn('[Warmup] Backend ping failed (will retry on form submit):', err.message);
        }
      }
    };

    warmup();

    // Cleanup: cancel the request if the component unmounts before it finishes
    return () => controller.abort();
  }, []); // ← runs exactly once when the app mounts
}
