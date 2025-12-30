import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      background: 'var(--bg)', zIndex: 9999, 
      display: 'flex', alignItems: 'center', justifyContent: 'center' 
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <h1 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '4rem', 
          fontWeight: '900', 
          color: 'var(--accent)',
          letterSpacing: '-2px'
        }}>
          Aalap.
        </h1>
      </motion.div>
    </div>
  );
}