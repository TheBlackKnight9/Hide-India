'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Compass,
  Clock,
  MapPin,
  ArrowRight,
  Bookmark,
  Send,
  Navigation,
  Lightbulb,
} from 'lucide-react';
import { useSaved } from '../context/SavedContext';

const samplePrompts = [
  'I am in Jaipur for 2 hours, what things can I do?',
  'I have 3 hours in Jodhpur looking for stepwells & crafts',
  'Half-day ancient architecture & stepwell trail in Bundi',
  'One day in Jaisalmer exploring Kuldhara & desert cenotaphs',
  'Morning in Udaipur: City Palace & Lake Pichola trail',
];

const AIConciergeModal = ({ isOpen, onClose, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedAll, setSavedAll] = useState(false);
  const [engineStatus, setEngineStatus] = useState(null);
  const { toggleSave } = useSaved();

  useEffect(() => {
    if (isOpen) {
      fetch('/api/ai/status')
        .then((r) => r.json())
        .then((res) => setEngineStatus(res))
        .catch(() => {});
    }
  }, [isOpen]);

  const handlePlan = async (promptText) => {
    const textToSearch = promptText || query;
    if (!textToSearch.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      setSavedAll(false);
      setQuery(textToSearch);

      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSearch.trim() }),
      }).then((r) => r.json());

      if (res.success) {
        setResult({ ...res.data, engine: res.engine });
      } else {
        setErrorMsg('Could not generate plan. Please try another query.');
      }
    } catch (err) {
      console.error('AI plan error:', err);
      setErrorMsg('Error consulting the Heritage AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-stone-900 leading-tight">
                Rajasthan Time-Budget Concierge
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                {engineStatus?.mode === 'gemini_api'
                  ? '⚡ Powered by Google Gemini AI'
                  : '✦ Built-in Rajasthan Cultural Knowledge Engine'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 flex-grow">
          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePlan();
            }}
            className="relative"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I am in Jaipur for 2 hours, what can I do?"
              className="w-full pl-4 pr-24 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer transition-all"
            >
              <span>{loading ? 'Curating...' : 'Ask'}</span>
              <Send className="w-3 h-3" />
            </button>
          </form>

          {/* Quick Prompts */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Popular Circuits:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePlan(p)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="font-sans text-sm font-semibold text-stone-700">
                Calculating travel time & secret sanctuaries...
              </p>
              <p className="text-xs text-stone-400">
                Cross-referencing Rajasthan heritage archives with zero-crowd timings.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Result View */}
          {result && !loading && (
            <div className="space-y-6 pt-2 border-t border-stone-100 animate-fadeIn">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                  Curated Route · {result.duration || 'Flexible'}
                </span>
                <h4 className="font-sans text-lg font-bold text-stone-900 mt-2">
                  {result.itineraryTitle}
                </h4>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  {result.itinerarySummary}
                </p>
              </div>

              {/* Time Slots */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                  Time-Sequenced Itinerary:
                </span>

                <div className="space-y-3">
                  {result.timeline?.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                            {slot.category}
                          </span>
                          <span className="text-xs text-stone-400">
                            {slot.district}, Rajasthan
                          </span>
                        </div>

                        <h4 className="font-sans font-bold text-base text-stone-900 tracking-tight">
                          {slot.title}
                        </h4>

                        <p className="text-xs text-stone-600 leading-relaxed">
                          {slot.highlight}
                        </p>

                        {slot.giCraft && (
                          <p className="text-[11px] text-amber-900 font-medium">
                            ✦ GI Craft Patronage: {slot.giCraft}
                          </p>
                        )}
                      </div>

                      {/* Right Link */}
                      {slot.slug && (
                        <div className="shrink-0 flex items-center justify-end sm:justify-center">
                          <Link
                            href={`/place/${slot.slug}`}
                            onClick={onClose}
                            className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full border border-stone-300 text-stone-900 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider transition-colors"
                          >
                            <span>View Dossier</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIConciergeModal;
