'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, Volume2, Compass, MapPin } from 'lucide-react';
import { SparklesCore } from './ui/sparkles';
import { BackgroundBeams } from './ui/background-beams';

const spotlightCards = [
  {
    title: 'Chand Baori',
    subtitle: '3,500 Step Geometry',
    image: '/images/chand-baori.jpg',
    tag: 'Stepwell',
    slug: 'chand-baori-abhaneri',
  },
  {
    title: 'Mehrangarh Citadel',
    subtitle: '400ft Desert Sentinel',
    image: '/images/mehrangarh.jpg',
    tag: 'Citadel',
    slug: 'mehrangarh-fort-jodhpur',
  },
  {
    title: 'Raniji Ki Baori',
    subtitle: 'Queen Nathavatji 1699',
    image: '/images/raniji-ki-baori.jpg',
    tag: 'Sacred Well',
    slug: 'raniji-ki-baori-bundi',
  },
];

export default function HeritageLivingHero({ onOpenFolklore }) {
  const [activeCard, setActiveCard] = useState(0);

  // Mouse tilt tracking for the 3D perspective display
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const rotateY = useTransform(smoothX, [-300, 300], [-12, 12]);
  const rotateX = useTransform(smoothY, [-300, 300], [12, -12]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - (left + width / 2));
    mouseY.set(clientY - (top + height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92dvh] flex flex-col justify-between pt-24 pb-12 px-6 sm:px-12 lg:px-20 overflow-hidden bg-[#0A0B0E]"
    >
      {/* ── AMBIENT CANVAS & EMBER PARTICLES ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle dark photography backdrop */}
        <img
          src="/images/kumbhalgarh-wall.jpg"
          alt="Backdrop"
          className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/80 to-[#0A0B0E]/90" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0A0B0E]/60 to-[#0A0B0E]" />
      </div>

      <BackgroundBeams className="opacity-35" />

      {/* Radiant vermilion ember particles */}
      <SparklesCore
        id="livingWorldEmbers"
        background="transparent"
        minSize={1}
        maxSize={2.4}
        particleDensity={28}
        particleColor="#E8402A"
        className="z-5 pointer-events-none"
      />

      {/* ── FLOATING FOLKLORE AUDIO BADGE ── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full flex items-center justify-between pt-2 sm:pt-4">
        <button
          onClick={onOpenFolklore}
          className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full liquid-pill-ghost text-xs text-white/90 hover:text-white cursor-pointer group"
          title="Listen to Oral Folklore Ballad"
        >
          <span className="w-2 h-2 rounded-full bg-[#E8402A] animate-pulse" />
          <Volume2 className="w-3.5 h-3.5 text-[#E8402A] group-hover:scale-110 transition-transform" />
          <span className="font-ui font-medium tracking-wide">
            Oral Ballad: Marwari Desert Legend
          </span>
          <span className="text-[11px] text-white/40 font-mono">3m 42s</span>
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-white/40 uppercase tracking-widest">
          <span>Coordinates</span>
          <span className="text-white/20">/</span>
          <span className="text-[#E8402A]">26.9124° N, 75.7873° E</span>
        </div>
      </div>

      {/* ── MAIN HERO GRID ── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
          >
            <span className="text-[11px] font-bold tracking-[0.24em] text-[#E8402A] uppercase block">
              Hide India · Sacred Sanctuary Archive
            </span>

            <h1 className="headline-werlton text-[clamp(2.6rem,5.5vw,5rem)] text-white tracking-tight leading-[0.98]">
              SACRED CITADELS & SUBTERRANEAN REALMS
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-lg leading-relaxed font-light">
              An authentic photographic archive of unconquered desert fortresses, mystical stepwells, and vanishing oral legends.
            </p>
          </motion.div>

          {/* Liquid-Metal Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <a
              href="#pick-the-place"
              className="inline-flex items-center space-x-2.5 px-7 py-3.5 liquid-pill-primary text-white text-xs font-bold tracking-wider uppercase cursor-pointer"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>EXPLORE SANCTUARIES</span>
            </a>

            <Link
              href="/planner"
              className="inline-flex items-center space-x-2 px-6 py-3.5 liquid-pill-ghost text-white text-xs font-bold tracking-wider uppercase cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E8402A]" />
              <span>AI ROUTE PLANNER</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/60 ml-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Interactive 3D Perspective Card Trio */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div
            style={{
              rotateY,
              rotateX,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full max-w-[380px] aspect-[4/5] rounded-[32px] p-2"
          >
            {spotlightCards.map((card, idx) => {
              const isSelected = idx === activeCard;
              return (
                <motion.div
                  key={card.title}
                  onClick={() => setActiveCard(idx)}
                  animate={{
                    scale: isSelected ? 1 : 0.92,
                    y: isSelected ? 0 : (idx - activeCard) * 16,
                    opacity: isSelected ? 1 : 0.45,
                    zIndex: isSelected ? 10 : 1,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute inset-0 rounded-[28px] overflow-hidden cursor-pointer shadow-2xl border transition-all duration-300 ${
                    isSelected
                      ? 'border-white/25 shadow-black/80'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.08] transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Card Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/15 text-white">
                      {card.tag}
                    </span>
                  </div>

                  {/* Card Content & Link */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div>
                      <h3 className="headline-werlton text-xl text-white">
                        {card.title}
                      </h3>
                      <p className="text-xs text-white/70 font-light">
                        {card.subtitle}
                      </p>
                    </div>

                    <Link
                      href={`/place/${card.slug}`}
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-[#E8402A] backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-md active:scale-95"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}

            {/* Quick Card Navigator Dots */}
            <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center space-x-2">
              {spotlightCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCard(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeCard === i
                      ? 'w-8 bg-[#E8402A]'
                      : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Select card ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BOTTOM SANCTUARY PILLARS ── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full pt-8 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E8402A] shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                Subterranean Baoris
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-light mt-0.5">
                Geometric stepwells engineered to harvest desert monsoon rain.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E8402A] shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                Crown Citadels
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-light mt-0.5">
                Unconquered hilltop bastions of Mewar and Marwar clans.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E8402A] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                Living Craft Guilds
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-light mt-0.5">
                Centuries-old GI block print and blue pottery master lineages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
