'use client';

import React, { useState } from 'react';
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

  if (!city) {
    return notFound();
  }

  // Filter places for this city
  const cityPlaces = rajasthanFallbackPlaces.filter((p) => {
    const cityName = city.name.toLowerCase();
    const district = p.district.toLowerCase();
    return (
      district.includes(cityName) ||
      cityName.includes(district) ||
      p.title.toLowerCase().includes(cityName) ||
      p.tagline.toLowerCase().includes(cityName)
    );
  });

  const hiddenPlaces = cityPlaces.filter((p) => !p.isMajor);
  const majorPlaces = cityPlaces.filter((p) => p.isMajor);

  const displayPlaces =
    activeTab === 'hidden'
      ? hiddenPlaces
      : activeTab === 'major'
      ? majorPlaces
      : cityPlaces;

  // Filter crafts for this city
  const cityCrafts = rajasthanCrafts.filter(
    (c) =>
      c.city.toLowerCase().includes(city.name.toLowerCase()) ||
      city.name.toLowerCase().includes(c.city.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-20">
      {/* 1. Hero Cover Section */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] flex flex-col justify-between p-6 sm:p-12 overflow-hidden bg-cover bg-center">
        <img
          src={city.image}
          alt={city.name}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-black/50 to-black/60" />

        {/* Top Navigation */}
        <div className="relative z-10 pt-20 flex items-center justify-between">
          <Link
            href="/cities"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-stone-900 backdrop-blur-md text-xs font-semibold shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Rajasthan Cities</span>
          </Link>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 text-stone-900 shadow-xs">
            {city.title}
          </span>
        </div>

        {/* Hero Title Block */}
        <div className="relative z-10 max-w-4xl mt-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold mb-3 backdrop-blur-md">
            <span>🏛️ {city.dynasty}</span>
            <span className="opacity-60">·</span>
            <span>{city.era}</span>
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            {city.name}
          </h1>

          <p className="font-sans text-base sm:text-xl text-stone-200 font-normal max-w-2xl mt-3 leading-relaxed">
            {city.tagline}
          </p>
        </div>
      </section>

      {/* 2. City Overview & Statistics Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-lg shadow-stone-900/5 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-stone-100">
            <div className="p-2">
              <p className="font-sans text-3xl sm:text-4xl font-extrabold text-stone-900">
                {cityPlaces.length}
              </p>
              <p className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                Documented Sites
              </p>
            </div>
            <div className="p-2">
              <p className="font-sans text-3xl sm:text-4xl font-extrabold text-emerald-700">
                {hiddenPlaces.length}
              </p>
              <p className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                Zero-Crowd Hidden Gems
              </p>
            </div>
            <div className="p-2">
              <p className="font-sans text-3xl sm:text-4xl font-extrabold text-stone-900">
                {majorPlaces.length}
              </p>
              <p className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                Major Landmarks
              </p>
            </div>
            <div className="p-2">
              <p className="font-sans text-3xl sm:text-4xl font-extrabold text-amber-700">
                {city.crafts.length}
              </p>
              <p className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                GI Tagged Crafts
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-stone-100 max-w-3xl mx-auto text-center">
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {city.overview}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Monuments & Stepwells Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Visual Dossiers
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Heritage Sites in {city.name}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 rounded-full bg-white border border-stone-200 shadow-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({cityPlaces.length})
            </button>
            <button
              onClick={() => setActiveTab('hidden')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'hidden'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>✦ Hidden Gems ({hiddenPlaces.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('major')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'major'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🏛️ Major ({majorPlaces.length})
            </button>
          </div>
        </div>

        {/* Places Grid */}
        {displayPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <Compass className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">
              No places in this tab for {city.name}.
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-3 px-4 py-2 bg-stone-900 text-white rounded-full text-xs font-medium cursor-pointer"
            >
              Show All {city.name} Sites
            </button>
          </div>
        )}
      </section>

      {/* 4. Local Crafts & Artisan Clusters for this city */}
      {cityCrafts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Atmanirbhar Bharat · Swadeshi Heritage
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white">
                GI Tagged Crafts of {city.name}
              </h3>
              <p className="text-stone-300 text-sm mt-2">
                Support generational artisan communities directly without middleman markups.
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
                    <span className="font-semibold">Associated Monuments:</span>{' '}
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
                <span>View All Rajasthan GI Crafts Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. Back to other cities navigation strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between border-t border-stone-200 pt-8">
          <div>
            <h4 className="font-sans font-bold text-lg text-stone-900">
              Explore More Regions
            </h4>
            <p className="text-xs text-stone-500">
              Discover other royal dynasties and desert landscapes
            </p>
          </div>
          <Link
            href="/cities"
            className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs inline-flex items-center space-x-1.5 transition-all"
          >
            <span>View All 10 Cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
