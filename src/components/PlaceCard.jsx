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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group bg-[#121318] rounded-[24px] overflow-hidden cursor-pointer select-none transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 border border-white/10 hover:border-[#E03E3E]/40 flex flex-col justify-between"
    >
      {/* ── IMAGE ZONE ── */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imgSrc}
          alt={place.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.9]"
          loading="lazy"
          onError={() => {
            setImgSrc(RELIABLE_FALLBACK_IMAGE);
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-black/30 to-transparent pointer-events-none" />

        {/* Top-Right: Bookmark Only */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-all cursor-pointer backdrop-blur-md ${
              saved
                ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/40'
                : 'bg-black/50 hover:bg-black/70 text-white border border-white/15'
            }`}
            title={saved ? 'Remove Bookmark' : 'Save Sanctuary'}
          >
            <Bookmark className="w-3.5 h-3.5" style={{ fill: saved ? 'white' : 'none' }} />
          </button>
        </div>

        {/* Bottom title & location on dark gradient */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <div className="flex items-center space-x-1.5 mb-1.5">
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E03E3E] text-white shadow-sm shadow-[#E03E3E]/30">
              <Star className="w-2.5 h-2.5 fill-white" />
              <span>{isHidden ? '96% Heritage Match' : '89% Heritage Match'}</span>
            </div>
          </div>

          <h3 className="headline-werlton text-white text-base leading-snug tracking-tight mb-1 line-clamp-1 group-hover:text-[#E03E3E] transition-colors">
            {place.title}
          </h3>

          <div className="flex items-center space-x-1 text-white/60 text-[11px] font-medium font-sans">
            <MapPin className="w-3 h-3 text-[#E03E3E] shrink-0" />
            <span className="truncate">{place.district}, Rajasthan</span>
          </div>
        </div>
      </div>

      {/* ── CARD FOOTER ROW ── */}
      <div className="px-4 py-3 bg-[#121318] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-xs font-semibold transition-colors cursor-pointer ${
              hasLiked ? 'text-[#E03E3E]' : 'text-white/40 hover:text-[#E03E3E]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>

          <span className="text-white/20">|</span>

          <span className="text-[11px] text-white/50 font-medium font-sans flex items-center space-x-1">
            <Clock className="w-3 h-3 text-white/40" />
            <span>{place.bestTimeToVisit ? 'Optimal Season' : '1.5 hrs'}</span>
          </span>
        </div>

        <Link
          href={`/place/${place.slug}`}
          className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#E03E3E] border border-white/10 hover:border-[#E03E3E] flex items-center justify-center text-white/60 hover:text-white transition-all shadow-xs group-hover:scale-105"
          title="Open Sanctuary Dossier"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
