import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Editorial Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-sm">
                <span className="text-xs font-black">✦</span>
              </div>
              <div>
                <span className="font-sans text-xl font-bold tracking-tight text-white block">
                  Hide Rajasthan
                </span>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                  Royal Cultural Edition
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Preserving Rajasthan’s subterranean stepwells, Rajput citadels, Shekhawati havelis, and desert folklore beyond commercial tourist circuits.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-800 border border-stone-700 text-[10px] text-amber-300 tracking-wider uppercase font-semibold">
              <span>SIH25130 · Swadeshi Heritage</span>
            </div>
          </div>

          {/* Dedicated Explore Pages */}
          <div>
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/cities" className="hover:text-white transition-colors">
                  🏛️ The 10 Royal Cities
                </Link>
              </li>
              <li>
                <Link href="/hidden-gems" className="hover:text-white transition-colors">
                  ✦ Zero-Crowd Hidden Gems
                </Link>
              </li>
              <li>
                <Link href="/landmarks" className="hover:text-white transition-colors">
                  🏰 Crown Citadels & Landmarks
                </Link>
              </li>
              <li>
                <Link href="/crafts" className="hover:text-white transition-colors">
                  🧵 GI Crafts & Living Artisans
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-white transition-colors">
                  ✨ AI Heritage Circuit Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* 10 Major Cities */}
          <div>
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4">
              City Dossiers
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-400">
              <Link href="/cities/jaipur" className="hover:text-white transition-colors">Jaipur</Link>
              <Link href="/cities/jodhpur" className="hover:text-white transition-colors">Jodhpur</Link>
              <Link href="/cities/udaipur" className="hover:text-white transition-colors">Udaipur</Link>
              <Link href="/cities/jaisalmer" className="hover:text-white transition-colors">Jaisalmer</Link>
              <Link href="/cities/bundi" className="hover:text-white transition-colors">Bundi</Link>
              <Link href="/cities/pushkar" className="hover:text-white transition-colors">Pushkar</Link>
              <Link href="/cities/bikaner" className="hover:text-white transition-colors">Bikaner</Link>
              <Link href="/cities/shekhawati" className="hover:text-white transition-colors">Shekhawati</Link>
            </div>
          </div>

          {/* Community & Mission */}
          <div>
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4">
              Community & Mission
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 mb-4">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Hide Rajasthan & Team
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-white transition-colors">
                  Oral Legends & Folklore
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Desert Melas & Festivals
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">
                  My Saved Tour Circuit
                </Link>
              </li>
            </ul>
            <Link
              href="/contribute"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-all"
            >
              <span>+ Contribute a Gem</span>
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Hide Rajasthan · Built for Atmanirbhar Bharat & Swadeshi Heritage Preservation.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/hidden-gems" className="hover:text-stone-300">Hidden Gems</Link>
            <Link href="/landmarks" className="hover:text-stone-300">Major Landmarks</Link>
            <Link href="/crafts" className="hover:text-stone-300">GI Crafts</Link>
            <Link href="/about" className="hover:text-stone-300">About SIH</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
