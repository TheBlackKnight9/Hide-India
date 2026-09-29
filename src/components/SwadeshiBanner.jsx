import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const SwadeshiBanner = () => {
  return (
    <section className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden my-12 shadow-xl border border-stone-800">
      {/* Background motif accent */}
      <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-80 h-80 rounded-full bg-terracotta-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-semibold mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Swadeshi for Atmanirbhar Bharat · Rajasthan Heritage Guild</span>
        </div>

        <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
          Empowering Local Artisans & <br className="hidden sm:inline" />
          <span className="text-stone-300 font-normal">
            Rajasthan Heritage Keepers
          </span>
        </h2>

        <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-10 max-w-3xl">
          By decentralizing tourism away from crowded ticket counters, Hide Rajasthan channels visibility directly to rural stepwell custodians, GI-tagged block printers, blue pottery kilns, and generational desert balladeers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-stone-800">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400/90 tracking-wider uppercase block">01 / DISCOVERY</span>
            <h4 className="font-sans font-bold text-base text-white tracking-tight">GI Craft Promotion</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Discover geographical indicator crafts like Sanganeri block-print, Jaipur Blue Pottery, and Molela terracotta directly at their artisan workshops.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400/90 tracking-wider uppercase block">02 / ECONOMY</span>
            <h4 className="font-sans font-bold text-base text-white tracking-tight">Direct Rural Livelihoods</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Direct support for regional guides, heritage homestays, and generational Manganiyar folk performers without exploitative commercial middle agents.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400/90 tracking-wider uppercase block">03 / ARCHIVE</span>
            <h4 className="font-sans font-bold text-base text-white tracking-tight">Preserving Vanishing Lore</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Digitizing unwritten oral folklore, hydro-engineering baori secrets, and medieval Rajput ballad lineages before they fade.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/crafts"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Explore GI Crafts & Guilds
          </Link>
          <Link
            href="/contribute"
            className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all"
          >
            Document an Unrecorded Site
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SwadeshiBanner;
