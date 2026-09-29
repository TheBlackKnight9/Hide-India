'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Compass, ArrowRight } from 'lucide-react';
import PlaceCard from '../../components/PlaceCard';
import { rajasthanFallbackPlaces } from '../../data/rajasthanFallbackPlaces';

const districts = [
  'All',
  'Jaipur',
  'Jodhpur',
  'Udaipur',
  'Jaisalmer',
  'Bundi',
  'Pushkar',
  'Ajmer',
  'Bikaner',
  'Shekhawati',
  'Chittorgarh',
  'Kumbhalgarh',
  'Alwar',
  'Dausa',
];

const categories = [
  'All',
  'Stepwell',
  'Forgotten Fort',
  'Ancient Temple',
  'Living Crafts & Handloom',
  'Wildlife Sanctuary',
  'Royal Cenotaph',
  'Desert Heritage',
];

export default function HiddenGemsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPace, setSelectedPace] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const hiddenPlaces = useMemo(() => {
    return rajasthanFallbackPlaces.filter((p) => !p.isMajor);
  }, []);

  const filteredPlaces = useMemo(() => {
    return hiddenPlaces.filter((place) => {
      if (selectedDistrict !== 'All') {
        const d = selectedDistrict.toLowerCase();
        const pd = place.district.toLowerCase();
        if (!pd.includes(d) && !d.includes(pd)) return false;
      }
      if (selectedCategory !== 'All') {
        if (place.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      if (selectedPace !== 'All') {
        if (selectedPace === 'Quick' && !place.estimatedTime?.includes('1') && !place.estimatedTime?.includes('2')) return false;
        if (selectedPace === 'HalfDay' && !place.estimatedTime?.toLowerCase().includes('half') && !place.estimatedTime?.includes('3') && !place.estimatedTime?.includes('4')) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = place.title.toLowerCase().includes(q);
        const matchTagline = place.tagline?.toLowerCase().includes(q);
        const matchHistory = place.history?.toLowerCase().includes(q);
        const matchDistrict = place.district?.toLowerCase().includes(q);
        const matchCraft = place.giTagCraft?.toLowerCase().includes(q);
        if (!matchTitle && !matchTagline && !matchHistory && !matchDistrict && !matchCraft) return false;
      }
      return true;
    });
  }, [hiddenPlaces, selectedDistrict, selectedCategory, selectedPace, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pt-28 sm:pt-32 pb-24 selection:bg-[#E03E3E] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
              Zero-Crowd Heritage Archive
            </span>
            <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-white">
              HIDDEN SANCTUARIES
            </h1>
          </div>

          <p className="text-xs text-white/50 max-w-sm md:text-right leading-relaxed font-light">
            Step away from tourist buses. Discover subterranean baoris, abandoned desert ruins, and lakeside sanctuaries known only to locals.
          </p>
        </div>

        {/* FLOATING DARK FILTER BAR */}
        <div className="bg-[#121318] rounded-2xl border border-white/10 shadow-2xl p-3 sm:p-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
            {/* Filter 1: Destination input */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                Sanctuary / Keyword
              </label>
              <div className="flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Baori, stepwell, ruin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Filter 2: Category select */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#121318] text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'Forgotten Fort' ? 'Forts & Citadels' : c === 'All' ? 'All Hidden Types' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: District */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                District / Region
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-[#121318] text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d === 'All' ? 'All Territories' : d}</option>
                ))}
              </select>
            </div>

            {/* Filter 4: Pace / Duration */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                Pace / Duration
              </label>
              <select
                value={selectedPace}
                onChange={(e) => setSelectedPace(e.target.value)}
                className="w-full bg-[#121318] text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                <option value="All">Any Duration</option>
                <option value="Quick">Quick Calm (1-2h)</option>
                <option value="HalfDay">Half Day (3-4h)</option>
              </select>
            </div>

            {/* Filter 5: Discover Button */}
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

        {/* Quick Filter Reset / Active Indicators */}
        {(selectedDistrict !== 'All' || selectedCategory !== 'All' || selectedPace !== 'All' || searchQuery) && (
          <div className="flex items-center space-x-2 mb-6 text-xs text-white/50">
            <span>Active filters:</span>
            {selectedDistrict !== 'All' && (
              <span className="px-2.5 py-0.5 bg-white/10 text-white rounded-full font-medium">
                {selectedDistrict}
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2.5 py-0.5 bg-white/10 text-white rounded-full font-medium">
                {selectedCategory}
              </span>
            )}
            {selectedPace !== 'All' && (
              <span className="px-2.5 py-0.5 bg-white/10 text-white rounded-full font-medium">
                {selectedPace}
              </span>
            )}
            {searchQuery && (
              <span className="px-2.5 py-0.5 bg-white/10 text-white rounded-full font-medium">
                "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedDistrict('All');
                setSelectedCategory('All');
                setSelectedPace('All');
                setSearchQuery('');
              }}
              className="text-[#E03E3E] font-semibold underline hover:text-white cursor-pointer ml-2"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121318] rounded-3xl border border-white/10 p-8 shadow-2xl">
            <Compass className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <h3 className="font-sans font-bold text-base text-white">No hidden gems match your filter</h3>
            <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto font-light">
              Try adjusting the district or category filter, or reset to view all {hiddenPlaces.length} secret places.
            </p>
            <button
              onClick={() => {
                setSelectedDistrict('All');
                setSelectedCategory('All');
                setSelectedPace('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#E03E3E] text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Nav to Landmarks */}
        <div className="mt-14 p-8 bg-[#121318] rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div>
            <h3 className="font-sans text-base font-bold text-white">
              Also looking for Iconic Citadels & Palaces?
            </h3>
            <p className="text-xs text-white/50 mt-0.5 font-light">
              Explore Mehrangarh, Amer Fort, Kumbhalgarh, and Sonar Qila in our Major Landmarks archive.
            </p>
          </div>

          <Link
            href="/landmarks"
            className="px-6 py-2.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md shadow-[#E03E3E]/20 inline-flex items-center space-x-1.5 shrink-0"
          >
            <span>Explore Royal Landmarks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
