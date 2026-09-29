'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const BackgroundBeams = ({ className }) => {
  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none z-0',
        className
      )}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.35, 0.15],
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#E03E3E]/30 to-amber-500/20 blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.25, 0.1],
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-[#E03E3E]/20 to-purple-900/20 blur-[120px]"
      />
    </div>
  );
};
