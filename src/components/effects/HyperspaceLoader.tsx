import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import PixelPlanet from './PixelPlanet';
import PixelMoon from './PixelMoon';

export default function HyperspaceLoader({ onComplete }: { onComplete: () => void; key?: React.Key }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('INITIALIZING HYPERDRIVE...');
  const [showPlanet, setShowPlanet] = useState(false);
  const [zoomPlanet, setZoomPlanet] = useState(false);

  useEffect(() => {
    // Sequence of loading texts and phases
    const t1 = setTimeout(() => setText('CALCULATING JUMP COORDINATES...'), 800);
    const t2 = setTimeout(() => setText('ENGAGING...'), 1600);
    const t3 = setTimeout(() => {
      setText('APPROACHING DESTINATION...');
      setShowPlanet(true);
    }, 2500);
    const t4 = setTimeout(() => {
      setText('ENTERING ATMOSPHERE...');
      setZoomPlanet(true);
    }, 3500);
    const t5 = setTimeout(() => onComplete(), 4500); // Total duration 4.5s

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const stars: { x: number, y: number, z: number, pz: number }[] = [];
    const numStars = 400;
    let speed = 2; // Start slow

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * w,
        pz: 0
      });
    }

    const startTime = Date.now();

    const draw = () => {
      const elapsed = Date.now() - startTime;
      
      // Accelerate over time to simulate engaging hyperdrive
      if (elapsed > 1600 && elapsed < 2500) {
        speed += (60 - speed) * 0.1; // Warp speed
      } else if (elapsed > 800 && elapsed <= 1600) {
        speed += (15 - speed) * 0.05; // Medium speed
      } else if (elapsed >= 2500) {
        speed += (0.5 - speed) * 0.1; // Slow down when approaching planet
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Trail effect
      ctx.fillRect(0, 0, w, h);
      
      const cx = w / 2;
      const cy = h / 2;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.pz = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.z = w;
          star.pz = star.z;
          star.x = (Math.random() - 0.5) * w * 2;
          star.y = (Math.random() - 0.5) * h * 2;
        }

        const sx = (star.x / star.z) * cx + cx;
        const sy = (star.y / star.z) * cy + cy;
        const px = (star.x / star.pz) * cx + cx;
        const py = (star.y / star.pz) * cy + cy;

        // Fade in stars as they get closer
        const opacity = Math.max(0, 1 - (star.z / w));
        
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.lineWidth = (1 - star.z / w) * 3;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
      />
      
      {/* Moon */}
      <motion.div
        initial={{ scale: 0.01, opacity: 0, x: 0, y: 0 }}
        animate={{ 
          scale: showPlanet ? (zoomPlanet ? 0.8 : 0.2) : 0.01, 
          opacity: showPlanet ? 1 : 0,
          x: showPlanet ? (zoomPlanet ? '35vw' : '15vw') : 0,
          y: showPlanet ? (zoomPlanet ? '-30vh' : '-15vh') : 0
        }}
        transition={{ 
          duration: zoomPlanet ? 1.5 : 2, 
          ease: zoomPlanet ? "circIn" : "easeOut" 
        }}
        className="absolute z-0 flex items-center justify-center"
      >
        <PixelMoon className="w-[128px] h-[128px] md:w-[192px] md:h-[192px] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
      </motion.div>

      {/* Planet */}
      <motion.div
        initial={{ scale: 0.01, opacity: 0 }}
        animate={{ 
          scale: showPlanet ? (zoomPlanet ? 3 : 1) : 0.01, 
          opacity: showPlanet ? 1 : 0 
        }}
        transition={{ 
          duration: zoomPlanet ? 1.5 : 2, 
          ease: zoomPlanet ? "circIn" : "easeOut" 
        }}
        className="absolute z-0 flex items-center justify-center"
      >
        <PixelPlanet className="w-[256px] h-[256px] md:w-[384px] md:h-[384px] drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
      </motion.div>

      <div className={`relative z-10 flex flex-col items-center gap-6 transition-opacity duration-500 ${zoomPlanet ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-48 h-1 bg-slate-800 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 4.5, ease: "linear" }}
            className="h-full bg-cyan-500"
          />
        </div>
        <p className="text-cyan-400 font-display text-sm md:text-base tracking-widest uppercase animate-pulse text-center px-4">
          {text}
        </p>
      </div>
    </motion.div>
  );
}
