import { useEffect, useRef } from 'react';
import { useScroll, useVelocity } from 'motion/react';

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 2000);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random(),
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get current scroll velocity
      const velocity = scrollVelocity.get();
      const warpFactor = Math.min(Math.abs(velocity) / 500, 5); // Cap warp factor
      
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        
        // Calculate dynamic height based on warp speed
        const stretchHeight = star.radius * 2 + (warpFactor * star.radius * 20);
        
        // Use square stars for pixelated look, stretched if warping
        ctx.fillRect(star.x, star.y, star.radius * 2, stretchHeight);

        // Update position (base speed + warp speed)
        const direction = velocity > 0 ? 1 : -1;
        const currentVy = star.vy + (warpFactor * direction * 5);
        
        star.x += star.vx;
        star.y += currentVy;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle
        star.alpha += (Math.random() - 0.5) * 0.05;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1) star.alpha = 1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-black"
    />
  );
}
