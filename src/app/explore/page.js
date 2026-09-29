'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, RotateCcw, Compass, Sparkles } from 'lucide-react';
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
  'Bikaner',
  'Shekhawati',
  'Chittorgarh',
  'Kumbhalgarh',
  'Alwar',
  'Dausa',
  'Barmer',
  'Bharatpur',
  'Ajmer',
  'Mount Abu',
];

const categories = [
  'All',
  'Stepwell',
  'Forgotten Fort',
  'Ancient Temple',
  'Living Crafts & Handloom',
  'Royal Cenotaph',
  'Wildlife Sanctuary',
  'Desert Heritage',
];

function ExploreContent() {
  const searchParams = useSearchParams();

  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || 'All';
  const queryCity = searchParams.get('city') || searchParams.get('district') || 'All Cities';
  const queryType = searchParams.get('type') || 'all';
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
    <div className="min-h-screen bg-[#0A0B0E] text-white pt-28 sm:pt-32 pb-24 selection:bg-[#E03E3E] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        {/* Top Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
                Rajasthan Atlas · {places.length} Verified Sanctuaries
              </span>
              <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-white">
                {selectedCity === 'All Cities' ? 'EXPLORE RAJASTHAN' : `${selectedCity.toUpperCase()}`}
              </h1>
              <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-2xl leading-relaxed font-light">
                Browse authentic photography of royal citadels and zero-crowd subterranean secrets across all desert districts.
              </p>
            </div>

            {/* Place Type Switcher */}
            <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10 self-start md:self-auto shadow-md">
              <button
                onClick={() => setPlaceType('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  placeType === 'all'
                    ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>All ({places.length})</span>
              </button>
              <button
                onClick={() => setPlaceType('hidden')}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  placeType === 'hidden'
                    ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>Hidden Gems</span>
              </button>
              <button
                onClick={() => setPlaceType('major')}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  placeType === 'major'
                    ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>Major Landmarks</span>
              </button>
            </div>
          </div>

          {/* Filter Controls Card */}
          <div className="bg-[#121318] p-5 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search Input (6 cols) */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-white/40 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by monument, stepwell, craft..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#E03E3E]"
                />
              </div>

              {/* City Dropdown (3 cols) */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#121318] border border-white/10 rounded-full text-xs text-white focus:outline-none cursor-pointer"
                >
                  {rajasthanCities.map((city) => (
                    <option key={city} value={city}>
                      {city === 'All Cities' ? '📍 All Territories' : `📍 ${city}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown (3 cols) */}
              <div className="sm:col-span-3 flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#121318] border border-white/10 rounded-full text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="popular">Most Loved & Visited</option>
                  <option value="newest">Recently Documented</option>
                </select>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="p-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick City Carousel Pills */}
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-semibold text-white/40 shrink-0 mr-1">
                  Territory:
                </span>
                {rajasthanCities.map((city) => {
                  const active = selectedCity === city;
                  return (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        active
                          ? 'bg-[#E03E3E] text-white shadow-xs'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
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
              <span className="text-xs font-semibold text-white/40 shrink-0 mr-1">
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
                        ? 'bg-[#E03E3E] text-white border border-[#E03E3E] font-semibold'
                        : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {cat === 'Forgotten Fort' ? 'Forts & Citadels' : cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Places Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Showing {places.length} Photo Dossiers ({hiddenCount} Hidden Gems · {majorCount} Major Landmarks)
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#121318] rounded-3xl border border-white/10 p-8 shadow-2xl">
              <Compass className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h3 className="font-sans text-xl font-bold text-white">
                No Sanctuaries Match Your Filter
              </h3>
              <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto mb-6 font-light">
                Try choosing another territory or clearing your search term to see more destinations.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-[#E03E3E] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#c93232] transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0B0E] text-white pt-32 text-center text-sm">Loading Rajasthan Visual Atlas...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
