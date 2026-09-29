'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, Plus, Menu, X, Sparkles } from 'lucide-react';
import { useSaved } from '../context/SavedContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { savedPlaces } = useSaved();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cities', path: '/cities' },
    { name: 'Hidden Gems', path: '/hidden-gems' },
    { name: 'Landmarks', path: '/landmarks' },
    { name: 'GI Crafts', path: '/crafts' },
    { name: 'Festivals', path: '/events' },
    { name: 'Folklore', path: '/stories' },
    { name: 'AI Planner', path: '/planner' },
  ];

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-6xl transition-all">
      {/* Floating Island Pill */}
      <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-lg shadow-stone-900/5 rounded-full px-3.5 sm:px-5 py-2 flex items-center justify-between gap-2 sm:gap-4 transition-all">
        {/* Left: Brand Logo & Edition Pill */}
        <Link href="/" className="flex items-center space-x-2 shrink-0 group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <span className="text-xs font-black">✦</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-sans font-bold text-sm sm:text-base tracking-tight text-stone-900 whitespace-nowrap">
              Hide Rajasthan
            </span>
            <span className="hidden xl:inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 rounded-full border border-amber-200 shrink-0 whitespace-nowrap">
              Royal Edition
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Saved + Contribute CTA + Mobile Menu Button) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Saved Bookmarks */}
          <Link
            href="/saved"
            className="relative p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-colors"
            title="Saved Heritage Gems"
          >
            <Bookmark className="w-4 h-4" />
            {savedPlaces.length > 0 && (
              <span className="absolute top-0 right-0 bg-stone-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {savedPlaces.length}
              </span>
            )}
          </Link>

          {/* Dark CTA: Contribute */}
          <Link
            href="/contribute"
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-3.5 sm:px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-md flex items-center space-x-1.5 transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Contribute</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Floating Drawer Sheet */}
      {isOpen && (
        <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-4 shadow-xl space-y-1.5 animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span>{link.name}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-stone-100 space-y-2">
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-2xl text-xs font-semibold text-stone-700 hover:bg-stone-100"
            >
              <span>About SIH Initiative</span>
            </Link>

            <Link
              href="/contribute"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-1.5 py-3 rounded-2xl bg-amber-600 text-white text-xs font-semibold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Contribute a Rajasthan Gem</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
