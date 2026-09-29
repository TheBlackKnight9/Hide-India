'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, MapPin, Trash2, ArrowRight, Printer, Compass } from 'lucide-react';
import { useSaved } from '../../context/SavedContext';

export default function SavedPage() {
  const { savedPlaces, removeSaved } = useSaved();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pt-28 sm:pt-32 pb-24 selection:bg-[#E03E3E] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
              Personal Expedition Dossier
            </span>
            <h1 className="headline-werlton text-3xl sm:text-5xl text-white">
              SAVED SANCTUARIES ({savedPlaces.length})
            </h1>
            <p className="text-xs sm:text-sm text-white/50 mt-1 font-light max-w-xl leading-relaxed">
              Curated list of citadels and stepwells bookmarked for your upcoming cultural journey.
            </p>
          </div>

          {savedPlaces.length > 0 && (
            <button
              onClick={handlePrint}
              className="self-start sm:self-auto px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-white/70" />
              <span>Print Checklist</span>
            </button>
          )}
        </div>

        {savedPlaces.length === 0 ? (
          <div className="text-center py-20 bg-[#121318] rounded-3xl border border-white/10 p-8 shadow-2xl">
            <Bookmark className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <h3 className="font-sans text-xl font-bold text-white">Your Circuit is Empty</h3>
            <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto mb-6 font-light">
              Bookmark stepwells, citadels, and artisan havelis while exploring to build your personalized travel checklist.
            </p>
            <Link
              href="/explore"
              className="px-6 py-3 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#E03E3E]/20 transition-all inline-flex items-center space-x-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Rajasthan Atlas</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-[#121318] rounded-[24px] border border-white/8 hover:border-white/20 overflow-hidden shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10]">
                  <img
                    src={place.coverImage || (place.images && place.images[0])}
                    alt={place.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-black/20 to-transparent pointer-events-none" />

                  <button
                    onClick={() => removeSaved(place.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white/70 hover:text-red-400 hover:bg-black/80 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-black text-lg leading-tight mb-1">
                      {place.title}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-white/60">
                      <MapPin className="w-3.5 h-3.5 text-[#E03E3E]" />
                      <span>{place.district}, Rajasthan</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4 font-light">
                    {place.tagline}
                  </p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-white/40">
                      Heritage Dossier
                    </span>

                    <Link
                      href={`/place/${place.slug}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#E03E3E] hover:text-white transition-colors"
                    >
                      <span>Open Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
