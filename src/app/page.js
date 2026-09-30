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
import Scene from '../components/Scene';
import HeritageBento from '../components/HeritageBento';
import { rajasthanFallbackPlaces } from '../data/rajasthanFallbackPlaces';
import { rajasthanCities } from '../data/rajasthanCities';

const DEFAULT_FALLBACK_IMG = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [crowdFilter, setCrowdFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [places, setPlaces] = useState(rajasthanFallbackPlaces);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Listen for folklore modal trigger from Three.js liquid-metal play button
  useEffect(() => {
    const handler = () => setIsVideoModalOpen(true);
    const msgHandler = (e) => {
      if (e.data?.type === 'open-folklore-modal') setIsVideoModalOpen(true);
    };
    window.addEventListener('open-folklore-modal', handler);
    window.addEventListener('message', msgHandler);
    return () => {
      window.removeEventListener('open-folklore-modal', handler);
      window.removeEventListener('message', msgHandler);
    };
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

  return (
    <div className="min-h-screen bg-[#f5f6f1] text-[#23261f] overflow-x-hidden selection:bg-[#E03E3E] selection:text-white relative">
      {/* ═══════════════════════════════════════════════════════
          1. THREE.JS 3D LIVING WORLD HERO (ThreeUI)
         ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[100dvh] overflow-hidden bg-[#383b34]">
        <Scene />
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. SIGNATURE HERITAGE BENTO - 4 Asymmetric Spotlight Tiles
         ═══════════════════════════════════════════════════════ */}
      <div id="heritage-bento">
        <HeritageBento />
      </div>

      {/* ═══════════════════════════════════════════════════════
          3. DISCOVER THE HERITAGE IN A NEW WAY - Light Sanctuary Split
         ═══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 sm:px-12 lg:px-20 overflow-hidden border-t border-b border-black/8 bg-[#edf0e8]/50">
        {/* Soft aerial backdrop image */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img
            src="/images/kumbhalgarh-wall.jpg"
            alt="Backdrop"
            className="w-full h-full object-cover filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-[#f5f6f1]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading + Play CTA + Quote */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-[#23261f] tracking-tight leading-[0.95]">
              DISCOVER THE<br />
              HERITAGE IN A<br />
              <span className="text-[#E03E3E]">NEW WAY</span>
            </h2>

            {/* Play video / audio folklore button */}
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center space-x-3 text-[#23261f] hover:text-[#E03E3E] transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full border-2 border-[#23261f]/40 group-hover:border-[#E03E3E] flex items-center justify-center transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase font-ui">
                WATCH ORAL FOLKLORE ARCHIVE
              </span>
            </button>

            {/* Quote matching the reference */}
            <div className="pt-4 space-y-2 border-t border-black/10 max-w-lg">
              <p className="text-xs text-[#7c8177] italic font-light leading-relaxed">
                "Attachment to things and comfort is the main obstacle to an interesting life. People, as a rule, do not realize that at any time they can throw anything out of their lives. Anytime. Instantly."
              </p>
              <p className="font-script text-xl text-[#E03E3E] tracking-wider font-normal">
                - Carlos Castaneda
              </p>
            </div>
          </div>

          {/* Right Column: 2 Staggered Media Cards with Play Icons */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsVideoModalOpen(true)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-xl border border-black/10 hover:border-black/25 transition-all"
            >
              <img
                src="/images/chand-baori.jpg"
                alt="Chand Baori Stepwell Abhaneri"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#E03E3E] transition-all">
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
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-xl border border-black/10 hover:border-black/25 transition-all sm:translate-y-4"
            >
              <img
                src="/images/pushkar.jpg"
                alt="Pushkar Holy Lake"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#E03E3E] transition-all">
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
          4. PICK THE PLACE - Filter & All Sanctuaries Grid
         ═══════════════════════════════════════════════════════ */}
      <section ref={pickRef} id="pick-the-place" className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
              Curated Sanctuaries · 2025
            </span>
            <h2 className="headline-werlton text-3xl sm:text-5xl text-[#23261f]">
              PICK THE PLACE
            </h2>
          </div>
          <p className="text-xs text-[#7c8177] max-w-xs md:text-right leading-relaxed font-light">
            82 verified royal citadels, subterranean baoris, and living crafts across 13 Rajasthan territories.
          </p>
        </div>

        {/* Sleek Light Sanctuary Filter Bar */}
        <div className="threeui-panel rounded-2xl p-3 sm:p-4 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
            {/* Keyword Search */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-[#7c8177] mb-1">
                Sanctuary / Keyword
              </label>
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-[#7c8177] shrink-0" />
                <input
                  type="text"
                  placeholder="Baori, fort, temple..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#23261f] placeholder-[#7c8177]/60 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Territory */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-[#7c8177] mb-1">
                Territory
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full bg-[#f5f6f1] text-xs font-semibold text-[#23261f] border border-black/10 focus:outline-none cursor-pointer rounded-lg px-2 py-1"
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
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-[#7c8177] mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#f5f6f1] text-xs font-semibold text-[#23261f] border border-black/10 focus:outline-none cursor-pointer rounded-lg px-2 py-1"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Crowd Quotient */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-[#7c8177] mb-1">
                Crowd Quotient
              </label>
              <select
                value={crowdFilter}
                onChange={(e) => setCrowdFilter(e.target.value)}
                className="w-full bg-[#f5f6f1] text-xs font-semibold text-[#23261f] border border-black/10 focus:outline-none cursor-pointer rounded-lg px-2 py-1"
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
              className="inline-flex items-center space-x-2 bg-black/5 hover:bg-black/10 border border-black/10 text-[#23261f] rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-all"
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
        <div className="threeui-card rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#E03E3E]/5 blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E03E3E]/10 border border-[#E03E3E]/20 text-[#E03E3E] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rajasthan Time-Budgeted Concierge</span>
            </div>
            <h3 className="headline-werlton text-2xl sm:text-4xl text-[#23261f]">
              "I AM IN JAIPUR FOR 2 HOURS"
            </h3>
            <p className="text-xs sm:text-sm text-[#7c8177] leading-relaxed font-light">
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
              className="flex items-center justify-center space-x-2 bg-[#f5f6f1] hover:bg-[#ebeee7] border border-black/10 text-[#23261f] rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
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
      <div className="py-10 border-t border-black/10 flex items-center justify-center space-x-8 text-[#7c8177]">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#23261f] transition-colors">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#23261f] transition-colors">
          <Youtube className="w-5 h-5" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#23261f] transition-colors">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#23261f] transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
          <div className="bg-white border border-black/10 text-[#23261f] rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#E03E3E]">
                <Volume2 className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">Oral Folklore Archive</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-[#7c8177] hover:text-[#23261f] text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="headline-werlton text-xl text-[#23261f]">
              The Midnight Exodus of Kuldhara
            </h3>

            <p className="text-xs text-[#555c4e] leading-relaxed font-light">
              In 1825, over a thousand prosperous villagers in 84 surrounding hamlets vanished in a single night from their desert dwellings, leaving behind a binding oral curse that no one could ever inhabit Kuldhara again.
            </p>

            <div className="p-4 rounded-2xl bg-[#f5f6f1] border border-black/8 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#E03E3E] flex items-center justify-center text-white shrink-0">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#23261f]">Audio Dossier · Elder Ballad in Marwari</p>
                <p className="text-[11px] text-[#7c8177]">Recorded at Jaisalmer Desert Encampment · 3m 42s</p>
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
