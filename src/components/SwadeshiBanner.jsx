import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const SwadeshiBanner = () => {
  return (
    <section className="bg-white text-[#23261f] rounded-3xl p-8 sm:p-14 relative overflow-hidden my-12 shadow-xl border border-black/10 max-w-7xl mx-auto">
      {/* Background motif accent */}
      <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-[#E03E3E]/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#f5f6f1] border border-black/10 text-[#E03E3E] text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E03E3E]" />
          <span>Swadeshi for Atmanirbhar Bharat · Rajasthan Heritage Guild</span>
        </div>

        <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#23261f] leading-tight mb-4 uppercase">
          Empowering Local Artisans & <br className="hidden sm:inline" />
          <span className="text-[#7c8177] font-light">
            Living Heritage Keepers
          </span>
        </h2>

        <p className="text-[#555c4e] text-base sm:text-lg leading-relaxed mb-10 max-w-3xl font-light">
          By decentralizing tourism away from crowded ticket counters, Hide India channels visibility directly to rural stepwell custodians, GI-tagged block printers, blue pottery kilns, and generational desert balladeers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-black/10">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#E03E3E] tracking-wider uppercase block">01 / DISCOVERY</span>
            <h4 className="font-sans font-bold text-base text-[#23261f] tracking-tight">GI Craft Promotion</h4>
            <p className="text-xs text-[#7c8177] leading-relaxed font-light">
              Discover geographical indicator crafts like Sanganeri block-print, Jaipur Blue Pottery, and Molela terracotta directly at their artisan workshops.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#E03E3E] tracking-wider uppercase block">02 / ECONOMY</span>
            <h4 className="font-sans font-bold text-base text-[#23261f] tracking-tight">Direct Rural Livelihoods</h4>
            <p className="text-xs text-[#7c8177] leading-relaxed font-light">
              Direct support for regional guides, heritage homestays, and generational Manganiyar folk performers without exploitative commercial middle agents.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#E03E3E] tracking-wider uppercase block">03 / ARCHIVE</span>
            <h4 className="font-sans font-bold text-base text-[#23261f] tracking-tight">Preserving Vanishing Lore</h4>
            <p className="text-xs text-[#7c8177] leading-relaxed font-light">
              Digitizing unwritten oral folklore, hydro-engineering baori secrets, and medieval Rajput ballad lineages before they fade.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/crafts"
            className="px-6 py-3.5 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#E03E3E]/20"
          >
            Explore GI Crafts & Guilds
          </Link>
          <Link
            href="/contribute"
            className="px-6 py-3.5 rounded-full bg-[#f5f6f1] hover:bg-[#ebeee7] text-[#23261f] font-bold text-xs uppercase tracking-wider transition-all border border-black/10"
          >
            + Contribute a Heritage Place
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SwadeshiBanner;
