'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  RotateCcw,
  Sparkles,
  Compass,
} from 'lucide-react';
import PlaceCard from '../../components/PlaceCard';
import { rajasthanFallbackPlaces } from '../../data/rajasthanFallbackPlaces';

const rajasthanCities = [
  'All Cities',
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
  'Rock Art & Caves',
  'Living Crafts & Handloom',
];

function ExploreContent() {
  const searchParams = useSearchParams();

  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || 'All';
  const queryCity = searchParams.get('city') || searchParams.get('district') || 'All Cities';
  const queryType = searchParams.get('type') || 'all'; // all, hidden, major
  const querySort = searchParams.get('sort') || 'popular';

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [selectedCity, setSelectedCity] = useState(queryCity);
  const [category, setCategory] = useState(queryCategory);
  const [placeType, setPlaceType] = useState(queryType);
  const [sortBy, setSortBy] = useState(querySort);

  const [places, setPlaces] = useState(rajasthanFallbackPlaces);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilteredPlaces = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ state: 'Rajasthan' });

        if (category && category !== 'All') params.set('category', category);
        if (selectedCity && selectedCity !== 'All Cities') params.set('district', selectedCity);
        if (searchTerm.trim()) params.set('search', searchTerm.trim());
        if (placeType === 'hidden') params.set('isMajor', 'false');
        if (placeType === 'major') params.set('isMajor', 'true');
        if (sortBy) params.set('sort', sortBy);

        const res = await fetch(`/api/places?${params.toString()}`).then((r) => r.json());
        if (res.success && res.data && res.data.length > 0) {
          setPlaces(res.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API sync notice: using verified local Rajasthan archive:', err);
      } finally {
        setLoading(false);
      }

      // Robust local filter fallback
      let filtered = [...rajasthanFallbackPlaces];
      if (selectedCity && selectedCity !== 'All Cities') {
        filtered = filtered.filter(
          (p) => p.district.toLowerCase() === selectedCity.toLowerCase()
        );
      }
      if (category && category !== 'All') {
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (placeType === 'hidden') {
        filtered = filtered.filter((p) => !p.isMajor);
      } else if (placeType === 'major') {
        filtered = filtered.filter((p) => p.isMajor);
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.district.toLowerCase().includes(q)
        );
      }
      setPlaces(filtered);
    };

    fetchFilteredPlaces();
  }, [category, selectedCity, placeType, searchTerm, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCity('All Cities');
    setCategory('All');
    setPlaceType('all');
    setSortBy('popular');
  };

  const hiddenCount = places.filter((p) => !p.isMajor).length;
  const majorCount = places.filter((p) => p.isMajor).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28">
      {/* Top Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold mb-3">
              <span>✦ Rajasthan Visual Atlas</span>
              <span>•</span>
              <span className="text-stone-900 font-bold">{places.length} Locations</span>
            </div>
            <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              {selectedCity === 'All Cities' ? 'Explore Rajasthan' : `${selectedCity}, Rajasthan`}
            </h1>
            <p className="text-sm sm:text-base text-stone-500 mt-2 max-w-2xl leading-relaxed">
              Browse authentic photography of Rajasthan’s legendary royal citadels and zero-crowd subterranean secrets across all major desert districts.
            </p>
          </div>

          {/* Place Type Switcher Pill */}
          <div className="inline-flex p-1 rounded-full bg-stone-200/80 border border-stone-300/60 self-start md:self-auto shadow-xs">
            <button
              onClick={() => setPlaceType('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                placeType === 'all'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>All ({places.length})</span>
            </button>
            <button
              onClick={() => setPlaceType('hidden')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                placeType === 'hidden'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Hidden Gems</span>
            </button>
            <button
              onClick={() => setPlaceType('major')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                placeType === 'major'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🏛️ Major Landmarks</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input (6 cols) */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by monument, stepwell, dynasty, craft..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
              />
            </div>

            {/* City Dropdown (3 cols) */}
            <div className="sm:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-sm text-stone-800 focus:outline-none cursor-pointer"
              >
                {rajasthanCities.map((city) => (
                  <option key={city} value={city}>
                    {city === 'All Cities' ? '📍 All Rajasthan Cities' : `📍 ${city}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown (3 cols) */}
            <div className="sm:col-span-3 flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-sm text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Loved & Visited</option>
                <option value="newest">Recently Documented</option>
              </select>

              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2.5 rounded-full border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick City Carousel Pills */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-stone-400 shrink-0 mr-1">
                Filter City:
              </span>
              {rajasthanCities.map((city) => {
                const active = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-stone-400 shrink-0 mr-1">
              Category:
            </span>
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Photographic Gallery Grid (Full Width, No Map) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Showing {places.length} Photo Dossiers ({hiddenCount} Hidden Gems · {majorCount} Major Landmarks)
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-stone-200/60 animate-pulse" />
            ))}
          </div>
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-sans text-xl font-bold text-stone-800">
              No Rajasthan Places Match Your Filter
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-6">
              Try choosing another city or clearing your search term to see more destinations.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold shadow-sm hover:bg-black transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-32 text-center text-sm text-stone-500">Loading Rajasthan Visual Atlas...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
