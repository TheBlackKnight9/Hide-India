'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Search, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { rajasthanCrafts } from '../../data/rajasthanCrafts';

export default function CraftsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const cities = ['All', 'Jaipur', 'Jodhpur', 'Udaipur', 'Bundi', 'Bikaner', 'Jaisalmer', 'Shekhawati'];

  const filteredCrafts = rajasthanCrafts.filter((craft) => {
    if (selectedCity !== 'All' && !craft.city.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        craft.name.toLowerCase().includes(q) ||
        craft.description.toLowerCase().includes(q) ||
        craft.artisanClusters.toLowerCase().includes(q) ||
        craft.materials.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Swadeshi for Atmanirbhar Bharat · SIH25130</span>
          </div>
          <h1 className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 mb-4">
            GI Crafts & Living Artisan Traditions
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Directly connect with generational artisan clusters across Rajasthan. From Jodhpur sandstone sculptors and Jaipur blue potters to Bikaner 24k gold-leaf Usta masters.
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
                placeholder="Search craft, material, or cluster..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            {/* City pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                Region:
              </span>
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCity === c
                      ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Crafts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCrafts.map((craft) => (
            <div
              key={craft.slug}
              className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={craft.image}
                  alt={craft.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-stone-900 shadow-xs">
                    {craft.city}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                    {craft.giTag}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-sans text-xl font-bold tracking-tight">
                    {craft.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {craft.description}
                  </p>

                  <div className="bg-stone-50 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-stone-800">Natural Materials: </span>
                      <span className="text-stone-600">{craft.materials}</span>
                    </div>
                    <div>
                      <span className="font-bold text-stone-800">Artisan Clusters: </span>
                      <span className="text-stone-600">📍 {craft.artisanClusters}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-[11px] text-stone-500">
                    <span className="font-medium text-stone-700">Monuments:</span>{' '}
                    {craft.monuments.slice(0, 2).join(', ')}
                  </div>

                  <Link
                    href={`/cities/${craft.city.toLowerCase().split(' ')[0]}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-900 hover:text-amber-700"
                  >
                    <span>Visit {craft.city}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SIH Swadeshi Banner */}
        <div className="mt-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-200">
              Preserving Indian Craft Heritage
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight">
              Buy directly from regional master artisans
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Commercial tourist gift shops impose 300% to 500% middleman markups. Hide Rajasthan directs travelers directly to the authentic village cooperatives and cluster workshops.
            </p>
          </div>

          <Link
            href="/explore"
            className="px-6 py-3.5 rounded-full bg-white text-stone-900 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 shadow-lg whitespace-nowrap transition-all"
          >
            Explore Heritage Sites
          </Link>
        </div>
      </div>
    </div>
  );
}
