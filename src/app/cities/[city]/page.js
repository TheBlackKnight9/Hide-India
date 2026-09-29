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
    <div className="min-h-screen bg-[#0A0B0E] text-white pb-24">
      {/* ─────────────────────────────────────────────────────────────
          1. CINEMATIC CITY HERO WITH DOCKED FILTER CAPSULE
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex flex-col justify-between p-6 sm:p-12 overflow-hidden bg-stone-950">
        <img
          src={city.image}
          alt={city.name}
          className="absolute inset-0 w-full h-full object-cover scale-102 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />

        {/* Top Breadcrumb Navigation */}
        <div className="relative z-10 pt-20 flex items-center justify-between">
          <Link
            href="/cities"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Rajasthan Territories</span>
          </Link>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15 backdrop-blur-md shadow-xs">
            {city.title}
          </span>
        </div>

        {/* Hero Title Block */}
        <div className="relative z-10 max-w-4xl my-auto text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E03E3E]/20 text-[#E03E3E] border border-[#E03E3E]/30 text-xs font-semibold mb-3 backdrop-blur-md">
            <span>🏛️ Royal Territory</span>
            <span className="opacity-60">·</span>
            <span>{city.era}</span>
          </div>

          <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-tight uppercase">
            {city.name}
          </h1>

          <p className="font-sans text-base sm:text-xl text-white/70 font-light max-w-2xl mt-3 leading-relaxed drop-shadow">
            {city.tagline}
          </p>
        </div>

        {/* Docked Stats Capsule */}
        <div className="relative z-10 w-full max-w-4xl mx-auto -mb-16">
          <div className="bg-[#121318] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x-0 md:divide-x divide-white/5">
              <div className="p-1">
                <p className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
                  {cityPlaces.length}
                </p>
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mt-0.5">
                  Documented Sites
                </p>
              </div>
              <div className="p-1">
                <p className="font-sans text-2xl sm:text-3xl font-extrabold text-[#3EBFA0]">
                  {hiddenPlaces.length}
                </p>
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mt-0.5">
                  Zero-Crowd Gems
                </p>
              </div>
              <div className="p-1">
                <p className="font-sans text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {majorPlaces.length}
                </p>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                  Major Landmarks
                </p>
              </div>
              <div className="p-1">
                <p className="font-sans text-2xl sm:text-3xl font-extrabold text-amber-700">
                  {city.crafts.length}
                </p>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
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
        {/* Header matching reference */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{city.name} Cultural Circuit</span>
            </div>
            <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900">
              Pick the Place in {city.name}
            </h2>
          </div>

          <p className="text-sm text-stone-500 max-w-sm md:text-right leading-relaxed">
            {city.overview}
          </p>
        </div>

        {/* FLOATING FILTER BAR MATCHING SCREENSHOT */}
        <div className="bg-[#121318] rounded-2xl border border-white/10 shadow-2xl p-3 sm:p-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {/* Filter 1: Place search */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                Sanctuary Name
              </label>
              <div className="flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder={`Search ${city.name} places...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Filter 2: Category */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                Heritage Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#121318] text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Stepwell">Stepwells (Baoris)</option>
                <option value="Forgotten Fort">Forts & Citadels</option>
                <option value="Ancient Temple">Ancient Temples</option>
                <option value="Living Crafts & Handloom">Living Crafts</option>
              </select>
            </div>

            {/* Filter 3: Tab Selector */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                Crowd Quotient
              </label>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full bg-[#121318] text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Sites ({cityPlaces.length})</option>
                <option value="hidden">Zero-Crowd Gems ({hiddenPlaces.length})</option>
                <option value="major">Major Landmarks ({majorPlaces.length})</option>
              </select>
            </div>

            {/* Filter 4: Discover Action */}
            <div className="px-1">
              <button
                type="button"
                className="w-full py-2.5 px-5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E03E3E]/20 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Discover ({filteredPlaces.length})</span>
              </button>
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
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-sans font-bold text-base text-stone-800">
              No matching sanctuaries in {city.name}
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Reset the category or crowd filter to explore all {cityPlaces.length} documented sites.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold cursor-pointer"
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
          <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Atmanirbhar Bharat · Swadeshi Lineage
              </span>
              <h3 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                GI Tagged Crafts of {city.name}
              </h3>
              <p className="text-stone-300 text-sm mt-2 leading-relaxed">
                Generational artisan communities creating royal masterpieces. Buy directly from clusters without retail markups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cityCrafts.map((craft) => (
                <div
                  key={craft.slug}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      {craft.giTag}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      📍 {craft.artisanClusters}
                    </span>
                  </div>
                  <h4 className="font-sans text-lg font-bold text-white mb-2">
                    {craft.name}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed mb-4">
                    {craft.description}
                  </p>
                  <div className="text-[11px] text-amber-200/90 pt-3 border-t border-white/10">
                    <span className="font-semibold">Associated Heritage:</span>{' '}
                    {craft.monuments.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/crafts"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-300 hover:text-white uppercase tracking-wider"
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
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-stone-200 pt-8 gap-4">
          <div>
            <h4 className="font-sans font-bold text-lg text-stone-900">
              Explore More Royal Territories
            </h4>
            <p className="text-xs text-stone-500">
              Discover other sovereign dynasties, stepwells, and desert landscapes
            </p>
          </div>
          <Link
            href="/cities"
            className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs inline-flex items-center space-x-1.5 transition-all"
          >
            <span>View All 13 Territories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
