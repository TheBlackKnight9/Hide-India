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
    <div className="min-h-screen bg-[#f5f6f1] text-[#23261f] pb-24 selection:bg-[#E8402A] selection:text-white">
      {/* ── THREEUI ATMOSPHERIC PAGE HEADER ── */}
      <div className="threeui-page-header">
        <div className="ghost-watermark -bottom-6 -left-6">FESTIVALS</div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.24em] text-[#E8402A] uppercase block">
                Living Cultural Traditions & Celebrations
              </span>
              <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-[#23261f] tracking-tight">
                FOLK FESTIVALS & MELAS
              </h1>
            </div>
            <p className="text-xs text-[#7c8177] max-w-md md:text-right leading-relaxed font-light">
              Experience authentic Thar desert melas, camel fairs, and deepotsav celebrations honoring generational folk music, Ghoomar dance, and spiritual traditions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 -mt-6 relative z-20">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-start gap-2 mb-10">
          {eventCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E03E3E] text-white shadow-md shadow-[#E03E3E]/30'
                  : 'bg-black/5 text-[#555c4e] border border-black/10 hover:border-black/20'
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
              <div key={i} className="h-80 bg-black/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-[24px] border border-black/8 hover:border-black/20 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10]">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#E03E3E] border border-black/10 shadow-xs">
                    {event.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between bg-white text-[#23261f]">
                  <div>
                    <h3 className="text-[#23261f] font-black text-lg mb-2 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-[#555c4e] flex items-center space-x-1 mb-3 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#E03E3E] shrink-0" />
                      <span>{event.location}, {event.state}</span>
                    </p>
                    <p className="text-xs text-[#555c4e] line-clamp-3 leading-relaxed mb-4 font-light">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/8 flex items-center justify-between text-xs text-[#7c8177]">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#7c8177]" />
                      <span>{event.month}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#7c8177]" />
                      <span>{event.duration}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/10 p-8 shadow-xl">
            <Calendar className="w-12 h-12 text-black/20 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#23261f]">No Celebrations Found</h3>
            <p className="text-xs text-[#7c8177] mt-1 max-w-sm mx-auto font-light">
              No folk festivals match your selected category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
