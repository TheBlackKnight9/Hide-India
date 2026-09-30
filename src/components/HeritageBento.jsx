'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CardSpotlight } from './ui/card-spotlight';
import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react';

const expeditions = [
  {
    id: 'exp-1',
    title: 'Chand Baori Subterranean Steps',
    subtitle: '3,500 symmetrical geometric steps carved into the subterranean earth to harvest monsoon raindrops.',
    location: 'Abhaneri, Dausa',
    image: '/images/chand-baori.jpg',
    tag: 'Sacred Stepwell',
    slug: 'chand-baori-abhaneri',
    featured: true,
  },
  {
    id: 'exp-2',
    title: 'Mehrangarh Citadel',
    subtitle: 'Perched 400 feet above the blue city, echoing with warrior ballads.',
    location: 'Jodhpur, Marwar',
    image: '/images/mehrangarh.jpg',
    tag: 'Sovereign Fort',
    slug: 'mehrangarh-fort-jodhpur',
    featured: false,
  },
  {
    id: 'exp-3',
    title: 'Raniji Ki Baori',
    subtitle: 'Subterranean stepwell built in 1699 by Queen Nathavatji.',
    location: 'Bundi, Hadoti',
    image: '/images/raniji-ki-baori.jpg',
    tag: 'Subterranean Well',
    slug: 'raniji-ki-baori-bundi',
    featured: false,
  },
  {
    id: 'exp-4',
    title: 'Kuldhara Midnight Ruins',
    subtitle: 'Desert village abandoned in a single night under a binding oral curse.',
    location: 'Jaisalmer, Thar',
    image: '/images/kuldhara.jpg',
    tag: 'Ghost Village',
    slug: 'kuldhara-abandoned-village-jaisalmer',
    featured: false,
  },
];

export default function HeritageBento() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20 lg:py-28">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-[0.24em] text-[#E8402A] uppercase block">
            Curated Expedition Circuits
          </span>
          <h2 className="headline-werlton text-3xl sm:text-4xl lg:text-5xl text-[#23261f] tracking-tight">
            SIGNATURE HERITAGE BENTO
          </h2>
        </div>
        <p className="text-xs text-[#555c4e] max-w-sm md:text-right leading-relaxed font-normal">
          Four verified regional circuits balancing architectural wonder, subterranean silence, and oral folklore.
        </p>
      </div>

      {/* Bento Grid: 4 items in asymmetric 3-column composition */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Item 1: Large Featured Card (Spans 2 cols on lg) */}
        <div className="lg:col-span-2">
          <CardSpotlight color="#E8402A" className="h-full min-h-[380px] p-0 overflow-hidden rounded-[28px] border-white/10 group">
            <Link href={`/place/${expeditions[0].slug}`} className="block relative w-full h-full min-h-[380px]">
              <img
                src={expeditions[0].image}
                alt={expeditions[0].title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Tag Pill */}
              <div className="absolute top-5 left-5 z-20">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md border border-black/10 text-[#23261f] shadow-xs">
                  {expeditions[0].tag}
                </span>
              </div>

              {/* Action Circle */}
              <div className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-[#E8402A] border border-black/10 flex items-center justify-center text-[#23261f] hover:text-white transition-all shadow-xs">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                <div className="flex items-center space-x-1.5 text-white/60 text-xs font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#E8402A]" />
                  <span>{expeditions[0].location}</span>
                </div>
                <h3 className="headline-werlton text-2xl sm:text-3xl text-white">
                  {expeditions[0].title}
                </h3>
                <p className="text-xs text-white/70 max-w-xl font-light line-clamp-2">
                  {expeditions[0].subtitle}
                </p>
              </div>
            </Link>
          </CardSpotlight>
        </div>

        {/* Item 2: Standard Card */}
        <div className="lg:col-span-1">
          <CardSpotlight color="#E8402A" className="h-full min-h-[380px] p-0 overflow-hidden rounded-[28px] border-white/10 group">
            <Link href={`/place/${expeditions[1].slug}`} className="block relative w-full h-full min-h-[380px]">
              <img
                src={expeditions[1].image}
                alt={expeditions[1].title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute top-5 left-5 z-20">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md border border-black/10 text-[#23261f] shadow-xs">
                  {expeditions[1].tag}
                </span>
              </div>

              <div className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-[#E8402A] border border-black/10 flex items-center justify-center text-[#23261f] hover:text-white transition-all shadow-xs">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-white/60 text-xs font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#E8402A]" />
                  <span>{expeditions[1].location}</span>
                </div>
                <h3 className="headline-werlton text-xl text-white">
                  {expeditions[1].title}
                </h3>
                <p className="text-xs text-white/70 font-light line-clamp-2">
                  {expeditions[1].subtitle}
                </p>
              </div>
            </Link>
          </CardSpotlight>
        </div>

        {/* Item 3: Standard Card */}
        <div className="lg:col-span-1">
          <CardSpotlight color="#E8402A" className="h-full min-h-[340px] p-0 overflow-hidden rounded-[28px] border-white/10 group">
            <Link href={`/place/${expeditions[2].slug}`} className="block relative w-full h-full min-h-[340px]">
              <img
                src={expeditions[2].image}
                alt={expeditions[2].title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute top-5 left-5 z-20">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md border border-black/10 text-[#23261f] shadow-xs">
                  {expeditions[2].tag}
                </span>
              </div>

              <div className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-[#E8402A] border border-black/10 flex items-center justify-center text-[#23261f] hover:text-white transition-all shadow-xs">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-white/60 text-xs font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#E8402A]" />
                  <span>{expeditions[2].location}</span>
                </div>
                <h3 className="headline-werlton text-xl text-white">
                  {expeditions[2].title}
                </h3>
                <p className="text-xs text-white/70 font-light line-clamp-2">
                  {expeditions[2].subtitle}
                </p>
              </div>
            </Link>
          </CardSpotlight>
        </div>

        {/* Item 4: Wide Card (Spans 2 cols on lg) */}
        <div className="lg:col-span-2">
          <CardSpotlight color="#E8402A" className="h-full min-h-[340px] p-0 overflow-hidden rounded-[28px] border-white/10 group">
            <Link href={`/place/${expeditions[3].slug}`} className="block relative w-full h-full min-h-[340px]">
              <img
                src={expeditions[3].image}
                alt={expeditions[3].title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute top-5 left-5 z-20">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md border border-black/10 text-[#23261f] shadow-xs">
                  {expeditions[3].tag}
                </span>
              </div>

              <div className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-[#E8402A] border border-black/10 flex items-center justify-center text-[#23261f] hover:text-white transition-all shadow-xs">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-white/60 text-xs font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#E8402A]" />
                  <span>{expeditions[3].location}</span>
                </div>
                <h3 className="headline-werlton text-xl sm:text-2xl text-white">
                  {expeditions[3].title}
                </h3>
                <p className="text-xs text-white/70 max-w-lg font-light line-clamp-2">
                  {expeditions[3].subtitle}
                </p>
              </div>
            </Link>
          </CardSpotlight>
        </div>
      </div>
    </section>
  );
}
