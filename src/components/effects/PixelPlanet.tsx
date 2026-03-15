import { useEffect, useRef } from 'react';

export default function PixelPlanet({ className = "" }: { className?: string }) {
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
          // Base color (Ocean Blue)
          let rColor = 20;
          let gColor = 80;
          let bColor = 180;

          // Normalized coordinates for map generation (-1 to 1)
          const nx = dx / r;
          const ny = dy / r;

          // Noise for organic shapes
          const n1 = Math.sin(x * 0.2) * Math.cos(y * 0.2);
          const n2 = Math.sin(x * 0.4 + y * 0.3);
          const organic = n1 * 0.5 + n2 * 0.25;

          let isLand = false;
          let isDesert = false;
          let isSnow = false;

          // Distance helper
          const distTo = (px: number, py: number, scaleX = 1, scaleY = 1) => 
            Math.sqrt(Math.pow((nx - px) * scaleX, 2) + Math.pow((ny - py) * scaleY, 2));

          // Africa
          const dAfrica = distTo(-0.6, 0.1, 1, 0.8);
          if (dAfrica + organic * 0.4 < 0.55) {
            isLand = true;
            if (ny < -0.1) isDesert = true; // Sahara
          }
          
          // Horn of Africa
          if (distTo(-0.3, 0.05, 1, 1.5) + organic * 0.3 < 0.2) {
            isLand = true;
            isDesert = true;
          }

          // Arabian Peninsula
          const dArabia = distTo(-0.25, -0.2, 1.2, 1);
          if (dArabia + organic * 0.4 < 0.2) {
            isLand = true;
            isDesert = true;
          }

          // Europe
          const dEurope = distTo(-0.4, -0.6, 1, 1);
          if (dEurope + organic * 0.5 < 0.3) isLand = true;

          // Asia (Main body)
          const dAsia = distTo(0.2, -0.6, 0.8, 1);
          if (dAsia + organic * 0.4 < 0.6) {
            isLand = true;
            if (ny < -0.7) isSnow = true;
            if (ny > -0.4 && ny < -0.2 && nx > 0.0) isDesert = true; // Central Asia
          }

          // India
          const dIndia = distTo(0.05, -0.05, 1.5, 1);
          if (dIndia + organic * 0.3 < 0.25) {
             isLand = true;
             isDesert = false; // Make sure India is mostly green
          }

          // Himalayas
          if (isLand && nx > -0.05 && nx < 0.25 && ny > -0.35 && ny < -0.2) {
             if (organic > -0.2) isSnow = true;
             isDesert = false;
          }

          // SE Asia
          const dSEAsia = distTo(0.4, 0.0, 1, 1.5);
          if (dSEAsia + organic * 0.5 < 0.3) isLand = true;

          // Indonesia / Islands
          const dIndo = distTo(0.5, 0.25, 1, 2);
          if (dIndo + organic * 0.8 < 0.3) isLand = true;

          // Australia
          const dAus = distTo(0.65, 0.7, 1, 0.8);
          if (dAus + organic * 0.4 < 0.3) {
            isLand = true;
            if (organic > -0.2) isDesert = true;
          }

          // Madagascar
          const dMadagascar = distTo(-0.35, 0.4, 2, 1);
          if (dMadagascar + organic * 0.4 < 0.15) isLand = true;

          const ditherVal = bayer[y % 4][x % 4] / 16;

          // Base Ocean Color
          rColor = 10;
          gColor = 25;
          bColor = 60;
          if (organic + ditherVal * 0.5 > 0.3) {
             rColor = 15; gColor = 35; bColor = 80;
          }

          // Apply Land Colors
          if (isLand) {
            if (isSnow) {
              rColor = 200; gColor = 210; bColor = 220;
            } else if (isDesert) {
              if (organic + ditherVal * 0.5 > 0.3) {
                rColor = 170; gColor = 140; bColor = 90; // Light desert
              } else {
                rColor = 130; gColor = 100; bColor = 60; // Dark desert
              }
            } else {
              if (organic + ditherVal * 0.5 > 0.2) {
                rColor = 50; gColor = 90; bColor = 40; // Lighter green
              } else {
                rColor = 25; gColor = 60; bColor = 25; // Dark green
              }
            }
          }

          // Shadow for 3D sphere effect
          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
          
          // Light direction (top left)
          const lx = -0.5;
          const ly = -0.5;
          const lz = 0.7;
          
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

          // Atmosphere edge (light blue glow)
          if (dist > r - 2 && dot > 0.3) {
            rColor = Math.min(255, rColor + 40);
            gColor = Math.min(255, gColor + 60);
            bColor = Math.min(255, bColor + 100);
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
