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
    <div className="min-h-screen bg-[#f5f6f1] text-[#23261f] pb-24 selection:bg-[#E8402A] selection:text-white">
      {/* ── THREEUI ATMOSPHERIC PAGE HEADER ── */}
      <div className="threeui-page-header">
        <div className="ghost-watermark -bottom-6 -left-6">LEGENDS</div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.24em] text-[#E8402A] uppercase block">
                Oral Ballad Archives & Folklore
              </span>
              <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-[#23261f] tracking-tight">
                FOLKLORE & ORAL ARCHIVES
              </h1>
            </div>
            <p className="text-xs text-[#7c8177] max-w-md md:text-right leading-relaxed font-light">
              Deep-dive explorations into desert hydro-engineering, cursed ghost townships, Shekhawati fresco secrets, and sacred oral traditions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 -mt-6 relative z-20">
        {loading ? (
          <div className="space-y-4">
            <div className="h-64 bg-black/5 animate-pulse rounded-3xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Stories Directory */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7c8177] block mb-2">
                Dossier Articles ({stories.length})
              </span>

              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className={`p-5 rounded-[24px] cursor-pointer transition-all duration-300 ${
                    activeStory?.id === story.id
                      ? 'threeui-card border-[#E8402A]/80 shadow-2xl ring-1 ring-[#E8402A]'
                      : 'threeui-card hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-[#7c8177] mb-2">
                    <span className="font-bold text-[#E03E3E] bg-[#E03E3E]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                      {story.category}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#7c8177]" />
                      <span>{story.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h3 className="text-[#23261f] font-black text-base leading-snug mb-2">
                    {story.title}
                  </h3>

                  <p className="text-xs text-[#555c4e] line-clamp-2 leading-relaxed font-light">
                    {story.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column: Full Story Reading Room */}
            {activeStory && (
              <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-[28px] border border-black/10 shadow-xl space-y-6 text-[#23261f]">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-black/10">
                  <img
                    src={activeStory.image}
                    alt={activeStory.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-[#7c8177]">
                    <span className="font-semibold text-[#23261f]">{activeStory.author}</span>
                    <span>•</span>
                    <span>{activeStory.district}, {activeStory.state}</span>
                  </div>

                  <h2 className="headline-werlton text-2xl sm:text-3xl text-[#23261f] tracking-tight leading-tight">
                    {activeStory.title}
                  </h2>
                </div>

                <div className="border-t border-black/10 pt-6">
                  <p className="text-sm sm:text-base text-[#555c4e] leading-relaxed font-light whitespace-pre-line">
                    {activeStory.content}
                  </p>
                </div>

                {activeStory.tags && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-black/10">
                    <Tag className="w-3.5 h-3.5 text-[#7c8177] mr-1" />
                    {activeStory.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-black/5 text-[11px] font-medium text-[#555c4e] border border-black/10"
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
