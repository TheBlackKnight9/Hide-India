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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold uppercase tracking-wider mb-3">
            <Bookmark className="w-3 h-3 text-amber-600" />
            <span>Personal Rajasthan Itinerary</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Saved Heritage Circuit ({savedPlaces.length})
          </h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">
            Curated list of Rajasthan citadels and stepwells bookmarked for your upcoming cultural journey.
          </p>
        </div>

        {savedPlaces.length > 0 && (
          <button
            onClick={handlePrint}
            className="self-start sm:self-auto px-4 py-2.5 rounded-full border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs font-semibold flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Print Travel Checklist</span>
          </button>
        )}
      </div>

      {savedPlaces.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
          <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-sans text-xl font-bold text-stone-800">Your Circuit is Empty</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-6">
            Bookmark stepwells, citadels, and artisan havelis while exploring to build your personalized travel checklist.
          </p>
          <Link
            href="/explore"
            className="px-6 py-3 rounded-full bg-stone-900 text-white font-semibold text-xs shadow-sm hover:bg-black transition-all inline-flex items-center space-x-2"
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
              className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-stone-100">
                <img
                  src={place.coverImage || (place.images && place.images[0])}
                  alt={place.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeSaved(place.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-stone-500 hover:text-red-600 hover:bg-white shadow-xs transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-stone-400 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{place.district}, Rajasthan</span>
                  </div>

                  <h3 className="font-sans text-lg font-bold text-stone-900 mb-2 leading-snug">
                    {place.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {place.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    {place.category}
                  </span>
                  <Link
                    href={`/place/${place.slug}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-900 hover:text-black uppercase tracking-wider"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
