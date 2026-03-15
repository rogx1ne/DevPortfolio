import { useEffect, useRef } from 'react';

export default function PixelMoon({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 64;
    canvas.width = size;
    canvas.height = size;

    const cx = size / 2;
    const cy = size / 2;
    const r = 28;

    ctx.clearRect(0, 0, size, size);

    // Simple Bayer matrix for dithering
    const bayer = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5]
    ];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= r) {
          // Base color (Moon Silver/Gray)
          let rColor = 220;
          let gColor = 220;
          let bColor = 225;

          // Noise for texture (craters and maria)
          const noise = Math.sin(x * 0.3) * Math.cos(y * 0.3) + Math.sin(x * 0.1 + y * 0.2) * 2;
          const ditherVal = bayer[y % 4][x % 4] / 16;

          if (noise + ditherVal * 0.5 > 1.2) {
            rColor = 160; gColor = 160; bColor = 165; // Darker spots
          } else if (noise - ditherVal * 0.5 < -1.0) {
            rColor = 120; gColor = 120; bColor = 125; // Deep craters
          } else if (noise + ditherVal * 0.2 > 0.5) {
            rColor = 190; gColor = 190; bColor = 195; // Mid tones
          }

          // Shadow for 3D sphere effect (bottom right)
          const nx = dx / r;
          const ny = dy / r;
          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
          
          // Light direction (top left)
          const lx = -0.7;
          const ly = -0.7;
          const lz = 0.5;
          
          const dot = nx * lx + ny * ly + nz * lz;
          
          // Apply shadow with dithering
          if (dot + ditherVal * 0.5 < 0.2) {
            rColor = Math.floor(rColor * 0.2);
            gColor = Math.floor(gColor * 0.2);
            bColor = Math.floor(bColor * 0.2);
          } else if (dot + ditherVal * 0.5 < 0.5) {
            rColor = Math.floor(rColor * 0.5);
            gColor = Math.floor(gColor * 0.5);
            bColor = Math.floor(bColor * 0.5);
          }

          // Edge highlight (no atmosphere, just bright edge for the moon)
          if (dist > r - 2 && dot > 0.5) {
            rColor = 255; gColor = 255; bColor = 255;
          }

          ctx.fillStyle = `rgb(${rColor}, ${gColor}, ${bColor})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
