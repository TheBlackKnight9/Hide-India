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
    <div className="min-h-screen bg-[#f5f6f1] text-[#23261f] pb-24 selection:bg-[#E03E3E] selection:text-white">
      {/* ── THREEUI ATMOSPHERIC PAGE HEADER ── */}
      <div className="threeui-page-header">
        <div className="ghost-watermark -bottom-6 -left-6">EXPLORE</div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.24em] text-[#E03E3E] uppercase block">
                Rajasthan Atlas · {places.length} Verified Sanctuaries
              </span>
              <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-[#23261f] tracking-tight">
                {selectedCity === 'All Cities' ? 'EXPLORE RAJASTHAN' : `${selectedCity.toUpperCase()}`}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-xs text-[#7c8177] max-w-xs md:text-right leading-relaxed font-light">
                Browse authentic photography of royal citadels and zero-crowd subterranean secrets across all desert districts.
              </p>

              {/* Place Type Switcher (ThreeUI Sylva Dock) */}
              <div className="sylva-dock">
                <button
                  onClick={() => setPlaceType('all')}
                  className={placeType === 'all' ? 'sylva-pill-active' : 'sylva-dock-item'}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>All ({places.length})</span>
                </button>
                <button
                  onClick={() => setPlaceType('hidden')}
                  className={placeType === 'hidden' ? 'sylva-pill-active' : 'sylva-dock-item'}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1b8a6b]" />
                  <span>Hidden Gems ({hiddenCount})</span>
                </button>
                <button
                  onClick={() => setPlaceType('major')}
                  className={placeType === 'major' ? 'sylva-pill-active' : 'sylva-dock-item'}
                >
                  <span>Landmarks ({majorCount})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 -mt-6 relative z-20">
        {/* Filter Controls Card */}
        <div className="threeui-panel p-5 mb-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input (6 cols) */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-[#7c8177] absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by monument, stepwell, craft..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f5f6f1] border border-black/10 rounded-full text-xs text-[#23261f] placeholder-[#7c8177]/60 focus:outline-none focus:border-[#E03E3E]"
              />
            </div>

            {/* City Dropdown (3 cols) */}
            <div className="sm:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f5f6f1] border border-black/10 rounded-full text-xs text-[#23261f] focus:outline-none cursor-pointer"
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
                className="w-full px-4 py-2.5 bg-[#f5f6f1] border border-black/10 rounded-full text-xs text-[#23261f] focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Loved & Visited</option>
                <option value="newest">Recently Documented</option>
              </select>

              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2.5 rounded-full border border-black/10 text-[#7c8177] hover:text-[#23261f] hover:bg-black/5 transition-colors cursor-pointer shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick City Carousel Pills */}
          <div className="pt-2 border-t border-black/5">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-[#7c8177] shrink-0 mr-1">
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
                        : 'bg-black/5 text-[#555c4e] hover:bg-black/10'
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
            <span className="text-xs font-semibold text-[#7c8177] shrink-0 mr-1">
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
                      : 'bg-black/5 text-[#555c4e] border border-black/10 hover:border-black/20'
                  }`}
                >
                  {cat === 'Forgotten Fort' ? 'Forts & Citadels' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Places Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-semibold text-[#7c8177] uppercase tracking-wider">
              Showing {places.length} Photo Dossiers ({hiddenCount} Hidden Gems · {majorCount} Major Landmarks)
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-black/5 animate-pulse" />
              ))}
            </div>
          ) : places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-black/10 p-8 shadow-xl">
              <Compass className="w-12 h-12 text-black/20 mx-auto mb-3" />
              <h3 className="font-sans text-xl font-bold text-[#23261f]">
                No Sanctuaries Match Your Filter
              </h3>
              <p className="text-xs text-[#7c8177] mt-1 max-w-sm mx-auto mb-6 font-light">
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
    <Suspense fallback={<div className="min-h-screen bg-[#f5f6f1] text-[#23261f] pt-32 text-center text-sm">Loading Rajasthan Visual Atlas...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
