import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import nameLogo from '../assets/namelogo.png';
import { useStore } from '../data/store';

export default function SplashScreen({ onComplete }) {
  const { theme } = useStore();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 500); // Wait for exit animation
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <motion.img 
        src={nameLogo}
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '180px', filter: theme === 'night' ? 'invert(1)' : 'none' }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{ 
            marginTop: '20px', fontFamily: 'var(--font-serif)', 
            color: 'var(--text-sec)', fontSize: '16px', letterSpacing: '2px' 
        }}
      >
        শব্দৰ পৃথিৱীলৈ স্বাগতম
      </motion.div>
    </motion.div>
  );
}