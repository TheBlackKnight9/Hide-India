'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight } from 'lucide-react';
import { rajasthanCities } from '../../data/rajasthanCities';
import { rajasthanFallbackPlaces } from '../../data/rajasthanFallbackPlaces';

export default function CitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filteredCities = useMemo(() => {
    return rajasthanCities.filter((city) => {
      if (selectedRegion !== 'All' && !city.name.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = city.name.toLowerCase().includes(q);
        const matchTitle = city.title.toLowerCase().includes(q);
        const matchCraft = city.crafts.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchTitle && !matchCraft) return false;
      }
      return true;
    });
  }, [selectedRegion, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f5f6f1] text-[#23261f] pb-24 selection:bg-[#E8402A] selection:text-white">
      {/* ── THREEUI ATMOSPHERIC PAGE HEADER ── */}
      <div className="threeui-page-header">
        <div className="ghost-watermark -bottom-6 -left-6">TERRITORIES</div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.24em] text-[#E8402A] uppercase block">
                Cultural Geography & Sovereign Lineages
              </span>
              <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-[#23261f] tracking-tight">
                ROYAL TERRITORIES
              </h1>
            </div>
            <p className="text-xs text-[#7c8177] max-w-md md:text-right leading-relaxed font-light">
              Each historical region preserves its own architectural identity, subterranean baoris, and living craft traditions across Rajasthan.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 -mt-6 relative z-20">
        {/* FLOATING THREEUI FILTER PANEL */}
        <div className="threeui-panel p-3 sm:p-4 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {/* Filter 1: City Search */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#7c8177] mb-0.5">
                City / Craft Keyword
              </label>
              <div className="flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5 text-[#7c8177] shrink-0" />
                <input
                  type="text"
                  placeholder="Jaipur, Blue Pottery, Bundi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#23261f] placeholder-[#7c8177]/60 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Filter 2: Region Selector */}
            <div className="px-3 py-1 sm:border-r border-black/10">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#7c8177] mb-0.5">
                Territory
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-[#f5f6f1] text-xs font-medium text-[#23261f] border border-black/10 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="All">All Territories</option>
                {rajasthanCities.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: Territory info */}
            <div className="px-3 py-1 sm:border-r border-black/10 hidden lg:block">
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#7c8177] mb-0.5">
                Territories
              </label>
              <p className="text-xs font-semibold text-[#23261f]">
                13 Documented Regions
              </p>
            </div>

            {/* Filter 4: Discover Button */}
            <div className="px-1">
              <button
                type="button"
                className="w-full py-2.5 px-5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E03E3E]/20 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Discover ({filteredCities.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => {
            const cityPlaces = rajasthanFallbackPlaces.filter((p) =>
              p.district.toLowerCase().includes(city.name.toLowerCase()) ||
              city.name.toLowerCase().includes(p.district.toLowerCase())
            );

            return (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="group bg-white rounded-[24px] overflow-hidden cursor-pointer select-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/8 border border-black/8 hover:border-black/20 flex flex-col justify-between"
              >
                {/* IMAGE ZONE */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top-Right: Sites count chip */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#23261f] border border-black/10 shadow-lg">
                      {cityPlaces.length} Sites
                    </span>
                  </div>

                  {/* Bottom: title + tagline on image */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                    <h3 className="text-white font-black text-xl leading-tight tracking-tight mb-1 group-hover:text-[#E03E3E] transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-white/80 text-[11px] font-medium line-clamp-1">{city.tagline}</p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="px-4 py-3.5 flex items-center justify-between bg-white border-t border-black/5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f5f6f1] text-[#555c4e] border border-black/8">
                      {city.era}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f5f6f1] text-[#555c4e] border border-black/8">
                      {city.crafts.length} GI Crafts
                    </span>
                  </div>

                  <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all group-hover:scale-105 bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/30">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
