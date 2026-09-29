'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Heart, Bookmark, Star, ArrowUpRight, Clock } from 'lucide-react';
import { useSaved } from '../context/SavedContext';

export default function PlaceCard({ place }) {
  const router = useRouter();
  const { isSaved, toggleSave } = useSaved();
  const [likes, setLikes] = useState(place.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    router.push(`/place/${place.slug}`);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasLiked) return;
    setLikes((p) => p + 1);
    setHasLiked(true);
    try {
      await fetch(`/api/places/${place.slug}/like`, { method: 'POST' });
    } catch {}
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(place);
  };

  const saved = isSaved(place.id);

  const coverImg =
    place.coverImage ||
    place.images?.[0] ||
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg';

  const isHidden = !place.isMajor;

  return (
    <div
      onClick={handleCardClick}
      className="group bg-[#121318] rounded-[24px] overflow-hidden cursor-pointer select-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/60 border border-white/8 hover:border-white/20 flex flex-col justify-between"
    >
      {/* ── IMAGE ZONE ── */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={coverImg}
          alt={place.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-black/20 to-transparent pointer-events-none" />

        {/* Top-Right: Bookmark Only (category pill removed) */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-all cursor-pointer backdrop-blur-md ${
              saved
                ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/40'
                : 'bg-black/40 hover:bg-black/60 text-white border border-white/15'
            }`}
            title={saved ? 'Remove Bookmark' : 'Save Sanctuary'}
          >
            <Bookmark className="w-3.5 h-3.5" style={{ fill: saved ? 'white' : 'none' }} />
          </button>
        </div>

        {/* Bottom title & location on dark gradient */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <div className="flex items-center space-x-1.5 mb-1.5">
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E03E3E] text-white">
              <Star className="w-2.5 h-2.5 fill-white" />
              <span>{isHidden ? '96% Heritage Match' : '89% Heritage Match'}</span>
            </div>
          </div>

          <h3 className="text-white font-black text-base leading-snug tracking-tight mb-1 line-clamp-1 group-hover:text-[#E03E3E] transition-colors">
            {place.title}
          </h3>

          <div className="flex items-center space-x-1 text-white/60 text-[11px] font-medium">
            <MapPin className="w-3 h-3 text-[#E03E3E] shrink-0" />
            <span className="truncate">{place.district}, Rajasthan</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER ZONE ── */}
      <div className="px-4 py-3.5 flex items-center justify-between bg-[#121318] border-t border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Like button */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              hasLiked
                ? 'bg-[#E03E3E]/20 text-[#E03E3E] border border-[#E03E3E]/30'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
            }`}
          >
            <Heart className="w-3.5 h-3.5" style={{ fill: hasLiked ? '#E03E3E' : 'none' }} />
            <span>{likes}</span>
          </button>

          {/* Visit duration (clean, no Rs info) */}
          {place.estimatedTime && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold bg-white/5 text-white/70 border border-white/10">
              <Clock className="w-2.5 h-2.5 text-[#3EBFA0] shrink-0" />
              <span>{place.estimatedTime}</span>
            </span>
          )}
        </div>

        {/* Dossier Arrow CTA */}
        <Link
          href={`/place/${place.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-md shadow-[#E03E3E]/30"
          title="Open Heritage Dossier"
        >
          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
}
