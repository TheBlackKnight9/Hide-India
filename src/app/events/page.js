'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Sparkles, Filter, Clock } from 'lucide-react';

const eventCategories = ['All', 'Sacred Mela', 'Folk Festival', 'Cultural Festival'];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEventList = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/events').then((r) => r.json());
        if (res.success && res.data) {
          let list = res.data;
          if (selectedCategory !== 'All') {
            list = list.filter((e) => e.category === selectedCategory);
          }
          if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter((e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
          }
          setEvents(list);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventList();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Rajasthan Living Calendar</span>
        </div>
        <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
          Folk Festivals & Desert Melas
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Experience authentic Thar desert melas, camel fairs, and deepotsav celebrations honoring generational folk music, Ghoomar dance, and spiritual traditions.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {eventCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-stone-200/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-stone-100">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-900 shadow-xs">
                  {event.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-sans text-lg font-bold text-stone-900 mb-2 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center space-x-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{event.location}, {event.state}</span>
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                    {event.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>{event.organizer || 'Rajasthan Heritage Guild'}</span>
                  <span className="font-semibold text-stone-900">Annual Mela</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
          <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-700">No festivals found in this category.</p>
        </div>
      )}
    </div>
  );
}
