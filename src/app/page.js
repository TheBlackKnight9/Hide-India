'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Compass,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Navigation,
  ChevronDown,
} from 'lucide-react';
import PlaceCard from '../components/PlaceCard';
import SwadeshiBanner from '../components/SwadeshiBanner';
import AIConciergeModal from '../components/AIConciergeModal';
import { rajasthanFallbackPlaces } from '../data/rajasthanFallbackPlaces';

const rajasthanCityShowcase = [
  {
    slug: 'jaipur',
    name: 'Jaipur',
    title: 'The Pink City',
    desc: 'Hawa Mahal, Amer Fort & Panna Meena Stepwell',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
    placesCount: 5,
  },
  {
    slug: 'jodhpur',
    name: 'Jodhpur',
    title: 'The Blue City',
    desc: 'Mehrangarh Fort, Jaswant Thada & Toorji Ka Jhalra',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Mehrangarh_Fort_sanhita.jpg',
    placesCount: 4,
  },
  {
    slug: 'udaipur',
    name: 'Udaipur',
    title: 'The City of Lakes',
    desc: 'City Palace, Lake Pichola & Ahar Cenotaphs',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Udaipur_City_Palace.jpg/1280px-Udaipur_City_Palace.jpg',
    placesCount: 3,
  },
  {
    slug: 'jaisalmer',
    name: 'Jaisalmer',
    title: 'The Golden Citadel',
    desc: 'Sonar Qila, Patwon Haveli & Kuldhara Ghost Village',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/1280px-Jaisalmer_forteresse.jpg',
    placesCount: 4,
  },
  {
    slug: 'bundi',
    name: 'Bundi',
    title: 'The Stepwell Capital',
    desc: 'Raniji Ki Baori, Garh Palace & Painted Chitrashala',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Garh_Palace_and_Taragarh_Fort%2C_Bundi_2011-12-26_EK_II.jpg/1280px-Garh_Palace_and_Taragarh_Fort%2C_Bundi_2011-12-26_EK_II.jpg',
    placesCount: 3,
  },
  {
    slug: 'pushkar',
    name: 'Pushkar & Ajmer',
    title: 'Sacred Oasis & Dargah',
    desc: 'Pushkar 52 Ghats, Sufi Shrine & Savitri Peak',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg/1280px-Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg',
    placesCount: 3,
  },
  {
    slug: 'bikaner',
    name: 'Bikaner',
    title: 'Desert Red Stone Fort',
    desc: 'Junagarh, Rampuria Havelis & Bhandasar Temple',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/India_Bikaner_Junagarh_Fort.jpg/1280px-India_Bikaner_Junagarh_Fort.jpg',
    placesCount: 3,
  },
  {
    slug: 'shekhawati',
    name: 'Shekhawati',
    title: 'Open-Air Art Gallery',
    desc: 'Mandawa Painted Fort & Nawalgarh Poddar Haveli',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Haveli_mandawa.jpg',
    placesCount: 2,
  },
  {
    slug: 'chittorgarh',
    name: 'Chittorgarh & Kumbhalgarh',
    title: 'Citadels of Valor',
    desc: 'Vijay Stambha, Ranakpur 1444 Pillars & Great Wall',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Chittorgarh_fort.JPG/1280px-Chittorgarh_fort.JPG',
    placesCount: 3,
  },
  {
    slug: 'alwar',
    name: 'Alwar & Sariska',
    title: 'Forest Shrines & Stepwells',
    desc: 'Chand Baori, Bhangarh Ruins & Neelkanth Temple',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Chand_Baori_perspective_panorama_%28July_2022%29.jpg/1280px-Chand_Baori_perspective_panorama_%28July_2022%29.jpg',
    placesCount: 3,
  },
];

const categories = [
  { name: 'All', icon: '✦', desc: 'All Sanctuaries' },
  { name: 'Stepwell', icon: '🌊', desc: 'Subterranean Baoris' },
  { name: 'Forgotten Fort', icon: '🏰', desc: 'Citadels & Havelis' },
  { name: 'Ancient Temple', icon: '🛕', desc: 'Carved Temples' },
  { name: 'Rock Art & Caves', icon: '⛰️', desc: 'Desert Ruins & Caves' },
  { name: 'Living Crafts & Handloom', icon: '🧵', desc: 'Artisan Haveli Museums' },
];

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all'); // all, hidden, major
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [places, setPlaces] = useState(rajasthanFallbackPlaces);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [placesRes, eventsRes] = await Promise.all([
          fetch('/api/places?state=Rajasthan').then((r) => r.json()),
          fetch('/api/events').then((r) => r.json()),
        ]);

        if (placesRes.success && placesRes.data && placesRes.data.length > 0) {
          setPlaces(placesRes.data);
        }
        if (eventsRes.success && eventsRes.data) {
          setEvents(eventsRes.data.slice(0, 3));
        }
      } catch (err) {
        console.warn('API sync notice: using verified local archive', err);
      }
    };

    loadData();
  }, []);

  const handleOpenAi = (query = '') => {
    setAiInitialQuery(query);
    setIsAiOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        router.push(`/explore?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
      },
      () => {
        setGpsLoading(false);
        alert('Could not detect location. Please check permissions or choose a city.');
      }
    );
  };

  // Filtered places
  const filteredPlaces = places.filter((p) => {
    if (selectedCityFilter !== 'All') {
      const matchCity =
        p.district.toLowerCase() === selectedCityFilter.toLowerCase() ||
        selectedCityFilter.toLowerCase().includes(p.district.toLowerCase()) ||
        p.district.toLowerCase().includes(selectedCityFilter.toLowerCase());
      if (!matchCity) return false;
    }
    if (selectedTypeFilter === 'hidden' && p.isMajor) return false;
    if (selectedTypeFilter === 'major' && !p.isMajor) return false;
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  const hiddenCount = places.filter((p) => !p.isMajor).length;
  const majorCount = places.filter((p) => p.isMajor).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900">
      {/* 1. Hero Section with Real Kumbhalgarh Citadel Background */}
      <section
        className="relative min-h-[94vh] sm:min-h-screen flex flex-col justify-between items-center text-center px-4 pt-32 sm:pt-36 pb-8 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/kumbhalgarh-hero.jpg')",
        }}
      >
        {/* Luminous ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/85 via-white/35 to-[#FAF8F5] pointer-events-none" />

        {/* Top Spacer */}
        <div />

        {/* Central Haven Content Block */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center">
          {/* Floating Announcement Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-xs text-xs font-medium text-stone-700 mb-6 hover:bg-white transition-all">
            <span>✦ The Complete Rajasthan Cultural Archive</span>
            <span className="text-stone-900 font-bold">10 Cities Mapped 🚀</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-stone-900 leading-[1.05]">
            Explore Rajasthan with ease.
          </h1>

          {/* Rhythmic Subtitle */}
          <p className="font-sans text-base sm:text-xl text-stone-700 font-normal max-w-xl mx-auto mt-4 leading-relaxed">
            Discover royal desert fortresses, ancient stepwells, and unwritten folklore with AI that understands heritage.
            <span className="block text-stone-600 sm:mt-1">
              From iconic royal citadels to zero-crowd hidden sanctuaries.
            </span>
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cities"
              className="bg-white text-stone-900 hover:bg-stone-50 rounded-full px-7 py-3.5 text-sm font-semibold shadow-xl shadow-stone-900/10 hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2 group"
            >
              <span>Explore 10 Cities</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>

            <Link
              href="/planner"
              className="text-sm font-semibold text-stone-800 hover:text-stone-950 px-5 py-3.5 rounded-full bg-white/70 hover:bg-white transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Route Planner</span>
            </Link>
          </div>

          {/* Floating Clean Search Capsule */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl mt-8 bg-white/90 backdrop-blur-xl border border-white/80 p-2 rounded-full shadow-xl shadow-stone-900/5 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center flex-grow px-4 w-full">
              <Search className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search Jaipur, Jodhpur stepwells, Kuldhara, Bundi frescoes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-stone-800 placeholder-stone-400 focus:outline-none py-1.5"
              />
            </div>

            <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-end px-1">
              <button
                type="button"
                onClick={handleFindNearMe}
                disabled={gpsLoading}
                className="px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors whitespace-nowrap cursor-pointer"
                title="Detect gems near your current GPS location"
              >
                <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Locating...' : 'Near Me'}</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Popular Circuits Quick Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-stone-600">
            <span className="font-medium text-stone-500">Popular:</span>
            {['Jaipur Stepwells', 'Jodhpur Blue Alleys', 'Lake Pichola', 'Kuldhara Ghost Town', 'Bundi Baoris', 'Shekhawati Havelis'].map((item) => (
              <button
                key={item}
                onClick={() => router.push(`/explore?search=${encodeURIComponent(item)}`)}
                className="px-2.5 py-0.5 rounded-full bg-white/75 hover:bg-white text-stone-700 border border-white/60 text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Minimalist Scroll & Location Pills */}
        <div className="relative z-10 pt-6 flex flex-col sm:flex-row items-center gap-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/75 backdrop-blur-md border border-white/60 shadow-2xs text-[11px] font-medium text-stone-600">
            <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Kumbhalgarh Fort · The Great Wall of India</span>
          </div>
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-xs text-[10px] font-bold uppercase tracking-widest text-stone-600">
            <span>Scroll Down</span>
            <ChevronDown className="w-3 h-3 animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. Platform Metrics Strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-stone-200/80 shadow-lg shadow-stone-900/5 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-stone-100">
            <Link href="/explore" className="p-2 group hover:bg-stone-50 rounded-2xl transition-colors">
              <p className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">{places.length || 33}</p>
              <p className="text-[11px] font-medium text-stone-500 mt-1 uppercase tracking-wider">Documented Sites →</p>
            </Link>
            <Link href="/cities" className="p-2 group hover:bg-stone-50 rounded-2xl transition-colors">
              <p className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">10</p>
              <p className="text-[11px] font-medium text-stone-500 mt-1 uppercase tracking-wider">Royal Cities →</p>
            </Link>
            <Link href="/hidden-gems" className="p-2 group hover:bg-stone-50 rounded-2xl transition-colors">
              <p className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-700 group-hover:text-emerald-800 transition-colors">{hiddenCount || 19}</p>
              <p className="text-[11px] font-medium text-stone-500 mt-1 uppercase tracking-wider">Zero-Crowd Gems →</p>
            </Link>
            <Link href="/landmarks" className="p-2 group hover:bg-stone-50 rounded-2xl transition-colors">
              <p className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">{majorCount || 14}</p>
              <p className="text-[11px] font-medium text-stone-500 mt-1 uppercase tracking-wider">Major Citadels →</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Major Cities Photographic Showcase ("Hard images instead of map") */}
      <section id="cities" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Photographic Exploration
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-stone-900">
              Major Cities of Rajasthan
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Select a historic royal city to view its iconic landmarks and zero-crowd secret places.
            </p>
          </div>

          <Link
            href="/cities"
            className="mt-3 sm:mt-0 text-xs font-semibold text-stone-900 hover:text-black uppercase tracking-wider inline-flex items-center space-x-1"
          >
            <span>View All 10 City Dossiers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 10 Major City Cards Grid with Hard Real Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {rajasthanCityShowcase.map((city) => {
            const isSelected = selectedCityFilter === city.name;
            return (
              <div
                key={city.name}
                onClick={() => setSelectedCityFilter(isSelected ? 'All' : city.name)}
                className={`group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-4 border ${
                  isSelected ? 'ring-3 ring-stone-900 border-transparent scale-102' : 'border-stone-200/80 hover:-translate-y-1'
                }`}
              >
                {/* Background Hard Image */}
                <img
                  src={city.image}
                  alt={city.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {/* City Card Content */}
                <div className="relative z-10 text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                      {city.placesCount} Sites
                    </span>
                    <Link
                      href={`/cities/${city.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] font-bold uppercase tracking-wider text-amber-300 hover:text-white bg-black/40 hover:bg-black/70 px-2 py-0.5 rounded-full transition-colors"
                      title={`Open ${city.name} dedicated page`}
                    >
                      Dossier ↗
                    </Link>
                  </div>
                  <h4 className="font-sans text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                    {city.name}
                  </h4>
                  <p className="text-[11px] text-amber-200 font-medium leading-tight">
                    {city.title}
                  </p>
                  <p className="text-[10px] text-stone-300 line-clamp-1 leading-snug pt-0.5 opacity-90">
                    {city.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. AI Heritage Concierge Spotlight Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-stone-800">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-terracotta-500/15 blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-xl relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rajasthan Time-Budgeted Concierge</span>
            </div>
            <h3 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-white">
              "I am in Jaipur for 2 hours, what can I do?"
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Tell our AI Concierge how much time you have in Jaipur, Jodhpur, Udaipur, or Jaisalmer. It calculates travel times and returns a zero-crowd itinerary of stepwells, artisans, and legends.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0 relative z-10">
            <Link
              href="/planner"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Open AI Route Planner</span>
            </Link>

            <button
              onClick={() => handleOpenAi('I have 3 hours in Jodhpur looking for stepwells & crafts')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>Quick Concierge Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Destination Gallery (Major Places vs Hidden Places Filter) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Curated Photographic Dossiers
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {selectedCityFilter === 'All' ? 'All Rajasthan Destinations' : `${selectedCityFilter} Highlights`}
            </h2>
          </div>

          {/* Major vs Hidden Gem Filter Tabs */}
          <div className="inline-flex p-1 rounded-full bg-white border border-stone-200 shadow-xs">
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTypeFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({places.length})
            </button>
            <button
              onClick={() => setSelectedTypeFilter('hidden')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTypeFilter === 'hidden'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>✦ Hidden Gems ({hiddenCount})</span>
            </button>
            <button
              onClick={() => setSelectedTypeFilter('major')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTypeFilter === 'major'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🏛️ Major Landmarks ({majorCount})
            </button>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categories.map((cat) => {
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Photographic Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.slice(0, 9).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <Compass className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">No destinations found in this filter.</p>
            <button
              onClick={() => {
                setSelectedCityFilter('All');
                setSelectedTypeFilter('all');
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-2 bg-stone-900 text-white rounded-full text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-white border border-stone-200 text-stone-900 hover:bg-stone-50 font-semibold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all"
          >
            <span>View All {places.length} Rajasthan Photo Dossiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. Living Folk Festivals of Rajasthan */}
      {events && events.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
                Desert Melas & Fairs
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Living Festivals of Rajasthan
              </h2>
            </div>
            <Link
              href="/events"
              className="mt-2 sm:mt-0 text-xs font-semibold text-stone-600 hover:text-stone-900 uppercase tracking-wider inline-flex items-center space-x-1"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-900 shadow-xs">
                    {event.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-sans text-lg font-bold text-stone-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center space-x-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{event.location}, {event.state}</span>
                    </p>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-500">
                      {event.organizer || 'State Heritage'}
                    </span>
                    <Link
                      href="/events"
                      className="font-semibold text-stone-900 hover:text-black"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Swadeshi for Atmanirbhar Bharat Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <SwadeshiBanner />
      </div>

      {/* AI Concierge Modal */}
      <AIConciergeModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialQuery={aiInitialQuery}
      />
    </div>
  );
}
