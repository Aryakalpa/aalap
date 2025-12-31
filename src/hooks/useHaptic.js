import { useCallback } from 'react';

export function useHaptic() {
  const trigger = useCallback((pattern) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // Silently fail if vibration is blocked (prevents app crash)
    }
  }, []);

  return {
    tap: () => trigger(10),
    impactLight: () => trigger(15),
    impactMedium: () => trigger(25), // This was missing/crashing before
    impactHeavy: () => trigger(40),
    success: () => trigger([10, 30, 10]),
    error: () => trigger([50, 30, 50, 30, 50]),
  };
}