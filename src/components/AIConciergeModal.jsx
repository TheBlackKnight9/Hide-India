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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121318] text-white rounded-3xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col selection:bg-[#E03E3E] selection:text-white">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#121318]/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E03E3E] flex items-center justify-center text-white shadow-md shadow-[#E03E3E]/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="headline-werlton text-base text-white leading-tight">
                Rajasthan Time-Budget Concierge
              </h3>
              <p className="text-[11px] text-white/50 font-medium">
                {engineStatus?.mode === 'gemini_api'
                  ? '⚡ Powered by Google Gemini AI'
                  : '✦ Built-in Rajasthan Cultural Knowledge Engine'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
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
              className="w-full pl-4 pr-24 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E03E3E]"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer transition-all shadow-md shadow-[#E03E3E]/30"
            >
              <span>{loading ? 'Curating...' : 'Ask'}</span>
              <Send className="w-3 h-3" />
            </button>
          </form>

          {/* Quick Prompts */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block mb-2">
              Popular Circuits:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePlan(p)}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors text-left border border-white/10 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#E03E3E] animate-spin mx-auto" />
              <p className="font-sans text-sm font-semibold text-white">
                Calculating travel time & secret sanctuaries...
              </p>
              <p className="text-xs text-white/50">
                Cross-referencing Rajasthan heritage archives with zero-crowd timings.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 text-[#E03E3E] text-xs font-medium border border-red-500/20">
              {errorMsg}
            </div>
          )}

          {/* Result View */}
          {result && !loading && (
            <div className="space-y-6 pt-2 border-t border-white/10 animate-fadeIn">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E03E3E] bg-[#E03E3E]/10 px-2 py-0.5 rounded-full border border-[#E03E3E]/20">
                  Curated Route · {result.duration || 'Flexible'}
                </span>
                <h4 className="headline-werlton text-lg text-white mt-2">
                  {result.itineraryTitle}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  {result.itinerarySummary}
                </p>
              </div>

              {/* Time Slots */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white/40 block">
                  Time-Sequenced Itinerary:
                </span>

                <div className="space-y-3">
                  {result.timeline?.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80">
                            {slot.category}
                          </span>
                          <span className="text-xs text-white/40">
                            {slot.district}, Rajasthan
                          </span>
                        </div>

                        <h4 className="headline-werlton text-base text-white tracking-tight">
                          {slot.title}
                        </h4>

                        <p className="text-xs text-white/70 leading-relaxed font-light">
                          {slot.highlight}
                        </p>

                        {slot.giCraft && (
                          <p className="text-[11px] text-[#E03E3E] font-medium">
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
                            className="inline-flex items-center space-x-1 px-4 py-2 rounded-full border border-white/20 text-white hover:bg-[#E03E3E] hover:border-[#E03E3E] text-xs font-semibold uppercase tracking-wider transition-colors"
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
