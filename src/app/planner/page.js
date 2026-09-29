'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Printer,
  Bookmark,
  RefreshCw,
} from 'lucide-react';
import { rajasthanFallbackPlaces } from '../../data/rajasthanFallbackPlaces';
import { useSaved } from '../../context/SavedContext';

export default function PlannerPage() {
  const { savePlace, isSaved } = useSaved();
  const [city, setCity] = useState('Jaipur');
  const [hours, setHours] = useState('2');
  const [interests, setInterests] = useState(['Stepwells', 'Zero-Crowd']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const interestOptions = [
    'Stepwells',
    'Zero-Crowd',
    'Royal Palaces',
    'GI Crafts & Shopping',
    'Photography & Sunsets',
    'Sacred Temples',
  ];

  const toggleInterest = (item) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const matchedCityPlaces = rajasthanFallbackPlaces.filter(
        (p) =>
          p.district.toLowerCase().includes(city.toLowerCase()) ||
          city.toLowerCase().includes(p.district.toLowerCase())
      );

      let selected = [...matchedCityPlaces];
      if (interests.includes('Zero-Crowd')) {
        selected.sort((a, b) => (a.isMajor === b.isMajor ? 0 : a.isMajor ? 1 : -1));
      }

      const count = hours === '1' ? 1 : hours === '2' ? 2 : hours === '4' ? 3 : 4;
      const stops = selected.slice(0, count);

      setItinerary({
        city,
        hours,
        totalSites: stops.length,
        stops: stops.map((place, idx) => ({
          time: idx === 0 ? '09:00 AM – 10:15 AM' : idx === 1 ? '10:30 AM – 11:45 AM' : idx === 2 ? '12:15 PM – 01:45 PM' : '02:30 PM – 04:30 PM',
          travelTime: idx === 0 ? 'Starting Point' : '15 min scenic transfer',
          place,
          recommendation: idx === 0
            ? 'Arrive early before shadows lengthen; walk the outer stone steps quietly.'
            : 'Explore the shaded corridors and chat with local stone artisans near the courtyard.',
        })),
      });

      setIsGenerating(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pt-28 sm:pt-32 pb-24 selection:bg-[#E03E3E] selection:text-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
            Time-Budgeted Concierge Engine
          </span>
          <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-white mb-4">
            AI ROUTE PLANNER
          </h1>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-light">
            Have a 2-hour layover in Jodhpur or a half-day in Jaipur? Our AI crafts a zero-crowd heritage route calculating transit times, quiet hours, and unwritten folklore.
          </p>
        </div>

        {/* Input Configuration Card */}
        <div className="bg-[#121318] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* City Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                1. Select Territory
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-[#E03E3E]"
              >
                {['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer', 'Bundi', 'Pushkar', 'Bikaner', 'Shekhawati', 'Alwar'].map(
                  (c) => (
                    <option key={c} value={c} className="bg-[#121318]">
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Time Budget */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                2. Available Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '1 Hour', val: '1' },
                  { label: '2 Hours', val: '2' },
                  { label: '4 Hours', val: '4' },
                  { label: 'Full Day', val: '8' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setHours(item.val)}
                    className={`py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      hours === item.val
                        ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/30'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
              3. Heritage Interests & Travel Style
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((opt) => {
                const active = interests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-[#E03E3E] text-white font-bold shadow-md shadow-[#E03E3E]/20'
                        : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-4 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E03E3E]/30 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Optimal Circuit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate {city} Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Output */}
        {itinerary && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="headline-werlton text-2xl sm:text-3xl text-white">
                  {itinerary.hours}-Hour Circuit · {itinerary.city}
                </h3>
                <p className="text-xs text-white/50 mt-0.5 font-light">
                  Optimized for minimal backtracking and zero-crowd cultural immersion
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 inline-flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-white/70" />
                <span>Print Route</span>
              </button>
            </div>

            {/* Timeline Stops */}
            <div className="space-y-6">
              {itinerary.stops.map((stop, idx) => (
                <div
                  key={stop.place.id}
                  className="bg-[#121318] rounded-3xl border border-white/8 p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-start"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-64 aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
                    <img
                      src={stop.place.coverImage || stop.place.images[0]}
                      alt={stop.place.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#0A0B0E]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                      Stop #{idx + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E03E3E]/20 text-[#E03E3E] border border-[#E03E3E]/30">
                        <Clock className="w-3 h-3 text-[#E03E3E]" />
                        <span>{stop.time}</span>
                      </span>

                      <span className="text-xs text-white/50 font-medium">
                        🚶 {stop.travelTime}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-white font-black text-xl leading-tight">
                        {stop.place.title}
                      </h4>
                      <p className="text-xs text-white/50 font-medium mt-0.5">
                        {stop.place.district}, Rajasthan
                      </p>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed font-light">
                      {stop.place.tagline}
                    </p>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-xs text-white/70 font-light">
                      <span className="font-bold text-white">💡 Concierge Field Note: </span>
                      {stop.recommendation}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        href={`/place/${stop.place.slug}`}
                        className="text-xs font-bold uppercase tracking-wider text-[#E03E3E] hover:text-white inline-flex items-center space-x-1"
                      >
                        <span>View Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => savePlace(stop.place)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-full inline-flex items-center space-x-1 transition-all ${
                          isSaved(stop.place.id)
                            ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/30'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved(stop.place.id) ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-6">
              <Link
                href="/saved"
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E03E3E]/30"
              >
                <span>View My Full Saved Travelogue Circuit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
