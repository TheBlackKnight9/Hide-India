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
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Maximize2
} from 'lucide-react';
import { useSaved } from '../../../context/SavedContext';
import PlaceCard from '../../../components/PlaceCard';
import PlaceLivingHero from '../../../components/PlaceLivingHero';
import AIConciergeModal from '../../../components/AIConciergeModal';
import { rajasthanFallbackPlaces } from '../../../data/rajasthanFallbackPlaces';

function getEnrichedPlaceDetails(place) {
  if (!place) return null;

  // 1. Materiality & Architectural Engineering
  let materiality = place.materiality;
  if (!materiality) {
    if (place.district === 'Jaipur') materiality = 'Pink and Yellow Dholpur Sandstone with Makrana White Marble inlays and floral fresco stucco';
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
      bestTime: place.category === 'Stepwell' ? '10:00 AM - 12:30 PM (when overhead sunlight reaches the lower geometric steps)' : '6:30 AM - 8:30 AM (Sunrise golden hour) or 4:30 PM - 6:15 PM (Dusk desert glow)',
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
      earlyMorning: '7:00 AM - 9:30 AM: Serene Calm (5-10% capacity, ideal for flaneurs and meditation)',
      midDay: '11:00 AM - 3:30 PM: Moderate / Day excursion travelers (30-60% capacity)',
      lateAfternoon: '4:00 PM - Sunset: Gentle evening breeze and local prayer calm',
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
    if (place.district === 'Jaipur') culinaryPairing = 'Pyaaz Kachori and Rawat Lassi at old Johari Bazaar, followed by Ghevar';
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
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

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
      <div className="min-h-screen bg-[#0B0E0C] text-white flex flex-col items-center justify-center py-36">
        <div className="w-10 h-10 border-3 border-[#3EBFA0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-sans text-white/70 text-base font-light">Unveiling Rajasthan living sanctuary dossier...</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-[#0B0E0C] text-white flex flex-col items-center justify-center py-36 px-4 text-center">
        <h2 className="headline-werlton text-3xl font-bold text-white">Destination Not Found</h2>
        <p className="text-white/60 mt-2 text-sm font-light">The requested heritage dossier could not be located.</p>
        <Link
          href="/explore"
          className="mt-6 inline-flex items-center px-6 py-3 bg-[#E03E3E] hover:bg-[#c93232] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E03E3E]/30"
        >
          Return to Rajasthan Atlas
        </Link>
      </div>
    );
  }

  const saved = isSaved(place.id);
  const galleryImages = [
    place.coverImage,
    ...(place.images || [])
  ].filter(Boolean);
  const uniqueGallery = Array.from(new Set(galleryImages));

  return (
    <div className="min-h-screen bg-[#f5f6f1] text-[#23261f] selection:bg-[#E03E3E] selection:text-white relative overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. FULL-BLEED 3D LIVING WORLD HERO (Place's Own Photo)
             - 3,200 Glowing 3D Pollen Motes
             - Interactive Cursor Spray (Fairy Dust Trail)
             - Pointer Parallax & 24s Ambient Wall Breathing
             - Zero Butterfly (only on landing page)
          ───────────────────────────────────────────────────────────── */}
      <PlaceLivingHero
        place={place}
        likes={likes}
        hasLiked={hasLiked}
        handleLike={handleLike}
        saved={saved}
        toggleSave={toggleSave}
        handleShare={handleShare}
        copied={copied}
        onOpenFolklore={() => {
          setActiveTab('folklore');
          const el = document.getElementById('dossier-content');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Ghost Watermark Background Word */}
      <div className="ghost-watermark text-black/5 select-none pointer-events-none" aria-hidden="true">
        {place.district}
      </div>

      {/* Ambient Sanctuary Glow Orbs */}
      <div className="absolute top-[90vh] left-1/4 w-96 h-96 rounded-full bg-[#385338]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[160vh] right-12 w-96 h-96 rounded-full bg-[#E03E3E]/5 blur-3xl pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN DOSSIER BODY (ThreeUI Living Sanctuary Theme)
         ───────────────────────────────────────────────────────────── */}
      <main id="dossier-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 relative z-10">

        {/* ── Curator's Field Note & Significance ── */}
        <section className="threeui-card p-6 sm:p-10 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#1b8a6b]/15 border border-[#1b8a6b]/30 text-[#1b8a6b] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#1b8a6b]" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#1b8a6b] block">
                Sanctuary Significance - Field Notes
              </span>
              <h2 className="headline-werlton text-xl sm:text-2xl text-[#23261f]">
                Architectural Resilience of {place.title}
              </h2>
              <p className="text-sm sm:text-base text-[#555c4e] leading-relaxed font-light italic">
                "{enriched?.curatorNote}"
              </p>
            </div>
          </div>
        </section>

        {/* ── Ambient Audio Companion Player ── */}
        <section className="threeui-panel p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setIsAudioPlaying(!isAudioPlaying)}
              className="w-11 h-11 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white flex items-center justify-center shadow-lg shadow-[#E03E3E]/30 transition-all cursor-pointer shrink-0"
              aria-label={isAudioPlaying ? 'Pause Audio Guide' : 'Play Audio Guide'}
            >
              {isAudioPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b8a6b] block">
                Sonic Archive · Ambient Resonance
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#23261f]">
                {place.title} Acoustic Atmosphere & Bardic Chants
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#7c8177]">
            <span className="w-2 h-2 rounded-full bg-[#1b8a6b] animate-pulse" />
            <span>{isAudioPlaying ? 'Playing Ambient Atmosphere' : 'Click to Immerse in Soundscape'}</span>
          </div>
        </section>

        {/* ── 7-Tab Specialized Navigator (ThreeUI Sylva Dock) ── */}
        <div className="flex justify-center w-full">
          <div className="sylva-dock w-full sm:w-auto overflow-x-auto scrollbar-none p-1.5 justify-start sm:justify-center">
            {[
              { id: 'history', label: 'History & Architecture', icon: Layers },
              { id: 'folklore', label: 'Oral Folklore & Legends', icon: Sparkles },
              { id: 'photography', label: 'Photography & Light', icon: Camera },
              { id: 'crowd', label: 'Crowd Heatmap', icon: Clock },
              { id: 'reach', label: 'Directions & GPS', icon: Compass },
              { id: 'etiquette', label: 'Etiquette & Food', icon: Utensils },
              { id: 'reviews', label: `Travel Notes (${place.reviews?.length || 0})`, icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={isActive ? 'sylva-pill-active' : 'sylva-dock-item'}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1c2018]' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab Content Panels (ThreeUI Living Sanctuary Cards) ── */}
        <div className="threeui-card p-6 sm:p-10 space-y-6 text-[#23261f] shadow-xl">

          {/* TAB 1: HISTORY & ARCHITECTURE */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#1b8a6b] uppercase tracking-wider block mb-1">
                  Historical Chronicle
                </span>
                <h3 className="headline-werlton text-2xl sm:text-3xl text-[#23261f]">
                  Architectural Genesis & Dynastic Lineage
                </h3>
              </div>

              <div className="text-[#555c4e] text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
                {place.history}
              </div>

              {/* Stone Materiality & Style Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-black/8">
                <div className="bg-[#f5f6f1] border border-black/8 rounded-2xl p-5 space-y-2 text-[#23261f]">
                  <div className="flex items-center space-x-2 text-[#23261f] font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-[#1b8a6b]" />
                    <span>Stone & Materiality</span>
                  </div>
                  <p className="text-xs text-[#555c4e] leading-relaxed font-light">
                    {enriched?.materiality}
                  </p>
                </div>

                <div className="bg-[#f5f6f1] border border-black/8 rounded-2xl p-5 space-y-2 text-[#23261f]">
                  <div className="flex items-center space-x-2 text-[#23261f] font-bold text-xs uppercase tracking-wider">
                    <Compass className="w-4 h-4 text-[#1b8a6b]" />
                    <span>Architectural Style & Sthapatya</span>
                  </div>
                  <p className="text-xs text-[#555c4e] leading-relaxed font-light">
                    {place.architecturalStyle || 'Traditional Rajput & Indo-Islamic Syncretic Architecture'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORAL FOLKLORE & LEGENDS */}
          {activeTab === 'folklore' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#1b8a6b] uppercase tracking-wider block mb-1">
                  Living Memory
                </span>
                <h3 className="headline-werlton text-2xl sm:text-3xl text-[#23261f] flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#1b8a6b]" />
                  <span>Oral Legends & Community Memory</span>
                </h3>
              </div>

              <div className="threeui-panel p-6 sm:p-8 text-[#555c4e] text-sm sm:text-base font-light italic leading-relaxed shadow-sm">
                "{place.folklore || 'Generational villagers in this territory recall songs sung during dry monsoons praising the subterranean waters and guardian spirits who protected this sanctuary.'}"
              </div>

              <div className="bg-[#f5f6f1] border border-black/8 rounded-2xl p-5 text-xs text-[#555c4e] space-y-2 font-light">
                <p className="font-bold text-[#23261f] uppercase tracking-wider text-[10px]">
                  Bardic Heritage Preservation:
                </p>
                <p>
                  Oral histories across Rajasthan have been memorized and performed across millennia by bards (Charans and Bhats), who maintain unwritten genealogies and heroic ballads passed from elder to apprentice.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOGRAPHY & GOLDEN HOUR */}
          {activeTab === 'photography' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#1b8a6b] uppercase tracking-wider block mb-1">
                  Lighting & Perspective
                </span>
                <h3 className="headline-werlton text-2xl sm:text-3xl text-[#23261f] flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-[#1b8a6b]" />
                  <span>Photography & Golden Hour Lighting Guide</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#f5f6f1] border border-black/8 rounded-2xl p-5 space-y-2 text-[#23261f]">
                  <div className="flex items-center space-x-2 text-[#23261f] font-bold text-xs uppercase tracking-wider">
                    <Sun className="w-4 h-4 text-[#1b8a6b]" />
                    <span>Optimal Lighting Window</span>
                  </div>
                  <p className="text-xs text-[#555c4e] leading-relaxed font-light">
                    {enriched?.photographyGuide?.bestTime}
                  </p>
                </div>

                <div className="bg-[#f5f6f1] border border-black/8 rounded-2xl p-5 space-y-2 text-[#23261f]">
                  <div className="flex items-center space-x-2 text-[#23261f] font-bold text-xs uppercase tracking-wider">
                    <Eye className="w-4 h-4 text-[#1b8a6b]" />
                    <span>Recommended Vantage Point</span>
                  </div>
                  <p className="text-xs text-[#555c4e] leading-relaxed font-light">
                    {enriched?.photographyGuide?.angles}
                  </p>
                </div>
              </div>

              <div className="threeui-panel p-5 space-y-2 text-xs text-[#555c4e] font-light shadow-sm">
                <span className="font-bold text-[#23261f] uppercase tracking-wider text-[10px] block">
                  Equipment & Permission Etiquette
                </span>
                <p>{enriched?.photographyGuide?.lighting}</p>
                <p className="text-[#7c8177] font-medium pt-1">
                  {enriched?.photographyGuide?.tripodPolicy}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CROWD HEATMAP & TIME */}
          {activeTab === 'crowd' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#1b8a6b] uppercase tracking-wider block mb-1">
                  Optimal Serenity Window
                </span>
                <h3 className="headline-werlton text-2xl sm:text-3xl text-[#23261f] flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#1b8a6b]" />
                  <span>Crowd Heatmap & Time Budget Guide</span>
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-950">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0 shadow-sm shadow-emerald-500/50" />
                  <div>
                    <strong className="text-emerald-900 font-bold block">Early Morning Calm:</strong>
                    <span className="text-emerald-800 font-light">{enriched?.crowdHeatmap?.earlyMorning}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-950">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0 shadow-sm shadow-amber-500/50" />
                  <div>
                    <strong className="text-amber-900 font-bold block">Midday Excursions:</strong>
                    <span className="text-amber-800 font-light">{enriched?.crowdHeatmap?.midDay}</span>
                  </div>
                </div>

                <div className="bg-[#f5f6f1] border border-black/8 rounded-2xl p-4 flex items-start space-x-3 text-xs text-[#23261f]">
                  <span className="w-2.5 h-2.5 rounded-full bg-black/40 mt-1 shrink-0" />
                  <div>
                    <strong className="text-[#23261f] font-bold block">Sunset Calms:</strong>
                    <span className="text-[#555c4e] font-light">{enriched?.crowdHeatmap?.lateAfternoon}</span>
                  </div>
                </div>
              </div>

              <div className="threeui-panel p-4 text-xs text-[#555c4e] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                <span>
                  <strong className="text-[#23261f]">Recommended Pacing:</strong> {enriched?.crowdHeatmap?.recommendedPace}
                </span>
                <span className="font-bold text-[#1b8a6b]">
                  {enriched?.crowdHeatmap?.crowdQuotient}
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: DIRECTIONS & MAPS */}
          {activeTab === 'reach' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#1b8a6b] uppercase tracking-wider block mb-1">
                  Access & Transit
                </span>
                <h3 className="headline-werlton text-2xl sm:text-3xl text-[#23261f]">
                  Directions, Transit & Coordinates
                </h3>
              </div>

              <p className="text-sm text-[#555c4e] leading-relaxed font-light">
                {place.howToReach || `Located in ${place.district}, Rajasthan. Easily accessible from the main town center by local cab or auto-rickshaw.`}
              </p>

              <div className="threeui-panel p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm">
                <div>
                  <span className="font-bold text-[#23261f] block mb-0.5">Exact GPS Coordinates</span>
                  <span className="text-[#7c8177] font-mono text-xs">{place.latitude}° N, {place.longitude}° E</span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#23261f] hover:bg-black text-white rounded-full font-bold transition-all inline-flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 6: ETIQUETTE & CULINARY PAIRING */}
          {activeTab === 'etiquette' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#1b8a6b] uppercase tracking-wider block mb-1">
                  Responsible Travel
                </span>
                <h3 className="headline-werlton text-2xl sm:text-3xl text-[#23261f]">
                  Visitor Etiquette & Local Culinary Pairing
                </h3>
              </div>

              {/* Etiquette Rules */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#23261f] block">
                  Heritage Preservation Etiquette:
                </span>
                <div className="space-y-2">
                  {enriched?.etiquette.map((rule, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-[#555c4e] font-light">
                      <ShieldCheck className="w-4 h-4 text-[#1b8a6b] shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Culinary Pairing */}
              <div className="pt-4 border-t border-black/8">
                <div className="bg-[#f5f6f1] border border-black/8 rounded-2xl p-5 flex items-start space-x-3 text-xs text-[#23261f]">
                  <Utensils className="w-4 h-4 text-[#E03E3E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#23261f] font-bold block mb-1">
                      Local Culinary Pairing in {place.district}:
                    </strong>
                    <span className="text-[#555c4e] leading-relaxed font-light">
                      {enriched?.culinaryPairing}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS & NOTES */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviewSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your travel note has been added to the Rajasthan dossier.</span>
                </div>
              )}

              {/* Submit Review */}
              <form onSubmit={handleReviewSubmit} className="threeui-panel p-5 space-y-4 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#23261f]">
                  Leave a Travel Note or Heritage Tip
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="px-3 py-2 bg-[#f5f6f1] border border-black/10 rounded-xl text-xs text-[#23261f] placeholder-[#7c8177]/60 focus:outline-none focus:border-[#E03E3E]"
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="px-3 py-2 bg-[#f5f6f1] border border-black/10 rounded-xl text-xs text-[#23261f] focus:outline-none focus:border-[#E03E3E]"
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
                  className="w-full px-3 py-2 bg-[#f5f6f1] border border-black/10 rounded-xl text-xs text-[#23261f] placeholder-[#7c8177]/60 focus:outline-none focus:border-[#E03E3E]"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-[#E03E3E]/30"
                >
                  {submittingReview ? 'Submitting...' : 'Post Travel Note'}
                </button>
              </form>

              {/* Existing Reviews */}
              {place.reviews && place.reviews.length > 0 ? (
                <div className="space-y-4">
                  {place.reviews.map((rev) => (
                    <div key={rev.id} className="bg-[#f5f6f1] border border-black/8 rounded-2xl p-4 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#23261f]">{rev.authorName}</span>
                        <span className="text-[#1b8a6b]">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-xs text-[#555c4e] leading-relaxed font-light">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#7c8177] italic">No notes yet. Be the first to add a visitor review.</p>
              )}
            </div>
          )}
        </div>

        {/* ── Verified Photographic Perspectives ── */}
        {uniqueGallery.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1b8a6b] block mb-0.5">
                  Visual Archive
                </span>
                <h3 className="headline-werlton text-xl sm:text-2xl text-[#23261f]">
                  Photographic Angles & Perspectives
                </h3>
              </div>
              <span className="text-xs text-[#7c8177]">{uniqueGallery.length} Verified Perspectives</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {uniqueGallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxImg(imgUrl)}
                  className="threeui-card group relative aspect-[16/10] overflow-hidden cursor-pointer shadow-md"
                >
                  <img
                    src={imgUrl}
                    alt={`${place.title} perspective ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-semibold text-white flex items-center space-x-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-white" />
                      <span>Expand High-Res View</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── AI Concierge Route Callout ── */}
        <section className="threeui-card p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 text-xs text-[#1b8a6b] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Time-Budgeted Itinerary Concierge</span>
            </span>
            <h3 className="headline-werlton text-2xl sm:text-3xl text-[#23261f]">
              Need a personalized route including {place.title}?
            </h3>
            <p className="text-xs sm:text-sm text-[#555c4e] font-light max-w-xl">
              Tell our AI how many hours you have in {place.district}. It calculates live transit times and pairs this site with zero-crowd stepwells and artisan workshops.
            </p>
          </div>

          <button
            onClick={() => setIsAiOpen(true)}
            className="px-7 py-3.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E03E3E]/30 transition-all shrink-0 cursor-pointer hover:scale-105"
          >
            Launch AI Itinerary →
          </button>
        </section>

        {/* ── Nearby Sister Sanctuaries in District ── */}
        {nearby && nearby.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1b8a6b] block mb-0.5">
                  Territory Circuit
                </span>
                <h3 className="headline-werlton text-2xl sm:text-3xl text-[#23261f]">
                  Nearby Sanctuaries in {place.district}
                </h3>
              </div>

              <Link
                href={`/cities/${place.district.toLowerCase()}`}
                className="threeui-panel px-4 py-2 text-xs font-semibold text-[#23261f] hover:bg-black/5 uppercase tracking-wider transition-colors shadow-xs"
              >
                Explore All {place.district} Sites →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearby.map((nearPlace) => (
                <PlaceCard key={nearPlace.id} place={nearPlace} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20">
            <img
              src={lightboxImg}
              alt="Sanctuary Expanded Perspective"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* AI Concierge Modal */}
      <AIConciergeModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialQuery={`I want to visit ${place.title} in ${place.district}. What are the best hidden gems and stepwells nearby, and what is the ideal time budget?`}
      />
    </div>
  );
}
