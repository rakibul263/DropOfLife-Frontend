'use client';

import React, { useEffect, useRef } from 'react';

interface BloodCell {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  vx: number;
  vy: number;
  vz: number;
  // 3D rotation angles & velocities
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  // Visual variations
  wobbleSpeed: number;
  wobblePhase: number;
  aspectRatio: number; // Slight morphological variation
  hueShift: number; // -5 to +5 subtle color difference
}

interface BioParticle {
  x: number;
  y: number;
  z: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  pulsePhase: number;
}

export function BloodCells3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; prevX: number; prevY: number }>({
    x: 0,
    y: 0,
    active: false,
    prevX: 0,
    prevY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || 650;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // Camera Focal Length for 3D Perspective
    const FOCAL_LENGTH = 550;
    const NUM_CELLS = width < 768 ? 16 : 28; // Responsive cell density
    const NUM_PARTICLES = width < 768 ? 20 : 38;

    // Initialize 3D Blood Cells (Erythrocytes)
    const cells: BloodCell[] = [];
    for (let i = 0; i < NUM_CELLS; i++) {
      cells.push({
        x: (Math.random() - 0.5) * (width * 1.2),
        y: (Math.random() - 0.5) * (height * 1.2),
        z: Math.random() * 450 + 60, // 60 (near) to 510 (deep background)
        baseRadius: Math.random() * 16 + 26, // 26px to 42px
        vx: (Math.random() - 0.5) * 0.45 + 0.15, // Gentle drift
        vy: (Math.random() - 0.5) * 0.35 - 0.2, // Subtle upward buoyancy
        vz: (Math.random() - 0.5) * 0.25,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.012,
        vRotY: (Math.random() - 0.5) * 0.015,
        vRotZ: (Math.random() - 0.5) * 0.009,
        wobbleSpeed: Math.random() * 0.018 + 0.008,
        wobblePhase: Math.random() * Math.PI * 2,
        aspectRatio: 0.94 + Math.random() * 0.12,
        hueShift: (Math.random() - 0.5) * 8,
      });
    }

    // Initialize Micro Bio-Particles (Platelets & Plasma vesicles)
    const particles: BioParticle[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: (Math.random() - 0.5) * (width * 1.3),
        y: (Math.random() - 0.5) * (height * 1.3),
        z: Math.random() * 500 + 40,
        radius: Math.random() * 2 + 1.2,
        vx: (Math.random() - 0.5) * 0.6 + 0.1,
        vy: (Math.random() - 0.5) * 0.5 - 0.25,
        alpha: Math.random() * 0.35 + 0.1,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Mouse Tracking for Fluid Dynamics
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left - width / 2;
      const currentY = e.clientY - rect.top - height / 2;
      mouseRef.current = {
        x: currentX,
        y: currentY,
        active: true,
        prevX: mouseRef.current.x,
        prevY: mouseRef.current.y,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parentEl = canvas.parentElement;
    if (parentEl) {
      parentEl.addEventListener('mousemove', handleMouseMove);
      parentEl.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;

    // Draw an Erythrocyte (Biconcave Red Blood Cell) in 3D Space
    const drawErythrocyte = (cell: BloodCell, scale: number, screenX: number, screenY: number) => {
      // Perspective-scaled radius
      const r = cell.baseRadius * scale;
      if (r < 2) return;

      // Depth-based subtle opacity ("opacity aktu kom thakbe" as user explicitly specified)
      // Clamped to 0.12 - 0.40 range for clean background aesthetics
      const depthFactor = Math.max(0.12, Math.min(1, 1 - (cell.z - 60) / 450));
      const baseAlpha = (0.10 + depthFactor * 0.28);

      // Compute 3D Euler angles into normal vector components
      // Nx, Ny determine direction of tilt, Nz determines face-on vs edge-on view
      const cosX = Math.cos(cell.rotX);
      const sinX = Math.sin(cell.rotX);
      const cosY = Math.cos(cell.rotY);
      const sinY = Math.sin(cell.rotY);

      // Normal vector approximation
      const nx = -sinY;
      const ny = sinX * cosY;
      const nz = cosX * cosY;

      // Project disc tilt:
      // When nz is 1: face-on circle. When nz is 0: edge-on thin ellipse / dumbbell profile
      const tiltFactor = Math.abs(nz);
      const minorRadius = Math.max(r * 0.22, r * (0.20 + 0.80 * tiltFactor));
      const rotationAngle = Math.atan2(ny, nx) + Math.PI / 2;

      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate(rotationAngle);

      // Fluid deformation wobble
      const wobble = Math.sin(time * cell.wobbleSpeed + cell.wobblePhase) * 0.04;
      const rx = r * (1 + wobble) * cell.aspectRatio;
      const ry = minorRadius * (1 - wobble);

      // Studio Key Light Direction (top-left)
      const lightDirX = -0.5;
      const lightDirY = -0.7;
      const lightDot = nx * lightDirX + ny * lightDirY + nz * 0.5;
      const highlightShift = lightDot * 0.35;

      // Soft ambient cellular shadow underneath
      ctx.beginPath();
      ctx.ellipse(3 * scale, 6 * scale, rx * 0.95, ry * 0.95, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${baseAlpha * 0.35})`;
      ctx.fill();

      // Outer Biomorphic Cell Body Gradient (Rich Arterial Crimson with Specular Rim)
      const bodyGrad = ctx.createRadialGradient(
        highlightShift * rx,
        highlightShift * ry,
        rx * 0.15,
        0,
        0,
        rx
      );

      // Biconcave Color Profile:
      // Core center depression is darker crimson, rim is vibrant blood rose, edges catch translucent light
      bodyGrad.addColorStop(0, `rgba(140, 15, 45, ${baseAlpha * 0.95})`);
      bodyGrad.addColorStop(0.35, `rgba(185, 20, 55, ${baseAlpha * 0.98})`);
      bodyGrad.addColorStop(0.70, `rgba(225, 29, 72, ${baseAlpha})`);
      bodyGrad.addColorStop(0.92, `rgba(244, 63, 94, ${baseAlpha * 1.1})`);
      bodyGrad.addColorStop(1, `rgba(251, 113, 133, ${baseAlpha * 0.65})`);

      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Distinctive Biconcave Disc Central Indentation (Donut Fovea Depression)
      // Visible mostly when cell is facing forward or tilted
      if (tiltFactor > 0.28) {
        const concavityRx = rx * 0.44;
        const concavityRy = ry * 0.44;

        const concavityGrad = ctx.createRadialGradient(
          0,
          0,
          0,
          0,
          0,
          concavityRx
        );
        // Deep sunken arterial ruby center
        concavityGrad.addColorStop(0, `rgba(80, 5, 20, ${baseAlpha * 0.85})`);
        concavityGrad.addColorStop(0.55, `rgba(120, 10, 35, ${baseAlpha * 0.65})`);
        concavityGrad.addColorStop(0.95, `rgba(190, 24, 60, ${baseAlpha * 0.15})`);
        concavityGrad.addColorStop(1, `rgba(225, 29, 72, 0)`);

        ctx.beginPath();
        ctx.ellipse(0, 0, concavityRx, concavityRy, 0, 0, Math.PI * 2);
        ctx.fillStyle = concavityGrad;
        ctx.fill();
      }

      // Specular Rim Light Arc (Reflective glow on cell curvature)
      ctx.beginPath();
      ctx.ellipse(
        -highlightShift * rx * 0.4,
        -highlightShift * ry * 0.4,
        rx * 0.88,
        ry * 0.88,
        0,
        Math.PI * 1.0,
        Math.PI * 1.95
      );
      ctx.strokeStyle = `rgba(255, 180, 195, ${baseAlpha * 0.55})`;
      ctx.lineWidth = Math.max(1, 1.8 * scale);
      ctx.stroke();

      ctx.restore();
    };

    // Main 3D Animation Loop
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Mouse Fluid Force
      const mouse = mouseRef.current;
      const mouseDx = mouse.active ? mouse.x - mouse.prevX : 0;
      const mouseDy = mouse.active ? mouse.y - mouse.prevY : 0;

      // 1. Render Micro Bio-Particles (Platelets & Plasma Vesicles)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Particle floating drift
        p.x += p.vx + Math.sin(time * 0.02 + p.pulsePhase) * 0.2;
        p.y += p.vy + Math.cos(time * 0.02 + p.pulsePhase) * 0.15;

        // Wrap around viewport in 3D bounds
        if (p.x < -width * 0.65) p.x = width * 0.65;
        if (p.x > width * 0.65) p.x = -width * 0.65;
        if (p.y < -height * 0.65) p.y = height * 0.65;
        if (p.y > height * 0.65) p.y = -height * 0.65;

        const pScale = FOCAL_LENGTH / (FOCAL_LENGTH + p.z);
        const pScreenX = p.x * pScale + centerX;
        const pScreenY = p.y * pScale + centerY;
        const pRadius = Math.max(1, p.radius * pScale);
        const pulseAlpha = p.alpha * (0.8 + 0.2 * Math.sin(time * 0.05 + p.pulsePhase));

        ctx.beginPath();
        ctx.arc(pScreenX, pScreenY, pRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 113, 133, ${pulseAlpha * 0.4})`;
        ctx.fill();

        // Soft halo on larger platelets
        if (pRadius > 1.8) {
          ctx.beginPath();
          ctx.arc(pScreenX, pScreenY, pRadius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(225, 29, 72, ${pulseAlpha * 0.15})`;
          ctx.fill();
        }
      }

      // 2. Sort Blood Cells from Back to Front (Painter's Algorithm for true 3D depth)
      cells.sort((a, b) => b.z - a.z);

      // 3. Update & Render Blood Cells
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        // 3D Organic Drift Velocity
        cell.x += cell.vx;
        cell.y += cell.vy;
        cell.z += cell.vz;

        // Gentle Brownian 3D Rotation
        cell.rotX += cell.vRotX;
        cell.rotY += cell.vRotY;
        cell.rotZ += cell.vRotZ;

        // Interactive Hydrodynamic Deflection when Cursor approaches
        if (mouse.active) {
          const dx = cell.x - mouse.x;
          const dy = cell.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 220;

          if (dist < influenceRadius && dist > 1) {
            const force = (1 - dist / influenceRadius) * 1.4;
            cell.x += (dx / dist) * force * 2.5 + mouseDx * 0.15;
            cell.y += (dy / dist) * force * 2.5 + mouseDy * 0.15;
            cell.vRotX += (dy / dist) * force * 0.005;
            cell.vRotY += (dx / dist) * force * 0.005;
          }
        }

        // Viewport boundaries & 3D wrap
        const boundX = width * 0.65;
        const boundY = height * 0.65;

        if (cell.x < -boundX) cell.x = boundX;
        if (cell.x > boundX) cell.x = -boundX;
        if (cell.y < -boundY) cell.y = boundY;
        if (cell.y > boundY) cell.y = -boundY;
        if (cell.z < 60) cell.z = 510;
        if (cell.z > 510) cell.z = 60;

        // 3D Perspective Projection
        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + cell.z);
        const screenX = cell.x * scale + centerX;
        const screenY = cell.y * scale + centerY;

        drawErythrocyte(cell, scale, screenX, screenY);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parentEl) {
        parentEl.removeEventListener('mousemove', handleMouseMove);
        parentEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 transition-opacity duration-1000"
      />
      {/* Subtle organic radial vignette to blend canvas seamlessly into deep obsidian container */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,transparent_20%,#09090b_95%)] pointer-events-none" />
    </div>
  );
}
