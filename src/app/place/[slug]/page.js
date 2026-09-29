'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useSaved } from '../../../context/SavedContext';
import PlaceCard from '../../../components/PlaceCard';
import { rajasthanFallbackPlaces } from '../../../data/rajasthanFallbackPlaces';

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const { isSaved, toggleSave } = useSaved();

  const [place, setPlace] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history'); // history, folklore, reach, reviews
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

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

      // Fallback matching
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
      <div className="max-w-5xl mx-auto px-4 py-32 text-center">
        <div className="w-10 h-10 border-3 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-sans text-stone-600 text-base">Unveiling Rajasthan heritage dossier...</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h2 className="font-sans text-2xl font-bold text-stone-800">Destination Not Found</h2>
        <p className="text-stone-500 mt-2 text-sm">The requested heritage dossier could not be located.</p>
        <Link href="/explore" className="mt-4 inline-block px-5 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold">
          Return to Rajasthan Atlas
        </Link>
      </div>
    );
  }

  const saved = isSaved(place.id);

  return (
    <div className="min-h-screen pb-20 pt-24 sm:pt-28">
      {/* Top Breadcrumb Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center space-x-2 truncate">
            <Link href="/explore" className="hover:text-stone-900 flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore</span>
            </Link>
            <span>/</span>
            <span>{place.district}, Rajasthan</span>
            <span>/</span>
            <span className="font-semibold text-stone-900 truncate">{place.title}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-stone-200 hover:bg-stone-100 transition-colors text-stone-700"
              title="Copy link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            {copied && <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Cover Photograph */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-stone-200 border border-stone-200/80 shadow-md">
          <img
            src={place.coverImage || (place.images && place.images[0])}
            alt={place.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top Pill Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-stone-900 shadow-xs">
                {place.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs ${
                place.isMajor ? 'bg-amber-600' : 'bg-emerald-600'
              }`}>
                {place.isMajor ? '🏛️ Major Citadel' : '✦ Hidden Gem'}
              </span>
            </div>

            <button
              onClick={() => toggleSave(place)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                saved ? 'bg-stone-900 text-white shadow-md' : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom Title & District */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center space-x-2 text-xs font-medium text-amber-300">
              <MapPin className="w-4 h-4" />
              <span>{place.district}, Rajasthan</span>
              {place.century && (
                <>
                  <span>•</span>
                  <span>{place.century}</span>
                </>
              )}
            </div>
            <h1 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {place.title}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {place.tagline}
            </p>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              Dynasty & Era
            </span>
            <p className="text-xs font-semibold text-stone-900 leading-snug">
              {place.dynasty || 'Medieval Rajput'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              Visiting Hours
            </span>
            <p className="text-xs font-semibold text-stone-900 leading-snug">
              {place.timings || 'Sunrise to Sunset'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              Entry Token
            </span>
            <p className="text-xs font-semibold text-stone-900 leading-snug">
              {place.entryFee || 'Free entry'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              GI Tag Craft
            </span>
            <p className="text-xs font-semibold text-amber-900 leading-snug">
              {place.giTagCraft || 'Local Handloom'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 space-x-6 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-b-2 border-stone-900 text-stone-900'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            History & Architecture
          </button>
          <button
            onClick={() => setActiveTab('folklore')}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === 'folklore'
                ? 'border-b-2 border-stone-900 text-stone-900'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Oral Folklore & Legends
          </button>
          <button
            onClick={() => setActiveTab('reach')}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === 'reach'
                ? 'border-b-2 border-stone-900 text-stone-900'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            How to Reach & Coordinates
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-b-2 border-stone-900 text-stone-900'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Reviews & Travel Tips ({place.reviews?.length || 0})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="font-sans text-xl font-bold text-stone-900">
                Architectural Genesis & Significance
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line font-serif sm:text-base">
                {place.history}
              </p>
              {place.architecturalStyle && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                  <strong>Architectural Style:</strong> {place.architecturalStyle}
                </div>
              )}
            </div>
          )}

          {activeTab === 'folklore' && (
            <div className="space-y-4">
              <h3 className="font-sans text-xl font-bold text-stone-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Oral Legends & Community Folklore</span>
              </h3>
              <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-sm sm:text-base text-amber-950 font-serif italic leading-relaxed">
                "{place.folklore || 'Local community elders recall generational songs celebrating the subterranean reservoirs of this sanctuary during arid desert seasons.'}"
              </div>
            </div>
          )}

          {activeTab === 'reach' && (
            <div className="space-y-4">
              <h3 className="font-sans text-xl font-bold text-stone-900">
                Directions & Coordinates
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {place.howToReach || `Located in ${place.district}, Rajasthan. Easily accessible from the main town center by local cab or auto-rickshaw.`}
              </p>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-semibold text-stone-900">GPS Coordinates:</span>{' '}
                  <span className="text-stone-600">{place.latitude}, {place.longitude}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-stone-900 text-white rounded-full font-semibold hover:bg-black transition-colors"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
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
                    className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
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
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
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
                    <div key={rev.id} className="p-4 rounded-2xl border border-stone-100 bg-white space-y-1">
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

        {/* Nearby Sanctuaries in District */}
        {nearby && nearby.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="font-sans text-xl font-bold text-stone-900">
              Nearby Sanctuaries in {place.district}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {nearby.map((nearPlace) => (
                <PlaceCard key={nearPlace.id} place={nearPlace} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
