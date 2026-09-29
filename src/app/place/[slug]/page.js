'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Clock,
  Ticket,
  Heart,
  Bookmark,
  Share2,
  Sparkles,
  BookOpen,
  Send,
  Star,
  CheckCircle,
  ArrowLeft,
  Camera,
  Compass,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Utensils,
  Sun,
  Navigation,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useSaved } from '../../../context/SavedContext';
import PlaceCard from '../../../components/PlaceCard';
import AIConciergeModal from '../../../components/AIConciergeModal';
import { rajasthanFallbackPlaces } from '../../../data/rajasthanFallbackPlaces';

function getEnrichedPlaceDetails(place) {
  if (!place) return null;

  // 1. Materiality & Architectural Engineering
  let materiality = place.materiality;
  if (!materiality) {
    if (place.district === 'Jaipur') materiality = 'Pink & Yellow Dholpur Sandstone with Makrana White Marble inlays and floral fresco stucco';
    else if (place.district === 'Jodhpur') materiality = 'Chittar Sandstone (rose-tinted Golden Red stone) carved with intricate geometric jali lattices';
    else if (place.district === 'Jaisalmer') materiality = 'Golden Jaisalmer Yellow Sandstone fitted dry without mortar using mortise and tenon joinery';
    else if (place.district === 'Bundi') materiality = 'Local sandstone with painted lime plaster and blue-green mineral pigment murals (Chitrashala school)';
    else if (place.district === 'Bikaner') materiality = 'Deep red Dulmera Sandstone with gold-leaf Usta woodwork and Belgian cut-glass mirror work';
    else if (place.district === 'Udaipur') materiality = 'Aravalli Quartzite base with Makrana marble balconies, toranas, and mirror mosaics';
    else if (place.district === 'Shekhawati') materiality = 'Sun-dried clay brick and lime-surkhi plaster painted with natural indigo, ochre, and vermilion frescoes';
    else materiality = 'Hand-chiseled Aravalli sandstone and lime mortar constructed according to ancient Vastu Shastra principles';
  }

  // 2. Curator's Note
  let curatorNote = place.curatorNote;
  if (!curatorNote) {
    if (place.category === 'Stepwell') {
      curatorNote = `Engineered as both subterranean air-cooling social sanctuaries and sacred water reservoirs, this baori represents the pinnacle of dry-arid architectural resilience. Notice how the temperature drops 5 to 7 degrees Celsius as you descend toward the aquatic cistern.`;
    } else if (place.category === 'Forgotten Fort') {
      curatorNote = `An extraordinary example of medieval military fortification, built along natural cliff ridgelines with multi-tiered ramparts, zigzag barbicans, and concealed rain-harvesting baoris that allowed garrison troops to withstand year-long sieges.`;
    } else if (place.category === 'Ancient Temple') {
      curatorNote = `Carved with extraordinary iconographic precision, the temple shikhara and mandapa pillars preserve medieval sculptural traditions that predate modern colonial urbanism.`;
    } else if (place.category === 'Living Crafts & Handloom') {
      curatorNote = `A living cultural repository where generational master artisans preserve UNESCO-recognized hand techniques. You can observe the raw block-carving, natural vegetable dyeing, or stone chiseling in real-time.`;
    } else {
      curatorNote = `A preserved cultural sanctuary of the ${place.district} region, celebrated for historical serenity, authentic architecture, and deep community heritage.`;
    }
  }

  // 3. Photography & Golden Hour Guide
  let photographyGuide = place.photographyGuide;
  if (!photographyGuide) {
    photographyGuide = {
      bestTime: place.category === 'Stepwell' ? '10:00 AM – 12:30 PM (when overhead sunlight reaches the lower geometric steps)' : '6:30 AM – 8:30 AM (Sunrise golden hour) or 4:30 PM – 6:15 PM (Dusk desert glow)',
      angles: place.category === 'Stepwell' 
        ? 'Frame symmetrically from the central pavilion landing looking directly down into the diamond stair pattern.'
        : 'Capture wide angles from the approach ramp to emphasize defensive scale against the desert skyline.',
      lighting: 'Soft directional morning light illuminates the stone relief work without harsh midday shadows.',
      tripodPolicy: 'Handheld photography permitted freely; tripods may require ASI or trustee desk intimation.'
    };
  }

  // 4. Crowd Heatmap & Pacing
  let crowdHeatmap = place.crowdHeatmap;
  if (!crowdHeatmap) {
    crowdHeatmap = {
      earlyMorning: '7:00 AM – 9:30 AM: Serene Calm (5-10% capacity, ideal for flâneurs & meditation)',
      midDay: '11:00 AM – 3:30 PM: Moderate / Day excursion travelers (30-60% capacity)',
      lateAfternoon: '4:00 PM – Sunset: Gentle evening breeze and local prayer calm',
      crowdQuotient: place.isMajor ? 'Moderate' : 'Zero Crowd Sanctuary (Highly Peaceful)',
      recommendedPace: place.estimatedTime || '2 Hours Immersive'
    };
  }

  // 5. Visitor Etiquette & Heritage Preservation
  let etiquette = place.etiquette;
  if (!etiquette) {
    etiquette = [
      'Respect water sanctity: Avoid throwing coins, food, or plastic into any kund or reservoir.',
      'Remove footwear where designated, especially near sanctums, chhatri platforms, and cenotaphs.',
      'Maintain voice moderation to preserve acoustic silence in enclosed stone chambers.',
      'Support generational artisans by purchasing directly without excessive bargaining.',
      'Do not deface or touch delicate lime-plaster frescoes and antique stonework.'
    ];
  }

  // 6. Local Heritage Culinary Pairing
  let culinaryPairing = place.culinaryPairing;
  if (!culinaryPairing) {
    if (place.district === 'Jaipur') culinaryPairing = 'Pyaaz Kachori & Rawat Lassi at old Johari Bazaar, followed by Ghevar';
    else if (place.district === 'Jodhpur') culinaryPairing = 'Mirchi Vada at Clock Tower, Mawa Kachori, and Makhaniya Lassi';
    else if (place.district === 'Udaipur') culinaryPairing = 'Dal Baati Churma cooked in pure ghee with spicy garlic chutney near Jagdish Chowk';
    else if (place.district === 'Bikaner') culinaryPairing = 'Bhujia, Rasgullas from station road, and authentic Bikaneri Ghevar';
    else if (place.district === 'Jaisalmer') culinaryPairing = 'Ker Sangri with hot bajra rotis and sweet Ghotua Laddoos';
    else if (place.district === 'Bundi') culinaryPairing = 'Hadoti Besan Chakki and piping hot kachoris with hing kadhi';
    else culinaryPairing = 'Authentic Rajasthani Dal Baati Churma and buttermilk (Chhaas)';
  }

  return {
    materiality,
    curatorNote,
    photographyGuide,
    crowdHeatmap,
    etiquette,
    culinaryPairing
  };
}

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const { isSaved, toggleSave } = useSaved();

  const [place, setPlace] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history'); 
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTips, setReviewTips] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchDossier = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/places/${slug}`).then((r) => r.json());
        if (res.success && res.data) {
          setPlace(res.data);
          setNearby(res.nearby || []);
          setLikes(res.data.likesCount || 0);
          return;
        }
      } catch (err) {
        console.warn('API sync notice: retrieving place from local verified archive:', err);
      } finally {
        setLoading(false);
      }

      // Fallback matching from verified archive
      const fallback = rajasthanFallbackPlaces.find((p) => p.slug === slug);
      if (fallback) {
        setPlace(fallback);
        setLikes(fallback.likesCount || 0);
        setNearby(
          rajasthanFallbackPlaces
            .filter((p) => p.district === fallback.district && p.id !== fallback.id)
            .slice(0, 3)
        );
      }
    };

    fetchDossier();
    window.scrollTo(0, 0);
  }, [slug]);

  const enriched = useMemo(() => getEnrichedPlaceDetails(place), [place]);

  const handleLike = async () => {
    if (hasLiked || !place) return;
    try {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      await fetch(`/api/places/${place.slug}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment || !place) return;

    try {
      setSubmittingReview(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: place.id,
          authorName: reviewAuthor,
          rating: reviewRating,
          comment: reviewComment,
          travelTips: reviewTips,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setPlace((prev) => ({
          ...prev,
          reviews: [res.data, ...(prev.reviews || [])],
        }));
        setReviewSuccess(true);
        setReviewAuthor('');
        setReviewComment('');
        setReviewTips('');
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-36 text-center">
        <div className="w-10 h-10 border-3 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-sans text-stone-600 text-base">Unveiling Rajasthan heritage dossier...</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-36 text-center">
        <h2 className="font-sans text-2xl font-bold text-stone-800">Destination Not Found</h2>
        <p className="text-stone-500 mt-2 text-sm">The requested heritage dossier could not be located.</p>
        <Link href="/explore" className="mt-4 inline-block px-5 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold">
          Return to Rajasthan Atlas
        </Link>
      </div>
    );
  }

  const saved = isSaved(place.id);
  const coverImg = place.coverImage || (place.images && place.images[0]);

  return (
    <div className="min-h-screen pb-24 pt-24 sm:pt-28 bg-[#0A0B0E] text-white selection:bg-[#E03E3E] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP BREADCRUMB & METADATA BAR
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center space-x-2 truncate">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href={`/cities/${place.district.toLowerCase()}`} className="hover:text-white">
              {place.district}
            </Link>
            <span>/</span>
            <span className="font-semibold text-white truncate">{place.title}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white shadow-2xs flex items-center space-x-1 cursor-pointer"
              title="Copy dossier link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold hidden sm:inline">Share</span>
            </button>
            {copied && <span className="text-[10px] text-[#3EBFA0] font-bold">Link Copied!</span>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ─────────────────────────────────────────────────────────────
            2. CINEMATIC COVER PHOTO WITH AMBIENT HERO
           ───────────────────────────────────────────────────────────── */}
        <div className="relative aspect-[16/10] sm:aspect-[21/9] rounded-[32px] overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
          <img
            src={coverImg}
            alt={place.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-black/30 to-black/30 pointer-events-none" />

          {/* Top Actions Only (Pill tags removed as requested) */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-end">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`px-3 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer ${
                  hasLiked ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/40' : 'bg-black/50 text-white hover:bg-black/70 border border-white/15'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>

              <button
                onClick={() => toggleSave(place)}
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  saved ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/40' : 'bg-black/50 text-white hover:bg-black/70 border border-white/15'
                }`}
                title={saved ? 'Remove from itinerary' : 'Save to itinerary'}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bottom Title & District */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center space-x-2 text-xs font-medium text-[#E03E3E]">
              <MapPin className="w-4 h-4" />
              <span>{place.district}, Rajasthan</span>
              {place.century && (
                <>
                  <span>•</span>
                  <span>{place.century}</span>
                </>
              )}
            </div>
            <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              {place.title}
            </h1>
            <p className="text-white/70 text-xs sm:text-base max-w-3xl leading-relaxed font-light drop-shadow">
              {place.tagline}
            </p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. QUICK HERITAGE SPECS CAPSULE (4 Micro Columns)
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#121318] p-4 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">
              Historical Era
            </span>
            <p className="text-xs font-semibold text-white leading-snug">
              {place.century || 'Medieval Heritage'}
            </p>
          </div>

          <div className="bg-[#121318] p-4 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">
              Visiting Hours
            </span>
            <p className="text-xs font-semibold text-white leading-snug">
              {place.timings || 'Sunrise to Sunset'}
            </p>
          </div>

          <div className="bg-[#121318] p-4 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">
              Sanctuary Access
            </span>
            <p className="text-xs font-semibold text-white leading-snug">
              {place.timings ? 'Open for Exploration' : 'Public Heritage Site'}
            </p>
          </div>

          <div className="bg-[#121318] p-4 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">
              Living GI Craft
            </span>
            <p className="text-xs font-semibold text-white leading-snug truncate">
              {place.giTagCraft || 'Generational Artisan Lineage'}
            </p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. CURATOR'S NOTE & HIGHLIGHT BANNER
           ───────────────────────────────────────────────────────────── */}
        <div className="bg-[#121318] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#E03E3E]/20 text-[#E03E3E] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#E03E3E]" />
            </div>
            <div>
              <h3 className="headline-werlton text-sm text-white">
                Curator's Field Note & Significance
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed mt-1 font-light italic">
                "{enriched?.curatorNote}"
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. SPECIALIZED 7-TAB NAVIGATOR (Detailed Content for Every Place)
           ───────────────────────────────────────────────────────────── */}
        <div className="flex border-b border-white/10 space-x-2 sm:space-x-4 overflow-x-auto scrollbar-none text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-b-2 border-[#E03E3E] text-[#E03E3E]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            History & Architecture
          </button>

          <button
            onClick={() => setActiveTab('folklore')}
            className={`pb-3 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'folklore'
                ? 'border-b-2 border-[#E03E3E] text-[#E03E3E]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Oral Folklore & Legends
          </button>

          <button
            onClick={() => setActiveTab('photography')}
            className={`pb-3 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'photography'
                ? 'border-b-2 border-[#E03E3E] text-[#E03E3E]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Photography & Golden Hour
          </button>

          <button
            onClick={() => setActiveTab('crowd')}
            className={`pb-3 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'crowd'
                ? 'border-b-2 border-[#E03E3E] text-[#E03E3E]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Crowd Heatmap & Time
          </button>

          <button
            onClick={() => setActiveTab('reach')}
            className={`pb-3 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'reach'
                ? 'border-b-2 border-[#E03E3E] text-[#E03E3E]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Directions & Maps
          </button>

          <button
            onClick={() => setActiveTab('etiquette')}
            className={`pb-3 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'etiquette'
                ? 'border-b-2 border-[#E03E3E] text-[#E03E3E]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Etiquette & Food Pairing
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-b-2 border-[#E03E3E] text-[#E03E3E]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Travel Notes ({place.reviews?.length || 0})
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            6. TAB CONTENT PANELS
           ───────────────────────────────────────────────────────────── */}
        <div className="bg-[#121318] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-white">
          {/* TAB 1: HISTORY & ARCHITECTURE */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Historical Chronicle
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-stone-900">
                  Architectural Genesis & Dynastic Lineage
                </h3>
              </div>

              <div className="prose text-stone-700 text-sm sm:text-base leading-relaxed font-serif whitespace-pre-line">
                {place.history}
              </div>

              {/* Materiality Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center space-x-2 text-stone-900 font-bold text-xs uppercase tracking-wider mb-1.5">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>Stone & Materiality</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {enriched?.materiality}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center space-x-2 text-stone-900 font-bold text-xs uppercase tracking-wider mb-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>Architectural Style</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {place.architecturalStyle || 'Traditional Rajput & Indo-Islamic Syncretic Architecture'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORAL FOLKLORE & LEGENDS */}
          {activeTab === 'folklore' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Oral Traditions
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-stone-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Oral Legends & Community Folklore</span>
                </h3>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-stone-800 text-sm sm:text-base font-serif italic leading-relaxed">
                "{place.folklore || 'Generational villagers in this territory recall songs sung during dry monsoons praising the subterranean waters and guardian spirits who protected this sanctuary.'}"
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-2">
                <p className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">
                  Cultural Preservation Note:
                </p>
                <p>
                  Oral histories in Rajasthan are preserved by generational bards (Bhats and Charans) who memorize centuries of genealogy and folklore without writing them in formal state archives.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOGRAPHY & GOLDEN HOUR */}
          {activeTab === 'photography' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Visual Guide
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-stone-900 flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-stone-700" />
                  <span>Photography & Golden Hour Lighting Guide</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>Optimal Lighting Window</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {enriched?.photographyGuide?.bestTime}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center space-x-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                    <Eye className="w-4 h-4 text-stone-700" />
                    <span>Recommended Vantage Point</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {enriched?.photographyGuide?.angles}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-600">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px] block">
                  Equipment & Permission Etiquette
                </span>
                <p>{enriched?.photographyGuide?.lighting}</p>
                <p className="text-stone-500 font-medium pt-1">
                  {enriched?.photographyGuide?.tripodPolicy}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CROWD HEATMAP & TIME */}
          {activeTab === 'crowd' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Pacing & Serenity
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-stone-900 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Crowd Heatmap & Time Budget Guide</span>
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start space-x-3 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                  <div>
                    <strong className="text-emerald-950 font-bold block">Early Morning Calm:</strong>
                    <span className="text-emerald-800">{enriched?.crowdHeatmap?.earlyMorning}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start space-x-3 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 mt-1 shrink-0" />
                  <div>
                    <strong className="text-amber-950 font-bold block">Midday Excursions:</strong>
                    <span className="text-amber-800">{enriched?.crowdHeatmap?.midDay}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start space-x-3 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-600 mt-1 shrink-0" />
                  <div>
                    <strong className="text-stone-950 font-bold block">Sunset Calms:</strong>
                    <span className="text-stone-700">{enriched?.crowdHeatmap?.lateAfternoon}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-100 text-xs text-stone-700 flex items-center justify-between">
                <span>
                  <strong>Recommended Pacing:</strong> {enriched?.crowdHeatmap?.recommendedPace}
                </span>
                <span className="font-bold text-emerald-700">
                  {enriched?.crowdHeatmap?.crowdQuotient}
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: DIRECTIONS & MAPS */}
          {activeTab === 'reach' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Navigation
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-stone-900">
                  Directions, Transit & Coordinates
                </h3>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed">
                {place.howToReach || `Located in ${place.district}, Rajasthan. Easily accessible from the main town center by local cab or auto-rickshaw.`}
              </p>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-stone-900 block mb-0.5">Exact GPS Coordinates</span>
                  <span className="text-stone-600 font-mono text-xs">{place.latitude}° N, {place.longitude}° E</span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white rounded-full font-semibold transition-all inline-flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 6: ETIQUETTE & CULINARY PAIRING */}
          {activeTab === 'etiquette' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Responsible Travel
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-stone-900">
                  Visitor Etiquette & Local Culinary Pairing
                </h3>
              </div>

              {/* Etiquette Rules */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                  Heritage Preservation Etiquette:
                </span>
                <div className="space-y-2">
                  {enriched?.etiquette.map((rule, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-stone-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Culinary Pairing */}
              <div className="pt-4 border-t border-stone-100">
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start space-x-3 text-xs">
                  <Utensils className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-950 font-bold block mb-1">
                      Local Culinary Pairing in {place.district}:
                    </strong>
                    <span className="text-amber-900 leading-relaxed">
                      {enriched?.culinaryPairing}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS & NOTES */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fadeIn">
              {reviewSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your travel note has been added to the Rajasthan dossier.</span>
                </div>
              )}

              {/* Submit Review */}
              <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Leave a Travel Note or Heritage Tip
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
                    <option value={3}>⭐⭐⭐ (Worth Visiting)</option>
                  </select>
                </div>
                <textarea
                  required
                  rows="3"
                  placeholder="Share details on crowd timings, photography tips, or respectful visitor etiquette..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-semibold cursor-pointer transition-all"
                >
                  {submittingReview ? 'Submitting...' : 'Post Travel Note'}
                </button>
              </form>

              {/* Existing Reviews */}
              {place.reviews && place.reviews.length > 0 ? (
                <div className="space-y-4">
                  {place.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl border border-stone-100 bg-white space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900">{rev.authorName}</span>
                        <span className="text-amber-500">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">No notes yet. Be the first to add a visitor review.</p>
              )}
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            7. AI CONCIERGE ASSISTANCE CALLOUT
           ───────────────────────────────────────────────────────────── */}
        <div className="p-6 sm:p-8 bg-stone-900 text-white rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5">
            <span className="inline-flex items-center space-x-1.5 text-xs text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Travel Companion</span>
            </span>
            <h3 className="font-sans text-xl sm:text-2xl font-bold text-white">
              Need a personalized route including {place.title}?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              Our AI Concierge can calculate exact transit times from your hotel or plan a stepwell & artisan trail.
            </p>
          </div>

          <button
            onClick={() => setIsAiOpen(true)}
            className="px-6 py-3 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs uppercase tracking-wider shadow-md transition-all shrink-0 cursor-pointer"
          >
            Ask AI Concierge →
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            8. NEARBY SANCTUARIES IN DISTRICT (Clickable PlaceCards)
           ───────────────────────────────────────────────────────────── */}
        {nearby && nearby.length > 0 && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
                  District Circuit
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-stone-900">
                  Nearby Sanctuaries in {place.district}
                </h3>
              </div>

              <Link
                href={`/cities/${place.district.toLowerCase()}`}
                className="text-xs font-semibold text-stone-900 hover:text-black uppercase tracking-wider"
              >
                View All {place.district} Sites →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearby.map((nearPlace) => (
                <PlaceCard key={nearPlace.id} place={nearPlace} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Concierge Modal */}
      <AIConciergeModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialQuery={`I want to visit ${place.title} in ${place.district}. What are the best hidden gems and stepwells nearby, and what is the ideal time budget?`}
      />
    </div>
  );
}
