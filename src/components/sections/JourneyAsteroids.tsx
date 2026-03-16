import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { CheckSquare, Square } from 'lucide-react';
import { journey } from '../../data/skills';
import Magnetic from '../effects/Magnetic';

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 30); // Typing speed
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, text, delay]);

  return <span ref={ref}>{displayedText}</span>;
};

export default function JourneyAsteroids() {
  return (
    <section id="journey" className="relative min-h-screen py-24 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-display text-white mb-4 uppercase">
            <span className="text-cyan-400">04.</span> Asteroid Timeline
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-lg uppercase">
            Navigating through the milestones of my developer journey.
          </p>
        </motion.div>

        {/* Mission Log Panel */}
        <Magnetic strength={0.04} className="max-w-2xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-black pixel-border pixel-shadow overflow-hidden"
          >
            <div className="bg-cyan-900 border-b-4 border-cyan-500 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-white" />
              <div className="w-3 h-3 bg-white" />
              <div className="w-3 h-3 bg-white" />
              <span className="ml-2 font-display text-[10px] text-white uppercase tracking-widest">mission_log.exe</span>
            </div>
            <div className="p-4 md:p-6 font-mono text-xs md:text-sm lg:text-base space-y-4">
              <div className="text-cyan-400 uppercase">
                <TypewriterText text="$ cat mission_progress.txt" delay={500} />
              </div>
              <div className="text-emerald-400 flex items-center gap-2 md:gap-3">
                <CheckSquare className="w-4 h-4 md:w-5 md:h-5 shrink-0"/> 
                <span className="uppercase"><TypewriterText text="Started BCA at Arcade Business College" delay={1500} /></span>
              </div>
              <div className="text-emerald-400 flex items-center gap-2 md:gap-3">
                <CheckSquare className="w-4 h-4 md:w-5 md:h-5 shrink-0"/> 
                <span className="uppercase"><TypewriterText text="Developed JournaLOG (React/TypeScript)" delay={2500} /></span>
              </div>
              <div className="text-emerald-400 flex items-center gap-2 md:gap-3">
                <CheckSquare className="w-4 h-4 md:w-5 md:h-5 shrink-0"/> 
                <span className="uppercase"><TypewriterText text="Built Library Management System (Java/Oracle)" delay={4500} /></span>
              </div>
              <div className="text-slate-300 flex items-center gap-2 md:gap-3">
                <Square className="w-4 h-4 md:w-5 md:h-5 text-slate-500 shrink-0"/> 
                <span className="uppercase"><TypewriterText text="Building & Learning in the way..." delay={5500} /></span>
              </div>
              <div className="text-slate-500 animate-pulse">_</div>
            </div>
          </motion.div>
        </Magnetic>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-cyan-500 hidden md:block" />

          {journey.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center justify-between mb-16 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Asteroid Marker */}
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-black border-4 border-cyan-500 z-10 hidden md:block" />
              
              {/* Content */}
              <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} mb-8 md:mb-0`}>
                <Magnetic strength={0.05}>
                  <div className="bg-black pixel-border p-5 md:p-6 hover:bg-cyan-950 pixel-shadow-hover transition-none">
                    <span className="text-cyan-400 font-display text-[10px] md:text-xs mb-1 md:mb-2 block uppercase">{item.year}</span>
                    <h3 className="text-lg md:text-xl font-display text-white mb-2 md:mb-3 uppercase leading-tight">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-mono text-sm md:text-base">{item.description}</p>
                  </div>
                </Magnetic>
              </div>

              {/* Empty space for the other side */}
              <div className="hidden md:block w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
