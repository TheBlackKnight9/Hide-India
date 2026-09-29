'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight } from 'lucide-react';
import { rajasthanCrafts } from '../../data/rajasthanCrafts';

const cities = ['All', 'Jaipur', 'Jodhpur', 'Udaipur', 'Bikaner', 'Bundi', 'Kota', 'Barmer', 'Pokhran', 'Molela'];

export default function CraftsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const filteredCrafts = useMemo(() => {
    return rajasthanCrafts.filter((craft) => {
      if (selectedCity !== 'All' && !craft.city.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = craft.name.toLowerCase().includes(q);
        const matchDesc = craft.description.toLowerCase().includes(q);
        const matchMat = craft.materials.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchMat) return false;
      }
      return true;
    });
  }, [selectedCity, searchTerm]);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pt-28 sm:pt-32 pb-24 selection:bg-[#E03E3E] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
              Swadeshi GI Craft Guilds
            </span>
            <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-white">
              LIVING CRAFTS & ARTISANS
            </h1>
          </div>

          <p className="text-xs text-white/50 max-w-sm md:text-right leading-relaxed font-light">
            Support generational artisan clusters directly without middleman markups. From Blue Pottery to 24k gold-leaf Usta Art.
          </p>
        </div>

        {/* FLOATING DARK FILTER BAR */}
        <div className="bg-[#121318] rounded-2xl border border-white/10 shadow-2xl p-3 sm:p-4 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {/* Filter 1: Craft search */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                Craft / Material
              </label>
              <div className="flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Block print, gold leaf, stone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Filter 2: Region */}
            <div className="px-3 py-1 sm:border-r border-white/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                Artisan Region
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#121318] text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Artisan Clusters' : c}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: Info */}
            <div className="px-3 py-1 sm:border-r border-white/10 hidden lg:block">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-0.5">
                Direct Lineage
              </label>
              <p className="text-xs font-semibold text-white/80">
                100% GI-Tag Protected
              </p>
            </div>

            {/* Filter 4: Discover Button */}
            <div className="px-1">
              <button
                type="button"
                className="w-full py-2.5 px-5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E03E3E]/20 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Discover ({filteredCrafts.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Crafts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCrafts.map((craft) => (
            <div
              key={craft.slug}
              className="group bg-[#121318] rounded-[24px] overflow-hidden border border-white/8 hover:border-white/20 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Image Zone */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={craft.image}
                  alt={craft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-black/20 to-transparent pointer-events-none" />

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0A0B0E]/80 backdrop-blur-md text-[#E03E3E] border border-white/10">
                    {craft.giTag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-black text-xl leading-tight tracking-tight mb-0.5">
                    {craft.name}
                  </h3>
                  <p className="text-white/60 text-xs font-medium">
                    📍 {craft.artisanClusters} · {craft.city}
                  </p>
                </div>
              </div>

              {/* Description & Specs */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-white/60 line-clamp-3 leading-relaxed font-light">
                  {craft.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-semibold block">Materials</span>
                    <span className="text-white/80 font-medium truncate block">{craft.materials}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-semibold block">Craft Cluster</span>
                    <span className="text-white/80 font-medium truncate block">{craft.artisanClusters}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[11px] text-white/40">Verified Living Tradition</span>
                  <Link
                    href={`/explore?search=${encodeURIComponent(craft.name)}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-[11px] font-bold tracking-wider uppercase transition-all shadow-md shadow-[#E03E3E]/20"
                  >
                    <span>View Sanctuaries</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
