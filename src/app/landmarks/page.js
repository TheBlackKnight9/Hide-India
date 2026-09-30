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

export default function LandmarksPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const majorPlaces = useMemo(() => {
    return rajasthanFallbackPlaces.filter((p) => p.isMajor);
  }, []);

  const filteredPlaces = useMemo(() => {
    return majorPlaces.filter((place) => {
      if (selectedDistrict !== 'All') {
        const d = selectedDistrict.toLowerCase();
        const pd = place.district.toLowerCase();
        if (!pd.includes(d) && !d.includes(pd)) return false;
      }
      if (selectedDuration !== 'All') {
        if (selectedDuration === 'HalfDay' && !place.estimatedTime?.toLowerCase().includes('half') && !place.estimatedTime?.includes('2') && !place.estimatedTime?.includes('3')) return false;
        if (selectedDuration === 'FullDay' && !place.estimatedTime?.toLowerCase().includes('full') && !place.estimatedTime?.includes('4') && !place.estimatedTime?.includes('5')) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = place.title.toLowerCase().includes(q);
        const matchTagline = place.tagline?.toLowerCase().includes(q);
        const matchHistory = place.history?.toLowerCase().includes(q);
        const matchDistrict = place.district?.toLowerCase().includes(q);
        if (!matchTitle && !matchTagline && !matchHistory && !matchDistrict) return false;
      }
      return true;
    });
  }, [majorPlaces, selectedDistrict, selectedDuration, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f5f6f1] text-[#23261f] pb-24 selection:bg-[#E8402A] selection:text-white">
      {/* ── THREEUI ATMOSPHERIC PAGE HEADER ── */}
      <div className="threeui-page-header">
        <div className="ghost-watermark -bottom-6 -left-6">CITADELS</div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.24em] text-[#E8402A] uppercase block">
                Crown Bastions & Ramparts
              </span>
              <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-[#23261f] tracking-tight">
                CITADELS & FORTS
              </h1>
            </div>
            <p className="text-xs text-[#7c8177] max-w-md md:text-right leading-relaxed font-light">
              The grand sovereign fortresses of India. Explore the mirror Sheesh Mahal at Amer, the cliff ramparts of Mehrangarh, and the 36 km Great Wall of Kumbhalgarh.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 -mt-6 relative z-20">
        {/* FLOATING THREEUI FILTER PANEL */}
        <div className="threeui-panel p-3 sm:p-4 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {/* Filter 1: Landmark name input */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#7c8177] mb-0.5">
                Citadel / Palace
              </label>
              <div className="flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5 text-[#7c8177] shrink-0" />
                <input
                  type="text"
                  placeholder="Amer, Mehrangarh, Kumbhalgarh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#23261f] placeholder-[#7c8177]/60 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Filter 2: District */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#7c8177] mb-0.5">
                Territory
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-[#f5f6f1] text-xs font-medium text-[#23261f] border border-black/10 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d === 'All' ? 'All 13 Royal Districts' : d}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: Duration */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#7c8177] mb-0.5">
                Visit Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full bg-[#f5f6f1] text-xs font-medium text-[#23261f] border border-black/10 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="All">Any Duration</option>
                <option value="HalfDay">Half Day Exploration</option>
                <option value="FullDay">Full Day Citadel Tour</option>
              </select>
            </div>

            {/* Filter 4: Discover Button */}
            <div className="px-1">
              <button
                type="button"
                className="w-full sylva-dock-btn-accent justify-center py-2.5"
              >
                <span>Discover ({filteredPlaces.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Reset / Active Indicators */}
        {(selectedDistrict !== 'All' || selectedDuration !== 'All' || searchQuery) && (
          <div className="flex items-center space-x-2 mb-6 text-xs text-[#7c8177]">
            <span>Active filters:</span>
            {selectedDistrict !== 'All' && (
              <span className="px-2.5 py-0.5 bg-black/5 text-[#23261f] rounded-full font-medium border border-black/10">
                {selectedDistrict}
              </span>
            )}
            {selectedDuration !== 'All' && (
              <span className="px-2.5 py-0.5 bg-black/5 text-[#23261f] rounded-full font-medium border border-black/10">
                {selectedDuration}
              </span>
            )}
            {searchQuery && (
              <span className="px-2.5 py-0.5 bg-black/5 text-[#23261f] rounded-full font-medium border border-black/10">
                "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedDistrict('All');
                setSelectedDuration('All');
                setSearchQuery('');
              }}
              className="text-[#E03E3E] font-semibold underline hover:text-[#23261f] cursor-pointer ml-2"
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
          <div className="text-center py-20 bg-white rounded-3xl border border-black/10 p-8 shadow-xl">
            <Compass className="w-12 h-12 text-black/20 mx-auto mb-3" />
            <h3 className="font-sans font-bold text-base text-[#23261f]">No landmarks match your filter</h3>
            <p className="text-xs text-[#7c8177] mt-1 max-w-sm mx-auto font-light">
              Try adjusting your district or keyword search to view our royal bastions.
            </p>
            <button
              onClick={() => {
                setSelectedDistrict('All');
                setSelectedDuration('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#E03E3E] text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Nav to Hidden Gems */}
        <div className="mt-14 p-8 bg-white rounded-3xl border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h3 className="font-sans text-base font-bold text-[#23261f]">
              Seeking silence and zero crowds?
            </h3>
            <p className="text-xs text-[#7c8177] mt-0.5 font-light">
              Explore subterranean stepwells, abandoned ruins, and village artisans in our Hidden Gems archive.
            </p>
          </div>

          <Link
            href="/hidden-gems"
            className="px-6 py-2.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md shadow-[#E03E3E]/20 inline-flex items-center space-x-1.5 shrink-0"
          >
            <span>Explore Hidden Gems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
