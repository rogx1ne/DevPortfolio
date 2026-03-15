import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import PixelPlanet from '../effects/PixelPlanet';
import PixelMoon from '../effects/PixelMoon';
import { useEffect } from 'react';

export default function LaunchSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const planetX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const planetY = useTransform(smoothY, [-1, 1], [-30, 30]);
  const moonX = useTransform(smoothX, [-1, 1], [-60, 60]);
  const moonY = useTransform(smoothY, [-1, 1], [-60, 60]);
  const bgX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const bgY = useTransform(smoothY, [-1, 1], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section id="launch" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Grid background */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-[-50px] bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 z-0" 
      />

      {/* Pixel Moon Background */}
      <div className="absolute top-[10%] right-[5%] md:top-[15%] md:right-[15%] z-0 opacity-90 pointer-events-none">
        <motion.div style={{ x: moonX, y: moonY }}>
          <PixelMoon className="w-[128px] h-[128px] md:w-[192px] md:h-[192px] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
        </motion.div>
      </div>

      {/* Pixel Planet Background */}
      <div className="absolute top-1/2 left-1/2 z-0 opacity-40 md:opacity-60 pointer-events-none -translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ x: planetX, y: planetY }}>
          <PixelPlanet className="w-[256px] h-[256px] md:w-[384px] md:h-[384px] scale-[3] drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
        </motion.div>
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="z-10 text-center px-4 relative"
      >
        {/* Contrast Backdrop to ensure text is readable over the bright planet */}
        <div className="absolute inset-[-4rem] bg-black/60 blur-2xl -z-10 rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              fill="currentColor"
              className="w-20 h-20 text-white relative z-10"
            >
              <path d="M 42 12 C 42 6 58 6 58 12 L 58 22 C 58 26 42 26 42 22 Z" />
              <path d="M 50 15 C 20 15 12 35 12 55 C 12 70 18 80 25 85 L 30 65 C 22 55 25 35 50 30 C 75 35 78 55 70 65 L 75 85 C 82 80 88 70 88 55 C 88 35 80 15 50 15 Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M 15 52 C 15 38 85 38 85 52 C 85 68 65 72 50 62 C 35 72 15 68 15 52 Z M 23 52 C 23 44 77 44 77 52 C 77 62 62 64 50 56 C 38 64 23 62 23 52 Z" />
              <path d="M 25 80 C 25 95 40 95 45 92" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <rect x="45" y="86" width="10" height="12" rx="2" />
            </svg>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-indigo-500 blur-xl rounded-full z-0"
            />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-8xl font-display text-white mb-6 uppercase"
        >
          Yo!
          It's Abhishek
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-base md:text-xl lg:text-2xl text-indigo-400 font-mono mb-8 uppercase"
        >
          Just a fun Programmer \/
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-2xl mx-auto text-slate-300 text-sm md:text-lg font-mono uppercase"
        >
          Building robust applications and exploring the universe of code.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
      >
        <span className="text-xs text-indigo-500 font-display uppercase tracking-widest animate-pulse">PRESS START</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-1 h-12 bg-indigo-500"
        />
      </motion.div>
    </section>
  );
}
