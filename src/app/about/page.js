'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f1] text-[#23261f] pb-24 selection:bg-[#E03E3E] selection:text-white">
      {/* ── THREEUI ATMOSPHERIC PAGE HEADER ── */}
      <div className="threeui-page-header">
        <div className="ghost-watermark -bottom-6 -left-6">MANIFESTO</div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.24em] text-[#E03E3E] uppercase block">
                Smart India Hackathon · SIH25130
              </span>
              <h1 className="headline-werlton text-3xl sm:text-5xl lg:text-6xl text-[#23261f] tracking-tight">
                HERITAGE MANIFESTO
              </h1>
            </div>
            <p className="text-xs text-[#7c8177] max-w-md md:text-right leading-relaxed font-light">
              Hide India was created to solve over-tourism at saturated monuments by redirecting travelers toward India's lesser-known cultural wonders, unwritten oral folklore, and regional GI crafts.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-12 -mt-6 relative z-20">
        {/* Hackathon Dossier Card */}
        <div className="threeui-card p-8 sm:p-12 mb-16 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#E03E3E] mb-3">
            <Award className="w-4 h-4" />
            <span>National Innovation Submission</span>
          </div>
          <h2 className="headline-werlton text-2xl sm:text-3xl text-[#23261f] mb-4">
            Problem Statement: SIH25130
          </h2>
          <p className="text-xs sm:text-sm text-[#555c4e] leading-relaxed mb-6 font-light">
            <strong className="text-[#23261f] font-bold">Student Innovation: Swadeshi for Atmanirbhar Bharat - Heritage & Culture.</strong> Focuses on creating digital infrastructure to preserve forgotten regional heritage, document oral histories from village elders, and connect travelers directly with Geographical Indication (GI) artisan cooperatives without commercial middlemen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-black/10 text-xs">
            <div>
              <span className="text-[#7c8177] block uppercase tracking-wider text-[10px]">Team Members</span>
              <span className="font-bold text-[#23261f] text-sm mt-0.5 block">Kunal Vaishnav, Anshul, Raghvendra Singh</span>
            </div>
            <div>
              <span className="text-[#7c8177] block uppercase tracking-wider text-[10px]">Institution</span>
              <span className="font-bold text-[#23261f] text-sm mt-0.5 block">JIET Jodhpur (Batch 2023-2027)</span>
            </div>
            <div>
              <span className="text-[#7c8177] block uppercase tracking-wider text-[10px]">Coverage</span>
              <span className="font-bold text-[#23261f] text-sm mt-0.5 block">13 Rajasthan Regions · 82 Sanctuaries</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="space-y-6 mb-16">
          <h2 className="headline-werlton text-2xl sm:text-3xl text-[#23261f] text-center mb-8">
            The Four Core Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="threeui-card p-8 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-[#E03E3E]/10 text-[#E03E3E] flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-[#23261f]">
                Lesser-Known Sanctuaries First
              </h3>
              <p className="text-xs sm:text-sm text-[#555c4e] leading-relaxed font-light">
                Rather than repeating well-trodden commercial circuits, we prioritize subterranean baoris, abandoned haveli clusters, and secluded forest shrines that receive little to no tourist traffic.
              </p>
            </div>

            <div className="threeui-card p-8 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-[#E03E3E]/10 text-[#E03E3E] flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-[#23261f]">
                Living Oral Folklore & Living Legends
              </h3>
              <p className="text-xs sm:text-sm text-[#555c4e] leading-relaxed font-light">
                Academic history only tells part of the story. We record unwritten legends passed down by local bards, Bhopa singers, and village elders to keep folklore alive for future generations.
              </p>
            </div>

            <div className="threeui-card p-8 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-[#E03E3E]/10 text-[#E03E3E] flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-[#23261f]">
                Swadeshi & GI Artisan Empowerment
              </h3>
              <p className="text-xs sm:text-sm text-[#555c4e] leading-relaxed font-light">
                Every heritage site is paired with the Geographical Indication (GI) craft of its region-such as Jodhpur sandstone masonry, Kota Doria weavers, and Bagru block printers-allowing travelers to purchase directly.
              </p>
            </div>

            <div className="threeui-card p-8 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-[#E03E3E]/10 text-[#E03E3E] flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h3 className="text-lg font-bold text-[#23261f]">
                Zero-Middleman Community Contributions
              </h3>
              <p className="text-xs sm:text-sm text-[#555c4e] leading-relaxed font-light">
                Our platform provides an open community contribution portal where locals, researchers, and conscious travelers can submit newly identified heritage sites and oral legends for peer review.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-black/10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/explore"
            className="px-8 py-3.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#E03E3E]/20 inline-flex items-center space-x-1.5"
          >
            <span>Explore Visual Atlas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/contribute"
            className="px-8 py-3.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-[#23261f] text-xs font-bold uppercase tracking-wider"
          >
            Contribute a Sanctuary
          </Link>
        </div>
      </div>
    </div>
  );
}
