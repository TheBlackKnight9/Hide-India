'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Heart, Users, MapPin, ArrowRight, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Smart India Hackathon · SIH25130</span>
          </div>
          <h1 className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 mb-6">
            Empowering Heritage & Swadeshi Traditions
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Hide Rajasthan was created to solve over-tourism at saturated monuments by redirecting travelers toward India's lesser-known cultural wonders, unwritten oral folklore, and regional GI crafts.
          </p>
        </div>

        {/* Hackathon Dossier Card */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-16 border border-stone-800">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
            <Award className="w-4 h-4" />
            <span>National Innovation Submission</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
            Problem Statement: SIH25130
          </h2>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-6">
            <strong>Student Innovation: Swadeshi for Atmanirbhar Bharat – Heritage & Culture.</strong> Focuses on creating digital infrastructure to preserve forgotten regional heritage, document oral histories from village elders, and connect travelers directly with Geographical Indication (GI) artisan cooperatives without commercial middlemen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800 text-xs">
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px]">Team Members</span>
              <span className="font-bold text-white text-sm mt-0.5 block">Kunal Vaishnav, Anshul, Raghvendra Singh</span>
            </div>
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px]">Institution</span>
              <span className="font-bold text-white text-sm mt-0.5 block">JIET Jodhpur (Batch 2023–2027)</span>
            </div>
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px]">Coverage</span>
              <span className="font-bold text-white text-sm mt-0.5 block">10 Rajasthan Regions · 33 Sanctuaries</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="space-y-6 mb-16">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 text-center mb-8">
            The Four Core Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-lg">
                1
              </div>
              <h3 className="font-sans text-lg font-bold text-stone-900">
                Lesser-Known Sanctuaries First
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Rather than repeating well-trodden commercial circuits, we prioritize subterranean baoris, abandoned haveli clusters, and secluded forest shrines that receive little to no tourist traffic.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">
                2
              </div>
              <h3 className="font-sans text-lg font-bold text-stone-900">
                Living Oral Folklore & Living Legends
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Academic history only tells part of the story. We record unwritten legends passed down by local bards, Bhopa singers, and village elders to keep folklore alive for future generations.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-lg">
                3
              </div>
              <h3 className="font-sans text-lg font-bold text-stone-900">
                Swadeshi & GI Artisan Empowerment
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every heritage site is paired with the Geographical Indication (GI) craft of its region—such as Jodhpur sandstone masonry, Kota Doria weavers, and Bagru block printers—allowing travelers to purchase directly.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold text-lg">
                4
              </div>
              <h3 className="font-sans text-lg font-bold text-stone-900">
                Zero-Middleman Community Contributions
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Our platform provides an open community contribution portal where locals, researchers, and conscious travelers can submit newly identified heritage sites and oral legends for peer review.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-stone-200 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/explore"
            className="px-6 py-3.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs inline-flex items-center space-x-1.5"
          >
            <span>Explore Visual Atlas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/contribute"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-900 text-xs font-semibold shadow-xs"
          >
            Contribute a Sanctuary
          </Link>
        </div>
      </div>
    </div>
  );
}
