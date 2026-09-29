'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Heart, Bookmark, ArrowRight, Sparkles, Camera } from 'lucide-react';
import { useSaved } from '../context/SavedContext';

const PlaceCard = ({ place }) => {
  const { isSaved, toggleSave } = useSaved();
  const [likes, setLikes] = useState(place.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasLiked) return;
    try {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      await fetch(`/api/places/${place.slug}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to like place:', err);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(place);
  };

  const saved = isSaved(place.id);

  return (
    <div className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Cover Image Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={place.coverImage || (place.images && place.images[0])}
          alt={place.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Top Right Action: Bookmark */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              saved
                ? 'bg-stone-900 text-white shadow-md'
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
            title={saved ? 'Remove from saved' : 'Save to itinerary'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Location Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex items-center space-x-1 text-xs font-semibold drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="text-white tracking-wide">{place.district}, Rajasthan</span>
          </div>

          {place.images && place.images.length > 1 && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] font-medium text-stone-200">
              <Camera className="w-3 h-3" />
              <span>{place.images.length} photos</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category & Century / Dynasty */}
        <div className="flex items-center space-x-2 text-[11px] font-medium text-stone-500 mb-2">
          {place.category && (
            <span className="bg-stone-100 text-stone-700 font-medium px-2.5 py-0.5 rounded-full">
              {place.category}
            </span>
          )}
          {place.century && (
            <span className="bg-stone-100 px-2.5 py-0.5 rounded-full text-stone-700">
              {place.century}
            </span>
          )}
          {place.dynasty && (
            <span className="truncate">
              {place.dynasty}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-sans text-lg font-bold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1 mb-2 tracking-tight">
          {place.title}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {place.tagline}
        </p>

        {/* GI Tag craft badge if present */}
        {place.giTagCraft && (
          <div className="mb-4 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center space-x-2 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate font-medium">Craft: {place.giTagCraft}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1.5 text-xs font-medium transition-colors cursor-pointer ${
              hasLiked ? 'text-red-600' : 'text-stone-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-red-600' : ''}`} />
            <span>{likes}</span>
          </button>

          {/* Details Link */}
          <Link
            href={`/place/${place.slug}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-900 hover:text-black uppercase tracking-wider"
          >
            <span>View Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
