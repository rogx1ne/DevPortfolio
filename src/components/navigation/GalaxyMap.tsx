import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function GalaxyMap() {
  const [isOpen, setIsOpen] = useState(false);
  const { playHover, playBlip } = useSettings();

  const locations = [
    { id: 'launch', name: 'Launch Pad', x: '50%', y: '80%', color: 'bg-orange-500' },
    { id: 'about', name: 'Planet Origin', x: '30%', y: '60%', color: 'bg-blue-500' },
    { id: 'skills', name: 'Skills Galaxy', x: '70%', y: '40%', color: 'bg-purple-500' },
    { id: 'projects', name: 'Projects Universe', x: '20%', y: '20%', color: 'bg-emerald-500' },
    { id: 'journey', name: 'Asteroid Belt', x: '80%', y: '60%', color: 'bg-slate-400' },
    { id: 'contact', name: 'Space Station', x: '50%', y: '10%', color: 'bg-red-500' },
  ];

  const handleNavigate = (id: string) => {
    playBlip();
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => { playBlip(); setIsOpen(true); }}
        onMouseEnter={playHover}
        className="fixed top-24 right-6 z-50 p-3 bg-black border-4 border-indigo-500 text-white hover:bg-indigo-500 transition-none group pixel-shadow"
      >
        <Map className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <button
              onClick={() => { playBlip(); setIsOpen(false); }}
              onMouseEnter={playHover}
              className="absolute top-6 right-6 p-3 text-white hover:bg-red-500 border-4 border-transparent hover:border-white transition-none"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-[90vw] h-[75vh] md:w-full md:max-w-4xl md:h-auto md:aspect-video border-4 border-indigo-500 bg-black pixel-shadow overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:40px_40px] opacity-20" />
              
              <div className="absolute top-4 left-4 md:top-6 md:left-6 font-display text-indigo-400 text-[10px] md:text-xs tracking-widest uppercase">
                GALAXY MAP
              </div>

              {locations.map((loc, i) => (
                <motion.div
                  key={loc.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className="absolute flex flex-col items-center gap-1 md:gap-2 cursor-pointer group"
                  style={{ left: loc.x, top: loc.y, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNavigate(loc.id)}
                  onMouseEnter={playHover}
                >
                  <div className={`w-5 h-5 md:w-8 md:h-8 ${loc.color} border-2 border-white group-hover:scale-125 transition-none relative`}>
                    <div className="absolute -inset-1.5 md:-inset-2 border-2 border-white opacity-0 group-hover:opacity-100 animate-pulse transition-none" />
                  </div>
                  <span className="text-[8px] md:text-xs font-display text-slate-400 group-hover:text-white transition-none whitespace-nowrap bg-black border-2 border-slate-700 px-1.5 py-0.5 md:px-2 md:py-1 uppercase">
                    {loc.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
