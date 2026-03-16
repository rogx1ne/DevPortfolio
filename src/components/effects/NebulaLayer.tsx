import { motion, useScroll, useTransform } from 'motion/react';

export default function NebulaLayer() {
  const { scrollY } = useScroll();
  
  // Different speeds for parallax depth
  const y1 = useTransform(scrollY, [0, 5000], [0, -800]);
  const y2 = useTransform(scrollY, [0, 5000], [0, -1200]);
  const y3 = useTransform(scrollY, [0, 5000], [0, -500]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ imageRendering: 'pixelated' }}>
      {/* Deep Space Blocks */}
      <motion.div 
        style={{ y: y1 }} 
        className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-900/30 mix-blend-screen" 
      />
      <motion.div 
        style={{ y: y1 }} 
        className="absolute top-[15%] left-[5%] w-[200px] h-[200px] bg-purple-800/20 mix-blend-screen" 
      />
      
      {/* Mid Space Blocks */}
      <motion.div 
        style={{ y: y2 }} 
        className="absolute top-[40%] right-[-10%] w-[300px] h-[300px] bg-cyan-900/30 mix-blend-screen" 
      />
      <motion.div 
        style={{ y: y2 }} 
        className="absolute top-[35%] right-[5%] w-[150px] h-[150px] bg-cyan-800/20 mix-blend-screen" 
      />
      
      {/* Foreground Space Blocks */}
      <motion.div 
        style={{ y: y3 }} 
        className="absolute top-[80%] left-[20%] w-[500px] h-[500px] bg-blue-900/20 mix-blend-screen" 
      />
      
      {/* Extra Deep Space Dust */}
      <motion.div 
        style={{ y: y1 }} 
        className="absolute top-[150%] right-[20%] w-[350px] h-[350px] bg-emerald-900/20 mix-blend-screen" 
      />
    </div>
  );
}
