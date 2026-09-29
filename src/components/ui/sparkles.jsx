'use client';

import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const SparklesCore = ({
  id,
  className,
  background,
  minSize = 1,
  maxSize = 3,
  particleDensity = 40,
  particleColor = '#E03E3E',
}) => {
  const generatedId = useId();
  const sparklesId = id || generatedId;

  // Generate random particles
  const particles = Array.from({ length: particleDensity }, (_, i) => ({
    id: `${sparklesId}-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (maxSize - minSize) + minSize,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ background: background || 'transparent' }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: particleColor,
            boxShadow: `0 0 ${p.size * 3}px ${particleColor}`,
          }}
          animate={{
            opacity: [0.1, 0.9, 0.1],
            scale: [0.8, 1.3, 0.8],
            y: ['0px', '-25px', '0px'],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
