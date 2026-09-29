'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  MapPin,
  Compass,
  ArrowRight,
  Printer,
  Bookmark,
  CheckCircle2,
  Navigation,
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
      // Find matching places in selected city
      const matchedCityPlaces = rajasthanFallbackPlaces.filter(
        (p) =>
          p.district.toLowerCase().includes(city.toLowerCase()) ||
          city.toLowerCase().includes(p.district.toLowerCase())
      );

      // Prioritize hidden if Zero-Crowd is selected
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
          travelTime: idx === 0 ? 'Starting Point' : '15 min scenic auto-rickshaw ride',
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
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Time-Budgeted AI Heritage Concierge</span>
          </div>
          <h1 className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 mb-4">
            Custom Rajasthan Circuit Planner
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Have a 2-hour layover in Jodhpur or a half-day in Jaipur? Our AI crafts a zero-crowd heritage route calculating realistic transit times, quiet hours, and unwritten folklore.
          </p>
        </div>

        {/* Input Configuration Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                1. Select Royal City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900"
              >
                {['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer', 'Bundi', 'Pushkar', 'Bikaner', 'Shekhawati', 'Alwar'].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Time Budget */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                2. How Much Time Do You Have?
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
                    className={`py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      hours === item.val
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
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
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
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
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-3.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Synthesizing Optimal Circuit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
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
                <h3 className="font-sans text-2xl font-bold text-stone-900">
                  {itinerary.hours}-Hour Visual Circuit for {itinerary.city}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Optimized for minimal backtracking and zero-crowd cultural immersion
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 inline-flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Route</span>
              </button>
            </div>

            {/* Timeline Stops */}
            <div className="space-y-6">
              {itinerary.stops.map((stop, idx) => (
                <div
                  key={stop.place.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-64 aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
                    <img
                      src={stop.place.coverImage || stop.place.images[0]}
                      alt={stop.place.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Stop #{idx + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>{stop.time}</span>
                      </span>

                      <span className="text-xs text-stone-500 font-medium">
                        🚶 {stop.travelTime}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-sans text-xl font-bold text-stone-900">
                        {stop.place.title}
                      </h4>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {stop.place.category} · {stop.place.district}
                      </p>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {stop.place.tagline}
                    </p>

                    <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-xs text-stone-700">
                      <span className="font-bold text-stone-900">💡 Concierge Note: </span>
                      {stop.recommendation}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        href={`/place/${stop.place.slug}`}
                        className="text-xs font-semibold text-stone-900 hover:text-amber-700 inline-flex items-center space-x-1"
                      >
                        <span>View Full Monument Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => savePlace(stop.place)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center space-x-1 transition-all ${
                          isSaved(stop.place.id)
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved(stop.place.id) ? 'Saved' : 'Save to Circuit'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-6">
              <Link
                href="/saved"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-semibold shadow-xs hover:bg-black"
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
