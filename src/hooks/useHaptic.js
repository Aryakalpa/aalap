import { useCallback } from 'react';
export function useHaptic() {
  const vibrate = useCallback((pattern) => { if (navigator.vibrate) navigator.vibrate(pattern); }, []);
  return { tap: () => vibrate(10), impactMedium: () => vibrate(30) };
}