'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, ArrowRight, Compass, Search } from 'lucide-react';
import { rajasthanCities } from '../../data/rajasthanCities';
import { rajasthanFallbackPlaces } from '../../data/rajasthanFallbackPlaces';

export default function CitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = rajasthanCities.filter((city) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      city.name.toLowerCase().includes(q) ||
      city.title.toLowerCase().includes(q) ||
      city.tagline.toLowerCase().includes(q) ||
      city.crafts.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Royal Cultural Territories</span>
          </div>
          <h1 className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 mb-4">
            The 10 Royal Cities of Rajasthan
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Each historical region preserves its own architectural identity, royal dynasty, subterranean stepwells, and GI-tagged artisan traditions.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city, craft, or fort name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-stone-200 shadow-sm text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCities.map((city) => {
            // Count total and hidden places in this city
            const cityPlaces = rajasthanFallbackPlaces.filter((p) =>
              p.district.toLowerCase().includes(city.name.toLowerCase()) ||
              city.name.toLowerCase().includes(p.district.toLowerCase())
            );
            const hiddenCount = cityPlaces.filter((p) => !p.isMajor).length;
            const majorCount = cityPlaces.filter((p) => p.isMajor).length;

            return (
              <div
                key={city.slug}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Cover */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/90 text-stone-900 shadow-xs">
                      {city.name}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md">
                      {cityPlaces.length} Documented Sites
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                      {city.title}
                    </p>
                    <p className="text-xs text-stone-200 line-clamp-1 mt-0.5 opacity-90">
                      {city.tagline}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-stone-500 font-medium">
                      <span>🏛️ {city.dynasty}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {city.overview}
                    </p>

                    {/* Crafts Pills */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                        GI Tagged Crafts & Artisans
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {city.crafts.slice(0, 3).map((craft) => (
                          <span
                            key={craft}
                            className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-medium"
                          >
                            {craft}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="text-[11px] text-stone-500">
                      <span className="font-semibold text-emerald-700">{hiddenCount} Hidden</span>
                      <span className="mx-1.5">·</span>
                      <span className="font-semibold text-stone-700">{majorCount} Major</span>
                    </div>

                    <Link
                      href={`/cities/${city.slug}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-900 group-hover:text-amber-700 transition-colors"
                    >
                      <span>Explore City Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <Compass className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">No city matched your search "{searchTerm}".</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 px-4 py-2 bg-stone-900 text-white rounded-full text-xs font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
