import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, FastForward, Play, Pause, Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function HUDBar() {
  const [isAutopilot, setIsAutopilot] = useState(false);
  const [activeSection, setActiveSection] = useState('launch');
  const autopilotRef = useRef<number | null>(null);
  
  const { liteMode, setLiteMode, audioEnabled, setAudioEnabled, playBlip, playHover } = useSettings();

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

    return () => observer.disconnect();
  }, []);

  const toggleAutopilot = () => {
    playBlip();
    if (isAutopilot) {
      setIsAutopilot(false);
      if (autopilotRef.current) cancelAnimationFrame(autopilotRef.current);
    } else {
      setIsAutopilot(true);
      const scrollStep = () => {
        window.scrollBy(0, 1.5); // Smooth, cinematic scroll speed
        
        // Stop if we reached the bottom
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
          setIsAutopilot(false);
          return;
        }
        
        autopilotRef.current = requestAnimationFrame(scrollStep);
      };
      autopilotRef.current = requestAnimationFrame(scrollStep);
    }
  };

  // Stop autopilot on manual user interaction
  useEffect(() => {
    const stopAuto = () => {
      if (isAutopilot) {
        setIsAutopilot(false);
        if (autopilotRef.current) cancelAnimationFrame(autopilotRef.current);
      }
    };
    window.addEventListener('wheel', stopAuto);
    window.addEventListener('touchstart', stopAuto);
    return () => {
      window.removeEventListener('wheel', stopAuto);
      window.removeEventListener('touchstart', stopAuto);
    };
  }, [isAutopilot]);

  const handleSkip = () => {
    playBlip();
    const sections = ['launch', 'about', 'skills', 'projects', 'journey', 'contact'];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // 80px threshold to account for the 64px HUD bar + some margin
        if (rect.top > 80) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }
    // If we're at the bottom, loop back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 h-16 bg-black border-b-4 border-cyan-500 z-50 flex items-center justify-between px-4 md:px-6 font-mono text-xs md:text-sm"
    >
      <div className="flex items-center gap-4 md:gap-6">
        <span className="text-cyan-400 font-display text-xs md:text-sm flex items-center gap-2">
          A²J
        </span>
        <nav className="hidden md:flex items-center gap-4 text-slate-400 uppercase">
          <span className="text-cyan-500">|</span>
          {['launch', 'about', 'skills', 'projects', 'journey', 'contact'].map((id) => (
            <a 
              key={id}
              href={`#${id}`} 
              onMouseEnter={playHover}
              onClick={playBlip}
              className={`px-2 py-1 transition-none ${activeSection === id ? 'text-white bg-cyan-500 pixel-shadow' : 'hover:text-white hover:bg-cyan-500/50'}`}
            >
              {id}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:flex items-center gap-2 text-emerald-400 bg-black px-3 py-1 border-2 border-emerald-400 uppercase">
          <Terminal className="w-3 h-3" />
          <span>STATUS: {isAutopilot ? 'AUTO' : 'MANUAL'}</span>
        </div>
        
        <div className="flex items-center gap-2 border-r-2 border-cyan-500/30 pr-4">
          <button 
            onClick={() => { setAudioEnabled(!audioEnabled); playBlip(); }}
            onMouseEnter={playHover}
            className={`p-1.5 transition-colors ${audioEnabled ? 'text-cyan-400' : 'text-slate-500 hover:text-cyan-400'}`}
            title={audioEnabled ? "Mute Audio" : "Enable Audio"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 md:w-5 md:h-5" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
          <button 
            onClick={() => { setLiteMode(!liteMode); playBlip(); }}
            onMouseEnter={playHover}
            className={`p-1.5 transition-colors ${liteMode ? 'text-amber-400' : 'text-slate-500 hover:text-cyan-400'}`}
            title={liteMode ? "Disable Lite Mode" : "Enable Lite Mode"}
          >
            {liteMode ? <ZapOff className="w-4 h-4 md:w-5 md:h-5" /> : <Zap className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>

        <button
          onClick={toggleAutopilot}
          onMouseEnter={playHover}
          className={`flex items-center gap-2 px-3 py-1.5 border-2 transition-none uppercase tracking-wider text-[10px] md:text-xs group ${
            isAutopilot 
              ? 'bg-cyan-500 text-white border-cyan-500 pixel-shadow' 
              : 'bg-black hover:bg-cyan-500 hover:text-white text-slate-300 border-cyan-500'
          }`}
        >
          {isAutopilot ? (
            <>
              <span className="hidden sm:inline">AUTO</span>
              <Pause className="w-3 h-3" />
            </>
          ) : (
            <>
              <span className="hidden sm:inline">AUTO</span>
              <Play className="w-3 h-3" />
            </>
          )}
        </button>

        <button
          onClick={handleSkip}
          onMouseEnter={playHover}
          className="flex items-center gap-2 bg-black hover:bg-cyan-500 hover:text-white text-slate-300 px-3 py-1.5 border-2 border-cyan-500 transition-none uppercase tracking-wider text-[10px] md:text-xs group"
        >
          <span className="hidden sm:inline">SKIP</span>
          <FastForward className="w-3 h-3" />
        </button>
      </div>
    </motion.header>
  );
}
