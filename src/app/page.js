'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Play,
  Volume2,
  Compass,
  Star,
  ChevronRight,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
} from 'lucide-react';
import PlaceCard from '../components/PlaceCard';
import SwadeshiBanner from '../components/SwadeshiBanner';
import AIConciergeModal from '../components/AIConciergeModal';
import { SparklesCore } from '../components/ui/sparkles';
import { BackgroundBeams } from '../components/ui/background-beams';
import { rajasthanFallbackPlaces } from '../data/rajasthanFallbackPlaces';
import { rajasthanCities } from '../data/rajasthanCities';

const DEFAULT_FALLBACK_IMG = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop';

/* ── 5 Hero Slides for the Werlton "TRAVEL TIME" carousel (Verified High-Res Unsplash CDN) ── */
const heroSlides = [
  {
    num: '01',
    title: 'KUMBHALGARH WALLS',
    location: 'Rajsamand, Mewar',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop',
    tagline: '36 kilometers of continuous stone ramparts standing sentinel above the misty Aravalli ridges.',
  },
  {
    num: '02',
    title: 'CHITTORGARH CITADEL',
    location: 'Chittorgarh, Mewar',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?q=80&w=1600&auto=format&fit=crop',
    tagline: 'The grandest fortress of Rajput valor, sacred water kunds, and Vijay Stambha towering in twilight.',
  },
  {
    num: '03',
    title: 'MEHRANGARH CITADEL',
    location: 'Jodhpur, Marwar',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1600&auto=format&fit=crop',
    tagline: 'Perched 400 feet above the blue city, echoing with the ballads of desert balladeers and warrior clans.',
  },
  {
    num: '04',
    title: 'CHAND BAORI STEPS',
    location: 'Abhaneri, Dausa',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop',
    tagline: '3,500 symmetrical geometric steps carved into the subterranean earth to harvest monsoon raindrops.',
  },
  {
    num: '05',
    title: 'SONAR QILA FORT',
    location: 'Jaisalmer, Thar Desert',
    image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1600&auto=format&fit=crop',
    tagline: 'A living golden sandstone citadel where one-quarter of the ancient desert city still resides.',
  },
];

/* ── Popular 4 Tall Tours (exact Werlton 4-column anatomy with High-Res Unsplash CDN) ── */
const popularTours = [
  {
    id: 'tour-1',
    label: 'TOUR 1',
    title: 'MEHRANGARH',
    subtitle: 'Marwar Citadel Circuit',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
    slug: 'mehrangarh-fort-jodhpur',
  },
  {
    id: 'tour-2',
    label: 'TOUR 2',
    title: 'CHAND BAORI',
    subtitle: '3,500 Steps Geometry',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop',
    slug: 'chand-baori-abhaneri',
  },
  {
    id: 'tour-3',
    label: 'TOUR 3',
    title: 'RANIJI KI BAORI',
    subtitle: 'Stepwell of Queen Nathavatji',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop',
    slug: 'raniji-ki-baori-bundi',
  },
  {
    id: 'tour-4',
    label: 'TOUR 4',
    title: 'KULDHARA RUINS',
    subtitle: 'Midnight Exodus Trail',
    image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1200&auto=format&fit=crop',
    slug: 'kuldhara-abandoned-village-jaisalmer',
  },
];

const categories = [
  { name: 'All', icon: '✦' },
  { name: 'Stepwell', icon: '🌊' },
  { name: 'Forgotten Fort', icon: '🏰' },
  { name: 'Ancient Temple', icon: '🛕' },
  { name: 'Living Crafts & Handloom', icon: '🧵' },
];

export default function HomePage() {
  const router = useRouter();
  const pickRef = useRef(null);

  const [activeSlide, setActiveSlide] = useState(2); // Slide 03 default matching screenshot
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [crowdFilter, setCrowdFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [places, setPlaces] = useState(rajasthanFallbackPlaces);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Auto rotate hero slide every 7s
  useEffect(() => {
    const t = setInterval(() => {
      setActiveSlide((i) => (i + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  // Fetch live API data if available
  useEffect(() => {
    fetch('/api/places?state=Rajasthan')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.length) setPlaces(d.data);
      })
      .catch(() => {});
  }, []);

  // Client-side filtering logic
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      if (cityFilter !== 'All' && !p.district.toLowerCase().includes(cityFilter.toLowerCase()))
        return false;
      if (crowdFilter === 'Zero Crowd' && p.isMajor) return false;
      if (crowdFilter === 'Moderate' && !p.isMajor) return false;
      if (categoryFilter !== 'All' && p.category.toLowerCase() !== categoryFilter.toLowerCase())
        return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.district.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [places, cityFilter, crowdFilter, categoryFilter, searchTerm]);

  const currentSlide = heroSlides[activeSlide];

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white overflow-x-hidden selection:bg-[#E03E3E] selection:text-white relative">
      {/* ═══════════════════════════════════════════════════════
          1. HERO SECTION  — Exact Werlton "TRAVEL TIME" Theme
         ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-6 sm:px-12 lg:px-20 overflow-hidden">
        {/* Full-bleed background images with cinematic crossfade */}
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.num}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_FALLBACK_IMG;
              }}
              className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.1]"
            />
            {/* Atmospheric gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>
        ))}

        {/* Ambient Aceternity Background Beams & Sparkles Core */}
        <BackgroundBeams className="opacity-40" />
        <SparklesCore
          id="heroSparkles"
          background="transparent"
          minSize={1}
          maxSize={2.5}
          particleDensity={30}
          particleColor="#E03E3E"
          className="z-5"
        />

        {/* ── TOP HERO CONTENT: Title, poem, and vertical 01-05 index ── */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-8 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Huge Headline + Atmospheric Poem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block">
                Hide India · Royal Sanctuary Archive
              </span>
              <h1 className="headline-werlton text-[clamp(3.2rem,8vw,7rem)] text-white tracking-tight leading-[0.9]">
                TRAVEL TIME
              </h1>
            </div>

            {/* Poetic quote matching the reference with Lemon Tuesday script accent */}
            <div className="space-y-1 text-white/80 text-sm sm:text-base font-light max-w-md leading-relaxed border-l-2 border-[#E03E3E] pl-4">
              <p>Don't let the loud noise scare you,</p>
              <p>Let the rhythms of the dance amuse you.</p>
              <p>You are given a very rare chance</p>
              <p className="font-script text-2xl sm:text-3xl text-white block pt-1 tracking-wide font-normal">
                Feel the movement of our ancestors
              </p>
            </div>

            {/* Action Buttons according to user requirements */}
            <div className="flex items-center space-x-4 pt-2">
              <Link
                href="/planner"
                className="inline-flex items-center space-x-2 bg-[#E03E3E] hover:bg-[#c93232] text-white px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-[#E03E3E]/30 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>AI ROUTE PLANNER</span>
              </Link>
              <Link
                href="/contribute"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md transition-all active:scale-95"
              >
                <span>ADD SANCTUARY</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E03E3E]" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Exact 01-05 Vertical Carousel Selector */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end space-y-4 pt-4">
            {heroSlides.map((slide, idx) => {
              const isActive = idx === activeSlide;
              return (
                <button
                  key={slide.num}
                  onClick={() => setActiveSlide(idx)}
                  className={`group flex items-center space-x-3 text-right cursor-pointer transition-all duration-300 ${
                    isActive ? 'scale-105' : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <span
                    className={`font-mono text-sm sm:text-base font-bold transition-colors ${
                      isActive ? 'text-[#E03E3E]' : 'text-white'
                    }`}
                  >
                    {slide.num}
                  </span>
                  <div
                    className={`transition-all duration-300 rounded-full ${
                      isActive
                        ? 'w-16 h-[2px] bg-white'
                        : 'w-4 h-[1px] bg-white/20 group-hover:w-8 group-hover:bg-white/50'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM HERO ROW: 3 Micro-Features with "MORE DETAILED →" ── */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pb-4">
            {/* Feature 1 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-white">
                <MapPin className="w-4 h-4 text-[#E03E3E] shrink-0" />
                <h4 className="font-bold text-xs tracking-wider uppercase">Subterranean Baoris</h4>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed font-light">
                Ancient stepwells carved with geometric steps and cool subterranean sanctuary chambers.
              </p>
              <Link
                href="/hidden-gems"
                className="inline-flex items-center space-x-1.5 text-[11px] font-bold tracking-wider text-white hover:text-[#E03E3E] uppercase transition-colors pt-1"
              >
                <span>MORE DETAILED</span>
                <span className="text-[#E03E3E]">→</span>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-white">
                <MapPin className="w-4 h-4 text-[#E03E3E] shrink-0" />
                <h4 className="font-bold text-xs tracking-wider uppercase">Sovereign Citadels</h4>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed font-light">
                Unconquered hilltop fortresses of Mewar & Marwar overlooking misty dawn valleys.
              </p>
              <Link
                href="/landmarks"
                className="inline-flex items-center space-x-1.5 text-[11px] font-bold tracking-wider text-white hover:text-[#E03E3E] uppercase transition-colors pt-1"
              >
                <span>MORE DETAILED</span>
                <span className="text-[#E03E3E]">→</span>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-white">
                <MapPin className="w-4 h-4 text-[#E03E3E] shrink-0" />
                <h4 className="font-bold text-xs tracking-wider uppercase">Living GI Guilds</h4>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed font-light">
                Centuries-old block printing and blue pottery masters in artisan heritage lanes.
              </p>
              <Link
                href="/crafts"
                className="inline-flex items-center space-x-1.5 text-[11px] font-bold tracking-wider text-white hover:text-[#E03E3E] uppercase transition-colors pt-1"
              >
                <span>MORE DETAILED</span>
                <span className="text-[#E03E3E]">→</span>
              </Link>
            </div>
          </div>

          {/* Red accent line spanning across bottom */}
          <div className="w-full h-[1px] bg-white/10 relative mt-4">
            <div className="absolute top-0 left-0 w-24 h-[2px] bg-[#E03E3E]" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. POPULAR TOURS SECTION  — 4 Tall Vertical Cards (Aceternity UI / Framer Motion Hover)
         ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20 lg:py-28">
        <div className="text-center mb-14 space-y-2">
          <h2 className="headline-werlton text-2xl sm:text-3xl lg:text-4xl text-white tracking-widest">
            POPULAR TOURS
          </h2>
          <p className="text-xs text-white/50 tracking-wider uppercase font-medium">
            Curated expedition circuits for discerning heritage explorers
          </p>
        </div>

        {/* 4 Tall Vertical Cards with Framer Motion hover & shine */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTours.map((tour, idx) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-3xl overflow-hidden aspect-[9/16] sm:aspect-[3/5] cursor-pointer shadow-2xl border border-white/10 hover:border-[#E03E3E]/60 transition-all duration-500 hover:shadow-black/80"
            >
              <Link href={`/place/${tour.slug}`} className="block w-full h-full">
                <img
                  src={tour.image}
                  alt={tour.title}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_FALLBACK_IMG;
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.75] contrast-[1.05]"
                />

                {/* Dark bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Moving hover glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#E03E3E]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Bottom text: TOUR X + Title + Subtitle */}
                <div className="absolute bottom-6 left-5 right-5 text-center space-y-1.5 z-10">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#E03E3E] uppercase block">
                    {tour.label}
                  </span>
                  <h3 className="headline-werlton text-lg sm:text-2xl text-white tracking-wider">
                    {tour.title}
                  </h3>
                  <p className="text-[11px] text-white/70 font-light truncate">
                    {tour.subtitle}
                  </p>
                </div>

                {/* Subtle top indicator dot */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#E03E3E] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. DISCOVER THE WORLD IN A NEW WAY  — Dark Nature Split with Verified High-Res Media
         ═══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 sm:px-12 lg:px-20 overflow-hidden border-t border-b border-white/5">
        {/* Dark forest/aerial backdrop image */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img
            src="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?q=80&w=1600&auto=format&fit=crop"
            alt="Backdrop"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_FALLBACK_IMG;
            }}
            className="w-full h-full object-cover filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-[#0A0B0E]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading + Play CTA + Quote */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[0.95]">
              DISCOVER THE<br />
              HERITAGE IN A<br />
              <span className="text-[#E03E3E]">NEW WAY</span>
            </h2>

            {/* Play video / audio folklore button */}
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center space-x-3 text-white hover:text-[#E03E3E] transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full border-2 border-white/60 group-hover:border-[#E03E3E] flex items-center justify-center transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase font-ui">
                WATCH ORAL FOLKLORE ARCHIVE
              </span>
            </button>

            {/* Quote matching the reference */}
            <div className="pt-4 space-y-2 border-t border-white/10 max-w-lg">
              <p className="text-xs text-white/60 italic font-light leading-relaxed">
                "Attachment to things and comfort is the main obstacle to an interesting life. People, as a rule, do not realize that at any time they can throw anything out of their lives. Anytime. Instantly."
              </p>
              <p className="font-script text-xl text-[#E03E3E] tracking-wider font-normal">
                — Carlos Castaneda
              </p>
            </div>
          </div>

          {/* Right Column: 2 Staggered Media Cards with Play Icons (High-Res Images with onError fallback) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsVideoModalOpen(true)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-xl border border-white/10 hover:border-white/30 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop"
                alt="Chand Baori Stepwell"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_FALLBACK_IMG;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#E03E3E] transition-all">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="text-xs font-bold text-white tracking-wide">Abhaneri Sacred Geometry</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsVideoModalOpen(true)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-xl border border-white/10 hover:border-white/30 transition-all sm:translate-y-4"
            >
              <img
                src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop"
                alt="Pushkar Holy Lake"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_FALLBACK_IMG;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#E03E3E] transition-all">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="text-xs font-bold text-white tracking-wide">Pushkar Evening Chants</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. PICK THE PLACE  — Filter & All Sanctuaries Grid
         ═══════════════════════════════════════════════════════ */}
      <section ref={pickRef} id="pick-the-place" className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
              Curated Sanctuaries · 2025
            </span>
            <h2 className="headline-werlton text-3xl sm:text-5xl text-white">
              PICK THE PLACE
            </h2>
          </div>
          <p className="text-xs text-white/50 max-w-xs md:text-right leading-relaxed font-light">
            82 verified royal citadels, subterranean baoris, and living crafts across 13 Rajasthan territories.
          </p>
        </div>

        {/* Sleek Dark Filter Bar */}
        <div className="bg-[#121318] rounded-2xl border border-white/10 shadow-2xl p-3 sm:p-4 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
            {/* Keyword Search */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-white/40 mb-1">
                Sanctuary / Keyword
              </label>
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Baori, fort, temple..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Territory */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-white/40 mb-1">
                Territory
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full bg-[#121318] text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="All">All 13 Regions</option>
                {['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer', 'Bundi', 'Pushkar', 'Bikaner', 'Shekhawati', 'Chittorgarh', 'Kumbhalgarh', 'Alwar'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-white/40 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#121318] text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Crowd Quotient */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-white/40 mb-1">
                Crowd Quotient
              </label>
              <select
                value={crowdFilter}
                onChange={(e) => setCrowdFilter(e.target.value)}
                className="w-full bg-[#121318] text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Zero Crowd">Zero Crowd Only</option>
                <option value="Moderate">Crown Landmarks</option>
              </select>
            </div>

            {/* Discover CTA */}
            <div className="px-1">
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E03E3E]/20 cursor-pointer"
              >
                Discover ({filteredPlaces.length})
              </button>
            </div>
          </div>
        </div>

        {/* Places Grid with Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.slice(0, 12).map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {filteredPlaces.length > 12 && (
          <div className="text-center mt-12">
            <Link
              href="/explore"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>Explore All {filteredPlaces.length} Destinations</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E03E3E]" />
            </Link>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. AI CONCIERGE BANNER
         ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12">
        <div className="bg-[#121318] rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#E03E3E]/10 blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E03E3E]/15 border border-[#E03E3E]/30 text-[#E03E3E] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rajasthan Time-Budgeted Concierge</span>
            </div>
            <h3 className="headline-werlton text-2xl sm:text-4xl text-white">
              "I AM IN JAIPUR FOR 2 HOURS"
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
              Tell our AI how much time you have. It instantly calculates transit times and returns a zero-crowd itinerary of stepwells, artisans, and oral legend sites.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full lg:w-auto shrink-0">
            <Link
              href="/planner"
              className="flex items-center justify-center space-x-2 bg-[#E03E3E] hover:bg-[#c93232] text-white rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E03E3E]/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Open AI Route Planner</span>
            </Link>
            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Quick Concierge Chat</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E03E3E]" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. SOCIAL ICONS STRIP
         ═══════════════════════════════════════════════════════ */}
      <div className="py-10 border-t border-white/10 flex items-center justify-center space-x-8 text-white/40">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
          <Youtube className="w-5 h-5" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
          <Facebook className="w-5 h-5" />
        </a>
      </div>

      <SwadeshiBanner />

      <AIConciergeModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialQuery=""
      />

      {/* Video / Audio Folklore Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#121318] border border-white/15 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#E03E3E]">
                <Volume2 className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">Oral Folklore Archive</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-white/40 hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="headline-werlton text-xl text-white">
              The Midnight Exodus of Kuldhara
            </h3>

            <p className="text-xs text-white/70 leading-relaxed font-light">
              In 1825, over a thousand prosperous villagers in 84 surrounding hamlets vanished in a single night from their desert dwellings, leaving behind a binding oral curse that no one could ever inhabit Kuldhara again.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#E03E3E] flex items-center justify-center text-white shrink-0">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Audio Dossier · Elder Ballad in Marwari</p>
                <p className="text-[11px] text-white/50">Recorded at Jaisalmer Desert Encampment · 3m 42s</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/stories"
                className="px-5 py-2.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-[#E03E3E]/30 transition-all"
              >
                Read All 10 Oral Legends →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
