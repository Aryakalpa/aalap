import { useCallback } from 'react';

export function useHaptic() {
  const trigger = useCallback((pattern = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  return {
    tap: () => trigger(10),
    success: () => trigger([10, 30, 10]),
    error: () => trigger([50, 30, 50, 30, 50]),
    impactLight: () => trigger(5),
    impactHeavy: () => trigger(20),
  };
}