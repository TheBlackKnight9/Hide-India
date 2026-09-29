'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Tag } from 'lucide-react';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    const fetchStoriesList = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/stories').then((r) => r.json());
        if (res.success && res.data) {
          setStories(res.data);
          if (res.data.length > 0) setActiveStory(res.data[0]);
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStoriesList();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pt-28 sm:pt-32 pb-24 selection:bg-[#E03E3E] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
            Rajasthan Oral Legends & Folklore
          </span>
          <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-white mb-4">
            FOLKLORE & ORAL ARCHIVES
          </h1>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-light">
            Deep-dive explorations into desert hydro-engineering, cursed ghost townships, Shekhawati fresco secrets, and sacred oral traditions.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-64 bg-white/5 animate-pulse rounded-3xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Stories Directory */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">
                Dossier Articles ({stories.length})
              </span>

              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className={`p-5 rounded-[24px] border cursor-pointer transition-all duration-300 ${
                    activeStory?.id === story.id
                      ? 'bg-[#16171E] border-[#E03E3E] shadow-2xl ring-1 ring-[#E03E3E]'
                      : 'bg-[#121318] border-white/8 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-white/50 mb-2">
                    <span className="font-bold text-[#E03E3E] bg-[#E03E3E]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                      {story.category}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-white/40" />
                      <span>{story.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h3 className="text-white font-black text-base leading-snug mb-2">
                    {story.title}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed font-light">
                    {story.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column: Full Story Reading Room */}
            {activeStory && (
              <div className="lg:col-span-7 bg-[#121318] p-6 sm:p-10 rounded-[28px] border border-white/10 shadow-2xl space-y-6">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-black/40">
                  <img
                    src={activeStory.image}
                    alt={activeStory.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-white/50">
                    <span className="font-semibold text-white">{activeStory.author}</span>
                    <span>•</span>
                    <span>{activeStory.district}, {activeStory.state}</span>
                  </div>

                  <h2 className="headline-werlton text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                    {activeStory.title}
                  </h2>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light whitespace-pre-line">
                    {activeStory.content}
                  </p>
                </div>

                {activeStory.tags && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-white/10">
                    <Tag className="w-3.5 h-3.5 text-white/40 mr-1" />
                    {activeStory.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-medium text-white/70 border border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
