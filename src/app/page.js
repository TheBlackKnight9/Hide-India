'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { rajasthanFallbackPlaces } from '../data/rajasthanFallbackPlaces';
import { rajasthanCities } from '../data/rajasthanCities';

/* ── 5 Hero Slides for the Werlton "TRAVEL TIME" carousel ── */
const heroSlides = [
  {
    num: '01',
    title: 'KUMBHALGARH WALLS',
    location: 'Rajsamand, Mewar',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kumbhalgarh_Fort_Wall.jpg/1280px-Kumbhalgarh_Fort_Wall.jpg',
    tagline: '36 kilometers of continuous stone ramparts standing sentinel above the misty Aravalli ridges.',
  },
  {
    num: '02',
    title: 'CHITTORGARH CITADEL',
    location: 'Chittorgarh, Mewar',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Chittorgarh_fort.JPG/1280px-Chittorgarh_fort.JPG',
    tagline: 'The grandest fortress of Rajput valor, sacred water kunds, and Vijay Stambha towering in twilight.',
  },
  {
    num: '03',
    title: 'MEHRANGARH CITADEL',
    location: 'Jodhpur, Marwar',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Mehrangarh_Fort_sanhita.jpg',
    tagline: 'Perched 400 feet above the blue city, echoing with the ballads of desert balladeers and warrior clans.',
  },
  {
    num: '04',
    title: 'CHAND BAORI STEPS',
    location: 'Abhaneri, Dausa',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Chand_Baori_Stepwell_in_Abhaneri.jpg/1280px-Chand_Baori_Stepwell_in_Abhaneri.jpg',
    tagline: '3,500 symmetrical geometric steps carved into the subterranean earth to harvest monsoon raindrops.',
  },
  {
    num: '05',
    title: 'SONAR QILA FORT',
    location: 'Jaisalmer, Thar Desert',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/1280px-Jaisalmer_forteresse.jpg',
    tagline: 'A living golden sandstone citadel where one-quarter of the ancient desert city still resides.',
  },
];

/* ── Popular 4 Tall Tours (exact Werlton 4-column anatomy) ── */
const popularTours = [
  {
    id: 'tour-1',
    label: 'TOUR 1',
    title: 'MEHRANGARH',
    subtitle: 'Marwar Citadel Circuit',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Mehrangarh_Fort_sanhita.jpg',
    slug: 'mehrangarh-fort-jodhpur',
  },
  {
    id: 'tour-2',
    label: 'TOUR 2',
    title: 'CHAND BAORI',
    subtitle: '3,500 Steps Geometry',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Chand_Baori_Stepwell_in_Abhaneri.jpg/1280px-Chand_Baori_Stepwell_in_Abhaneri.jpg',
    slug: 'chand-baori-abhaneri',
  },
  {
    id: 'tour-3',
    label: 'TOUR 3',
    title: 'RANIJI KI BAORI',
    subtitle: 'Stepwell of Queen Nathavatji',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Raniji_ki_Baori%2C_Bundi_2011-12-26_EK_II.jpg/1280px-Raniji_ki_Baori%2C_Bundi_2011-12-26_EK_II.jpg',
    slug: 'raniji-ki-baori-bundi',
  },
  {
    id: 'tour-4',
    label: 'TOUR 4',
    title: 'KULDHARA RUINS',
    subtitle: 'Midnight Exodus Trail',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Kuldhara%2C_an_abandoned_village_%2830738705327%29.jpg/1280px-Kuldhara%2C_an_abandoned_village_%2830738705327%29.jpg',
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

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      if (cityFilter !== 'All') {
        const d = cityFilter.toLowerCase();
        const pd = p.district.toLowerCase();
        if (!pd.includes(d) && !d.includes(pd)) return false;
      }
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
    <div className="min-h-screen bg-[#0A0B0E] text-white overflow-x-hidden selection:bg-[#E03E3E] selection:text-white">
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
              className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.1]"
            />
            {/* Atmospheric gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
          </div>
        ))}

        {/* ── TOP HERO CONTENT: Title, poem, and vertical 01-05 index ── */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-8 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Huge Headline + Atmospheric Poem */}
          <div className="lg:col-span-8 space-y-6">
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
                <span>PLAN WITH AI</span>
              </Link>

              <button
                onClick={() => {
                  pickRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span>EXPLORE ROUTES</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E03E3E]" />
              </button>
            </div>
          </div>

          {/* Right Column: Vertical 01-05 Carousel Indicator (exact match) */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end space-y-4 pt-4">
            {heroSlides.map((slide, idx) => {
              const isActive = idx === activeSlide;
              return (
                <button
                  key={slide.num}
                  onClick={() => setActiveSlide(idx)}
                  className="group flex items-center space-x-3 text-right cursor-pointer transition-all"
                >
                  <span
                    className={`text-xs font-bold tracking-wider transition-colors ${
                      isActive ? 'text-white text-sm' : 'text-white/40 group-hover:text-white/80'
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
          2. POPULAR TOURS SECTION  — 4 Tall Vertical Cards
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

        {/* 4 Tall Vertical Cards matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTours.map((tour) => (
            <Link
              key={tour.id}
              href={`/place/${tour.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[9/16] sm:aspect-[3/5] cursor-pointer shadow-2xl border border-white/10 hover:border-[#E03E3E]/60 transition-all duration-500 hover:-translate-y-2"
            >
              <img
                src={tour.image}
                alt={tour.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.75] contrast-[1.05]"
              />

              {/* Dark bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Bottom text: TOUR X + Title + Subtitle */}
              <div className="absolute bottom-6 left-5 right-5 text-center space-y-1">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E03E3E] uppercase block">
                  {tour.label}
                </span>
                <h3 className="headline-werlton text-lg sm:text-xl text-white tracking-wider">
                  {tour.title}
                </h3>
                <p className="text-[11px] text-white/60 font-light truncate">
                  {tour.subtitle}
                </p>
              </div>

              {/* Subtle top indicator */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#E03E3E] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. DISCOVER THE WORLD IN A NEW WAY  — Dark Nature Split
         ═══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 sm:px-12 lg:px-20 overflow-hidden border-t border-b border-white/5">
        {/* Dark forest/aerial backdrop image */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kumbhalgarh_Fort_Wall.jpg/1280px-Kumbhalgarh_Fort_Wall.jpg"
            alt="Backdrop"
            className="w-full h-full object-cover filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-[#0A0B0E]/85" />
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
              <span className="text-xs font-bold tracking-widest uppercase">
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

          {/* Right Column: 2 Staggered Media Cards with Play Icons */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setIsVideoModalOpen(true)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-xl border border-white/10 hover:border-white/30 transition-all"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Chand_Baori_Stepwell_in_Abhaneri.jpg/1280px-Chand_Baori_Stepwell_in_Abhaneri.jpg"
                alt="Chand Baori"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="text-xs font-bold text-white">Abhaneri Sacred Geometry</p>
              </div>
            </div>

            <div
              onClick={() => setIsVideoModalOpen(true)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-xl border border-white/10 hover:border-white/30 transition-all sm:translate-y-4"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg/1280px-Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg"
                alt="Pushkar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="text-xs font-bold text-white">Pushkar Evening Chants</p>
              </div>
            </div>
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

        {/* Places Grid */}
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
        <div className="bg-[#121318] rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
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
          6. SOCIAL ICONS STRIP (matching bottom of reference image)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
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
                className="px-5 py-2.5 rounded-full bg-[#E03E3E] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-[#E03E3E]/30"
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
