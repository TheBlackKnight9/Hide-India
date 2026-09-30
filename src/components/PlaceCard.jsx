'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Heart, Bookmark, Star, ArrowUpRight, Clock } from 'lucide-react';
import { useSaved } from '../context/SavedContext';

const RELIABLE_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop';

export default function PlaceCard({ place }) {
  const router = useRouter();
  const { isSaved, toggleSave } = useSaved();
  const [likes, setLikes] = useState(place.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    place.coverImage || place.images?.[0] || RELIABLE_FALLBACK_IMAGE
  );

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
  const isHidden = !place.isMajor;

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group rounded-[26px] overflow-hidden cursor-pointer select-none transition-all duration-300 hover:shadow-xl hover:shadow-black/8 border border-black/8 hover:border-black/16 flex flex-col justify-between bg-white text-[#23261f]"
      style={{
        boxShadow: '0 8px 24px rgba(28, 33, 25, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* ── IMAGE ZONE ── */}
      <div className="relative overflow-hidden aspect-[16/11] p-2.5 pb-0">
        <div className="relative w-full h-full rounded-[20px] overflow-hidden">
          <img
            src={imgSrc}
            alt={place.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.95]"
            loading="lazy"
            onError={() => {
              setImgSrc(RELIABLE_FALLBACK_IMAGE);
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Top-Right: Bookmark Only */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition-all cursor-pointer backdrop-blur-md ${
                saved
                  ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/40'
                  : 'bg-white/85 hover:bg-white text-[#23261f] shadow-xs'
              }`}
              title={saved ? 'Remove Bookmark' : 'Save Sanctuary'}
            >
              <Bookmark className="w-3.5 h-3.5" style={{ fill: saved ? 'white' : 'none' }} />
            </button>
          </div>

          {/* Category Badge on image */}
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center space-x-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#23261f] shadow-xs">
              {place.category || 'Sanctuary'}
            </span>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E03E3E] text-white shadow-xs">
              <Star className="w-2.5 h-2.5 fill-white" />
              <span>{isHidden ? '96%' : '90%'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD BODY ── */}
      <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="headline-werlton text-[#23261f] text-base leading-snug tracking-tight line-clamp-1 group-hover:text-[#E03E3E] transition-colors">
            {place.title}
          </h3>

          <div className="flex items-center space-x-1 text-[#7c8177] text-[11px] font-medium font-sans">
            <MapPin className="w-3 h-3 text-[#E03E3E] shrink-0" />
            <span className="truncate">{place.district}, Rajasthan</span>
          </div>
        </div>

        {/* ── CARD FOOTER ROW ── */}
        <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3 text-[#7c8177]">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 font-semibold transition-colors cursor-pointer ${
                hasLiked ? 'text-[#E03E3E]' : 'hover:text-[#E03E3E]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-[#E03E3E]' : ''}`} />
              <span>{likes}</span>
            </button>

            <span className="text-black/10">|</span>

            <span className="text-[11px] font-medium flex items-center space-x-1">
              <Clock className="w-3 h-3 opacity-60" />
              <span>{place.bestTimeToVisit ? 'Optimal Season' : '1.5 hrs'}</span>
            </span>
          </div>

          <Link
            href={`/place/${place.slug}`}
            className="w-7 h-7 rounded-full bg-[#f2f4ec] hover:bg-[#E03E3E] border border-black/8 hover:border-[#E03E3E] flex items-center justify-center text-[#23261f] hover:text-white transition-all shadow-xs group-hover:scale-105"
            title="Open Sanctuary Dossier"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
