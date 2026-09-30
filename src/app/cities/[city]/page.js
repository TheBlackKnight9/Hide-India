'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  Sparkles,
  ArrowLeft,
  Calendar,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  Search,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import PlaceCard from '../../../components/PlaceCard';
import { rajasthanCities } from '../../../data/rajasthanCities';
import { rajasthanFallbackPlaces } from '../../../data/rajasthanFallbackPlaces';
import { rajasthanCrafts } from '../../../data/rajasthanCrafts';

export default function CityDetailPage({ params }) {
  const citySlug = params.city?.toLowerCase();
  const city = rajasthanCities.find(
    (c) => c.slug === citySlug || c.name.toLowerCase() === citySlug
  );

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'hidden', 'major'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!city) {
    return notFound();
  }

  // Filter places for this city
  const cityPlaces = useMemo(() => {
    return rajasthanFallbackPlaces.filter((p) => {
      const cityName = city.name.toLowerCase();
      const district = p.district.toLowerCase();
      return (
        district.includes(cityName) ||
        cityName.includes(district) ||
        p.title.toLowerCase().includes(cityName) ||
        p.tagline?.toLowerCase().includes(cityName)
      );
    });
  }, [city]);

  const hiddenPlaces = useMemo(() => cityPlaces.filter((p) => !p.isMajor), [cityPlaces]);
  const majorPlaces = useMemo(() => cityPlaces.filter((p) => p.isMajor), [cityPlaces]);

  const filteredPlaces = useMemo(() => {
    return cityPlaces.filter((place) => {
      if (activeTab === 'hidden' && place.isMajor) return false;
      if (activeTab === 'major' && !place.isMajor) return false;
      if (selectedCategory !== 'All' && place.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = place.title.toLowerCase().includes(q);
        const matchTagline = place.tagline?.toLowerCase().includes(q);
        const matchDynasty = place.dynasty?.toLowerCase().includes(q);
        if (!matchTitle && !matchTagline && !matchDynasty) return false;
      }
      return true;
    });
  }, [cityPlaces, activeTab, selectedCategory, searchQuery]);

  // Filter crafts for this city
  const cityCrafts = useMemo(() => {
    return rajasthanCrafts.filter(
      (c) =>
        c.city.toLowerCase().includes(city.name.toLowerCase()) ||
        city.name.toLowerCase().includes(c.city.toLowerCase())
      );
  }, [city]);

  return (
    <div className="min-h-screen bg-[#f5f6f1] text-[#23261f] pb-24 selection:bg-[#E03E3E] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. CINEMATIC CITY HERO WITH DOCKED FILTER CAPSULE
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex flex-col justify-between p-6 sm:p-12 overflow-hidden bg-black">
        <img
          src={city.image}
          alt={city.name}
          className="absolute inset-0 w-full h-full object-cover scale-102 transition-transform duration-1000 filter brightness-[0.6] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5f6f1] via-black/40 to-black/60 pointer-events-none" />

        {/* Top Breadcrumb Navigation */}
        <div className="relative z-10 pt-20 flex items-center justify-between">
          <Link
            href="/cities"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Rajasthan Territories</span>
          </Link>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white border border-white/25 backdrop-blur-md shadow-xs">
            {city.title}
          </span>
        </div>

        {/* Hero Title Block */}
        <div className="relative z-10 max-w-4xl my-auto text-left">
          <div className="ghost-watermark -bottom-12 -left-8 opacity-10 select-none pointer-events-none text-white">
            {city.name.toUpperCase()}
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E03E3E]/30 text-white border border-[#E03E3E]/50 text-xs font-semibold mb-3 backdrop-blur-md">
            <span>🏛️ Royal Territory</span>
            <span className="opacity-60">·</span>
            <span>{city.era}</span>
          </div>

          <h1 className="headline-werlton text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-md">
            {city.name}
          </h1>

          <p className="font-sans text-base sm:text-xl text-white/90 font-light max-w-2xl mt-3 leading-relaxed drop-shadow">
            {city.tagline}
          </p>
        </div>

        {/* Docked Stats Capsule */}
        <div className="relative z-10 w-full max-w-4xl mx-auto -mb-16">
          <div className="threeui-card p-5 sm:p-6 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x-0 md:divide-x divide-black/8">
              <div className="p-1">
                <p className="font-sans text-2xl sm:text-3xl font-extrabold text-[#23261f]">
                  {cityPlaces.length}
                </p>
                <p className="text-[10px] font-semibold text-[#7c8177] uppercase tracking-wider mt-0.5">
                  Documented Sites
                </p>
              </div>
              <div className="p-1">
                <p className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1b8a6b]">
                  {hiddenPlaces.length}
                </p>
                <p className="text-[10px] font-semibold text-[#7c8177] uppercase tracking-wider mt-0.5">
                  Zero-Crowd Gems
                </p>
              </div>
              <div className="p-1">
                <p className="font-sans text-2xl sm:text-3xl font-extrabold text-[#23261f]">
                  {majorPlaces.length}
                </p>
                <p className="text-[10px] font-semibold text-[#7c8177] uppercase tracking-wider mt-0.5">
                  Major Landmarks
                </p>
              </div>
              <div className="p-1">
                <p className="font-sans text-2xl sm:text-3xl font-extrabold text-[#E03E3E]">
                  {city.crafts.length}
                </p>
                <p className="text-[10px] font-semibold text-[#7c8177] uppercase tracking-wider mt-0.5">
                  GI-Tagged Crafts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SECTION: "PICK THE PLACE IN [CITY]"
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold text-[#E03E3E] uppercase tracking-wider block mb-1">
              {city.name} Cultural Circuit
            </span>
            <h2 className="headline-werlton text-3xl sm:text-5xl font-extrabold tracking-tight text-[#23261f]">
              Pick the Place in {city.name}
            </h2>
          </div>

          <p className="text-sm text-[#7c8177] max-w-sm md:text-right leading-relaxed font-light">
            {city.overview}
          </p>
        </div>

        {/* FLOATING FILTER BAR */}
        <div className="threeui-panel p-3 sm:p-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {/* Filter 1: Place search */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#7c8177] mb-0.5">
                Sanctuary Name
              </label>
              <div className="flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5 text-[#7c8177] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter name or dynasty..."
                  className="w-full bg-transparent text-xs text-[#23261f] placeholder-[#7c8177]/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Filter 2: Category */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#7c8177] mb-0.5">
                Heritage Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs text-[#23261f] font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Heritage Types</option>
                <option value="Stepwell">Subterranean Baoris</option>
                <option value="Fort">Hill Bastions & Citadels</option>
                <option value="Palace">Royal Sanctuaries</option>
                <option value="Temple">Sacred Shrines</option>
                <option value="Craft">Living GI Craft Clusters</option>
              </select>
            </div>

            {/* Filter 3: Tab Selector (ThreeUI Sylva Dock) */}
            <div className="px-3 py-1 flex items-center justify-between sm:col-span-2">
              <div className="sylva-dock w-full justify-between">
                <button
                  onClick={() => setActiveTab('all')}
                  className={activeTab === 'all' ? 'sylva-pill-active flex-1 justify-center' : 'sylva-dock-item flex-1 justify-center'}
                >
                  <span>All ({cityPlaces.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('hidden')}
                  className={activeTab === 'hidden' ? 'sylva-pill-active flex-1 justify-center' : 'sylva-dock-item flex-1 justify-center'}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1b8a6b]" />
                  <span>Zero-Crowd ({hiddenPlaces.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('major')}
                  className={activeTab === 'major' ? 'sylva-pill-active flex-1 justify-center' : 'sylva-dock-item flex-1 justify-center'}
                >
                  <span>Landmarks ({majorPlaces.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/10 p-8 shadow-xl">
            <Compass className="w-12 h-12 text-black/20 mx-auto mb-3" />
            <h3 className="headline-werlton text-lg text-[#23261f]">
              No matching sanctuaries in {city.name}
            </h3>
            <p className="text-xs text-[#7c8177] mt-1 max-w-sm mx-auto font-light">
              Reset the category or crowd filter to explore all {cityPlaces.length} documented sites.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-[#E03E3E]/30 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. LIVING CRAFTS OF THIS ROYAL REGION
         ───────────────────────────────────────────────────────────── */}
      {cityCrafts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="threeui-card p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E03E3E] block mb-1">
                Atmanirbhar Bharat · Swadeshi Lineage
              </span>
              <h3 className="headline-werlton text-2xl sm:text-4xl font-extrabold tracking-tight text-[#23261f]">
                GI Tagged Crafts of {city.name}
              </h3>
              <p className="text-[#555c4e] text-sm mt-2 leading-relaxed font-light">
                Generational artisan communities creating royal masterpieces. Buy directly from clusters without retail markups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cityCrafts.map((craft) => (
                <div
                  key={craft.slug}
                  className="bg-[#f5f6f1] border border-black/8 rounded-2xl p-6 hover:bg-[#ebeee7] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E03E3E]">
                      {craft.giTag}
                    </span>
                    <span className="text-[11px] text-[#7c8177]">
                      📍 {craft.artisanClusters}
                    </span>
                  </div>
                  <h4 className="headline-werlton text-lg text-[#23261f] mb-2">
                    {craft.name}
                  </h4>
                  <p className="text-xs text-[#555c4e] leading-relaxed mb-4 font-light">
                    {craft.description}
                  </p>
                  <div className="text-[11px] text-[#7c8177] pt-3 border-t border-black/10">
                    <span className="font-semibold text-[#23261f]">Associated Heritage:</span>{' '}
                    {craft.monuments.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/crafts"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-[#E03E3E] hover:text-[#23261f] uppercase tracking-wider transition-colors"
              >
                <span>Explore All Rajasthan GI Crafts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. EXPLORE OTHER REGIONS
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-black/10 pt-8 gap-4">
          <div>
            <h4 className="headline-werlton text-lg text-[#23261f]">
              Explore More Royal Territories
            </h4>
            <p className="text-xs text-[#7c8177] font-light">
              Discover other sovereign dynasties, stepwells, and desert landscapes
            </p>
          </div>
          <Link
            href="/cities"
            className="px-6 py-3 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E03E3E]/30 inline-flex items-center space-x-1.5 transition-all"
          >
            <span>View All 13 Territories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
