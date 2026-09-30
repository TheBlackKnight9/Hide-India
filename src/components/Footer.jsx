import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#edf0e8] text-[#555c4e] pt-16 pb-12 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-black/10">
          {/* Brand & Editorial Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-md bg-[#E03E3E] flex items-center justify-center text-white shadow-sm shadow-[#E03E3E]/30">
                <span className="text-[10px] font-black tracking-tighter">HI</span>
              </div>
              <div>
                <span className="font-sans text-lg font-black tracking-widest text-[#23261f] block uppercase">
                  Hide India
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#E03E3E] font-semibold block">
                  Heritage Cultural Archive
                </span>
              </div>
            </div>
            <p className="text-xs text-[#7c8177] leading-relaxed font-light">
              Preserving subterranean stepwells, Rajput citadels, Shekhawati havelis, and desert oral folklore beyond commercial tourist circuits.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-black/10 text-[10px] text-[#23261f] tracking-wider uppercase font-semibold shadow-xs">
              <span>SIH25130 · Swadeshi Heritage</span>
            </div>
          </div>

          {/* Dedicated Explore Pages */}
          <div>
            <h4 className="font-sans text-xs font-bold text-[#23261f] uppercase tracking-widest mb-4">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#555c4e] font-light">
              <li>
                <Link href="/cities" className="hover:text-[#E03E3E] transition-colors">
                  🏛️ The 10 Royal Cities
                </Link>
              </li>
              <li>
                <Link href="/hidden-gems" className="hover:text-[#E03E3E] transition-colors">
                  ✦ Zero-Crowd Hidden Gems
                </Link>
              </li>
              <li>
                <Link href="/landmarks" className="hover:text-[#E03E3E] transition-colors">
                  🏰 Crown Citadels & Landmarks
                </Link>
              </li>
              <li>
                <Link href="/crafts" className="hover:text-[#E03E3E] transition-colors">
                  🧵 GI Crafts & Living Artisans
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-[#E03E3E] transition-colors">
                  ✨ AI Heritage Circuit Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Major Territories */}
          <div>
            <h4 className="font-sans text-xs font-bold text-[#23261f] uppercase tracking-widest mb-4">
              Territorial Dossiers
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#555c4e] font-light">
              <Link href="/cities/jaipur" className="hover:text-[#E03E3E] transition-colors">Jaipur</Link>
              <Link href="/cities/jodhpur" className="hover:text-[#E03E3E] transition-colors">Jodhpur</Link>
              <Link href="/cities/udaipur" className="hover:text-[#E03E3E] transition-colors">Udaipur</Link>
              <Link href="/cities/jaisalmer" className="hover:text-[#E03E3E] transition-colors">Jaisalmer</Link>
              <Link href="/cities/bundi" className="hover:text-[#E03E3E] transition-colors">Bundi</Link>
              <Link href="/cities/pushkar" className="hover:text-[#E03E3E] transition-colors">Pushkar</Link>
              <Link href="/cities/bikaner" className="hover:text-[#E03E3E] transition-colors">Bikaner</Link>
              <Link href="/cities/shekhawati" className="hover:text-[#E03E3E] transition-colors">Shekhawati</Link>
            </div>
          </div>

          {/* Community & Mission */}
          <div>
            <h4 className="font-sans text-xs font-bold text-[#23261f] uppercase tracking-widest mb-4">
              Community & Mission
            </h4>
            <ul className="space-y-2 text-xs text-[#555c4e] font-light mb-4">
              <li>
                <Link href="/about" className="hover:text-[#E03E3E] transition-colors">
                  About Hide India & Team
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-[#E03E3E] transition-colors">
                  Oral Legends & Folklore
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#E03E3E] transition-colors">
                  Desert Melas & Festivals
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-[#E03E3E] transition-colors">
                  My Saved Tour Circuit
                </Link>
              </li>
            </ul>
            <Link
              href="/contribute"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#E03E3E] hover:bg-[#c93232] text-white font-semibold text-xs shadow-md shadow-[#E03E3E]/20 transition-all cursor-pointer"
            >
              <span>+ Contribute a Gem</span>
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7c8177]">
          <p>© {new Date().getFullYear()} Hide India · Built for Atmanirbhar Bharat & Swadeshi Heritage Preservation.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/hidden-gems" className="hover:text-[#23261f]">Hidden Gems</Link>
            <Link href="/landmarks" className="hover:text-[#23261f]">Major Landmarks</Link>
            <Link href="/crafts" className="hover:text-[#23261f]">GI Crafts</Link>
            <Link href="/about" className="hover:text-[#23261f]">About SIH</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
