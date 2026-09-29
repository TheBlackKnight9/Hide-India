'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0A0B0E] text-white pt-28 sm:pt-32 pb-24 selection:bg-[#E03E3E] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
            Living Cultural Traditions
          </span>
          <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-white mb-4">
            FOLK FESTIVALS & MELAS
          </h1>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-light">
            Experience authentic Thar desert melas, camel fairs, and deepotsav celebrations honoring generational folk music, Ghoomar dance, and spiritual traditions.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {eventCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/30'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/20'
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
              <div key={i} className="h-80 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-[#121318] rounded-[24px] border border-white/8 hover:border-white/20 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10]">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-3 right-3 bg-[#0A0B0E]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#E03E3E] border border-white/10 shadow-lg">
                    {event.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-white font-black text-lg mb-2 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-white/60 flex items-center space-x-1 mb-3 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#E03E3E] shrink-0" />
                      <span>{event.location}, {event.state}</span>
                    </p>
                    <p className="text-xs text-white/60 line-clamp-3 leading-relaxed mb-4 font-light">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/60">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                      <span>{event.month}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-white/40" />
                      <span>{event.duration}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121318] rounded-3xl border border-white/10 p-8 shadow-2xl">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white">No Celebrations Found</h3>
            <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto font-light">
              No folk festivals match your selected category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
