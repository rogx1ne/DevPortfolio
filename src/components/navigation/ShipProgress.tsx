import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Rocket } from 'lucide-react';

export default function ShipProgress() {
  const [activeSection, setActiveSection] = useState('launch');
  const [nodePositions, setNodePositions] = useState<Record<string, number>>({});
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const topPosition = useTransform(scaleY, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = ['launch', 'about', 'skills', 'projects', 'journey', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const calculatePositions = () => {
      const positions: Record<string, number> = {};
      const totalScroll = document.body.scrollHeight - window.innerHeight;
      
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && totalScroll > 0) {
          let progress = el.offsetTop / totalScroll;
          progress = Math.max(0, Math.min(1, progress));
          positions[id] = progress * 100;
        }
      });
      setNodePositions(positions);
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    const timeoutId = setTimeout(calculatePositions, 1000);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculatePositions);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 h-[60vh] z-40 hidden sm:flex flex-col items-center">
      {/* Track */}
      <div className="absolute top-0 bottom-0 w-1 bg-slate-800 border-x border-slate-700" />
      
      {/* Progress Line */}
      <motion.div
        className="absolute top-0 w-1 bg-indigo-500 origin-top"
        style={{ scaleY, height: '100%' }}
      />

      {/* Nodes */}
      <div className="absolute top-0 bottom-0 w-full">
        {['Launch', 'About', 'Skills', 'Projects', 'Journey', 'Contact'].map((label) => {
          const id = label.toLowerCase();
          const isActive = activeSection === id;
          const topPct = nodePositions[id] ?? 0;
          return (
            <div 
              key={label} 
              className="absolute flex items-center group cursor-pointer -ml-0.5" 
              style={{ top: `${topPct}%`, transform: 'translateY(-50%)' }}
              onClick={() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className={`w-2 h-2 border transition-none z-10 ${isActive ? 'bg-indigo-400 border-indigo-300 shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 'bg-slate-700 border-slate-600 group-hover:bg-indigo-400 group-hover:border-indigo-300'}`} />
              <span className={`absolute left-6 text-[10px] md:text-xs font-mono transition-none whitespace-nowrap uppercase ${isActive ? 'text-indigo-400 opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Ship */}
      <motion.div
        className="absolute w-8 h-8 -ml-3.5 flex items-center justify-center text-white bg-black border-2 border-indigo-500 pixel-shadow"
        style={{ top: topPosition, y: '-50%' }}
      >
        <Rocket className="w-4 h-4 -rotate-90" />
      </motion.div>
    </div>
  );
}
