'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Landmark, Search, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
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
  'Bikaner',
  'Shekhawati',
  'Chittorgarh',
  'Alwar',
];

export default function LandmarksPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Only major places (isMajor === true)
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
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = place.title.toLowerCase().includes(q);
        const matchTagline = place.tagline.toLowerCase().includes(q);
        const matchHistory = place.history?.toLowerCase().includes(q);
        const matchDistrict = place.district.toLowerCase().includes(q);
        if (!matchTitle && !matchTagline && !matchHistory && !matchDistrict) return false;
      }
      return true;
    });
  }, [majorPlaces, selectedDistrict, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider mb-4">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Crown Citadels & UNESCO Fortresses</span>
          </div>
          <h1 className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 mb-4">
            Major Landmarks of Rajasthan
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            The grand architectural bastions of India. Explore the thousand-mirror Sheesh Mahal at Amer, the impregnable cliff walls of Mehrangarh, and the 36 km Great Wall of Kumbhalgarh.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Amer, Mehrangarh, Sonar Qila..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            {/* District pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                District:
              </span>
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedDistrict === d
                      ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Showing <span className="text-stone-900 font-bold">{filteredPlaces.length}</span> iconic royal landmarks
          </p>

          <Link
            href="/hidden-gems"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center space-x-1"
          >
            <span>Prefer Zero-Crowd Hidden Gems?</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-sans font-bold text-base text-stone-800">No major landmarks match your filter</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try changing your search term or select another district.
            </p>
            <button
              onClick={() => {
                setSelectedDistrict('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
