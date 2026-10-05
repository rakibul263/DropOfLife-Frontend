'use client';

import React, { useEffect, useRef } from 'react';

interface BloodCell {
  x: number;
  y: number;
  z: number;
  radius: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  tilt: number;
  vTilt: number;
  aspect: number;
  alpha: number;
}

interface VeinPath {
  points: { x: number; y: number }[];
  width: number;
  pulseOffset: number;
  pulseSpeed: number;
}

export function VascularBloodBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initVeins();
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for subtle fluid deflection
    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // 1. Generate Vascular Vein Pathways across the screen
    let veins: VeinPath[] = [];

    const initVeins = () => {
      veins = [];
      const numVeins = width < 768 ? 3 : 5;

      for (let i = 0; i < numVeins; i++) {
        const startX = (width / (numVeins + 1)) * (i + 1) + (Math.random() - 0.5) * 150;
        const pts: { x: number; y: number }[] = [];
        const segments = 6;
        const segmentHeight = (height + 200) / segments;

        for (let s = 0; s <= segments; s++) {
          const curveOffset = Math.sin(s * 0.9 + i) * (width * 0.08) + (Math.random() - 0.5) * 40;
          pts.push({
            x: startX + curveOffset,
            y: -100 + s * segmentHeight,
          });
        }

        veins.push({
          points: pts,
          width: Math.random() * 12 + 18, // 18px to 30px vein diameter
          pulseOffset: Math.random() * 100,
          pulseSpeed: Math.random() * 0.6 + 0.8,
        });
      }
    };

    initVeins();

    // 2. Initialize Floating Red Blood Cells (Erythrocytes)
    const numCells = width < 768 ? 24 : 45;
    const cells: BloodCell[] = [];

    for (let i = 0; i < numCells; i++) {
      cells.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 300 + 50,
        radius: Math.random() * 14 + 18, // 18px - 32px
        vx: (Math.random() - 0.5) * 0.35 + 0.1,
        vy: (Math.random() - 0.5) * 0.4 - 0.25, // Gentle upward flow
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.008,
        tilt: Math.random() * Math.PI * 2,
        vTilt: (Math.random() - 0.5) * 0.012,
        aspect: 0.92 + Math.random() * 0.16,
        alpha: Math.random() * 0.14 + 0.08, // Subtle opacity (0.08 to 0.22)
      });
    }

    let time = 0;

    // Helper: Draw smooth Bezier curve through points
    const drawSmoothCurve = (pts: { x: number; y: number }[]) => {
      if (pts.length < 2) return;
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      ctx.quadraticCurveTo(
        pts[pts.length - 1].x,
        pts[pts.length - 1].y,
        pts[pts.length - 1].x,
        pts[pts.length - 1].y
      );
    };

    // Main 60fps Loop
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // A. Render Vascular Veins (Organic Capillary Channels)
      for (let v = 0; v < veins.length; v++) {
        const vein = veins[v];
        const pts = vein.points;

        // Outer vein sheath (Translucent vascular conduit walls)
        ctx.save();
        ctx.beginPath();
        drawSmoothCurve(pts);
        ctx.strokeStyle = 'rgba(225, 29, 72, 0.04)';
        ctx.lineWidth = vein.width + 14;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        drawSmoothCurve(pts);
        ctx.strokeStyle = 'rgba(159, 18, 57, 0.06)';
        ctx.lineWidth = vein.width;
        ctx.stroke();

        // Pulsating arterial plasma flow inside vein
        const progress = ((time * vein.pulseSpeed + vein.pulseOffset) % 300) / 300;
        const targetIndex = Math.min(
          pts.length - 1,
          Math.floor(progress * (pts.length - 1))
        );
        const pulsePt = pts[targetIndex];

        if (pulsePt) {
          const pulseGrad = ctx.createRadialGradient(
            pulsePt.x,
            pulsePt.y,
            0,
            pulsePt.x,
            pulsePt.y,
            vein.width * 2.2
          );
          pulseGrad.addColorStop(0, 'rgba(244, 63, 94, 0.16)');
          pulseGrad.addColorStop(0.6, 'rgba(225, 29, 72, 0.06)');
          pulseGrad.addColorStop(1, 'rgba(225, 29, 72, 0)');

          ctx.beginPath();
          ctx.arc(pulsePt.x, pulsePt.y, vein.width * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = pulseGrad;
          ctx.fill();
        }
        ctx.restore();
      }

      // B. Render Floating Erythrocytes (Red Blood Cells)
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];

        // Motion drift
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vRot;
        c.tilt += c.vTilt;

        // Gentle mouse fluid repulsion
        if (mouseActive) {
          const dx = c.x - mouseX;
          const dy = c.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 1) {
            const force = (1 - dist / 180) * 1.2;
            c.x += (dx / dist) * force * 2;
            c.y += (dy / dist) * force * 2;
          }
        }

        // Wrap around screen
        if (c.x < -60) c.x = width + 60;
        if (c.x > width + 60) c.x = -60;
        if (c.y < -60) c.y = height + 60;
        if (c.y > height + 60) c.y = -60;

        // Biconcave projection calculation
        const cosTilt = Math.abs(Math.cos(c.tilt));
        const rx = c.radius;
        const ry = Math.max(c.radius * 0.28, c.radius * (0.25 + 0.75 * cosTilt));

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);

        // Outer Cell Disc Gradient (Deep arterial crimson with translucent rim)
        const cellGrad = ctx.createRadialGradient(
          -rx * 0.15,
          -ry * 0.15,
          rx * 0.2,
          0,
          0,
          rx
        );
        cellGrad.addColorStop(0, `rgba(159, 18, 57, ${c.alpha * 0.85})`);
        cellGrad.addColorStop(0.5, `rgba(225, 29, 72, ${c.alpha})`);
        cellGrad.addColorStop(0.9, `rgba(244, 63, 94, ${c.alpha * 1.15})`);
        cellGrad.addColorStop(1, `rgba(251, 113, 133, ${c.alpha * 0.4})`);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = cellGrad;
        ctx.fill();

        // Biconcave Donut Indentation Depression (Visible when tilted face-on)
        if (cosTilt > 0.35) {
          const concavityRx = rx * 0.45;
          const concavityRy = ry * 0.45;

          const foveaGrad = ctx.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            concavityRx
          );
          foveaGrad.addColorStop(0, `rgba(80, 5, 20, ${c.alpha * 0.9})`);
          foveaGrad.addColorStop(0.65, `rgba(136, 19, 55, ${c.alpha * 0.5})`);
          foveaGrad.addColorStop(1, `rgba(225, 29, 72, 0)`);

          ctx.beginPath();
          ctx.ellipse(0, 0, concavityRx, concavityRy, 0, 0, Math.PI * 2);
          ctx.fillStyle = foveaGrad;
          ctx.fill();
        }

        // Specular rim light on cell curvature
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          rx * 0.9,
          ry * 0.9,
          0,
          Math.PI * 0.8,
          Math.PI * 1.8
        );
        ctx.strokeStyle = `rgba(255, 190, 205, ${c.alpha * 0.55})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
