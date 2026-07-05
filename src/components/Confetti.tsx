import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  trigger: number;
  x?: number;
  y?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'triangle';
  opacity: number;
  scaleX: number;
  scaleYSpeed: number;
}

const colors = [
  '#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D', '#FF8AAE',
  '#A084CF', '#39A2DB', '#FFB3B3', '#96F2D7', '#FFE3E3'
];

export const Confetti: React.FC<ConfettiProps> = ({ trigger, x, y }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (trigger === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on client bounding box
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Use default coordinates if not provided (center of the screen)
    const originX = x !== undefined ? x : canvas.width / 2;
    const originY = y !== undefined ? y : canvas.height / 2;

    // Spawn particles
    const particleCount = 100;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Pick random angle (0 to 360 degrees) and velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      
      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1 + Math.random() * 3), // lift upwards slightly
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as any,
        opacity: 1,
        scaleX: Math.random(),
        scaleYSpeed: 0.05 + Math.random() * 0.05
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity
        p.vx *= 0.98; // drag
        p.vy *= 0.98; // drag
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.015; // fade out
        
        // Flip animation effect (changing scaleX)
        p.scaleX = Math.sin(Date.now() * p.scaleYSpeed);

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(p.scaleX, 1);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        if (p.shape === 'circle') {
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        } else if (p.shape === 'square') {
          ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'triangle') {
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    // Cancel previous frame before starting a new one
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [trigger, x, y]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
