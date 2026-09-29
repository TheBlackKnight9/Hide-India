'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Clock, Tag } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Rajasthan Oral Archive</span>
        </div>
        <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
          Folklore, Crafts & Oral Legends
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Deep-dive explorations into desert hydro-engineering, cursed ghost townships, Shekhawati fresco secrets, and sacred oral traditions.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-64 bg-stone-200 animate-pulse rounded-3xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Stories Directory */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Dossier Articles ({stories.length})
            </span>

            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 ${
                  activeStory?.id === story.id
                    ? 'bg-white border-stone-900 shadow-md ring-2 ring-stone-900/10'
                    : 'bg-white/70 border-stone-200/80 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
                  <span className="font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    {story.category}
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{story.readTimeMinutes} min read</span>
                  </span>
                </div>

                <h3 className="font-sans text-base font-bold text-stone-900 leading-snug mb-2">
                  {story.title}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {story.summary}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Full Story Reading Room */}
          {activeStory && (
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-md space-y-6">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={activeStory.image}
                  alt={activeStory.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs text-stone-500">
                  <span className="font-semibold text-stone-900">{activeStory.author}</span>
                  <span>•</span>
                  <span>{activeStory.district}, {activeStory.state}</span>
                </div>

                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  {activeStory.title}
                </h2>
              </div>

              <div className="border-t border-stone-100 pt-6">
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-serif whitespace-pre-line">
                  {activeStory.content}
                </p>
              </div>

              {activeStory.tags && (
                <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-stone-100">
                  <Tag className="w-3.5 h-3.5 text-stone-400 mr-1" />
                  {activeStory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-stone-100 text-[11px] font-medium text-stone-700"
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
  );
}
