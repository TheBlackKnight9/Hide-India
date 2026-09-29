'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, Sparkles, Menu, X, Plus } from 'lucide-react';
import { useSaved } from '../context/SavedContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { savedPlaces } = useSaved();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'MAIN',        path: '/' },
    { name: 'CITIES',      path: '/cities' },
    { name: 'HIDDEN GEMS', path: '/hidden-gems' },
    { name: 'LANDMARKS',   path: '/landmarks' },
    { name: 'GI CRAFTS',   path: '/crafts' },
    { name: 'FESTIVALS',   path: '/events' },
    { name: 'STORIES',     path: '/stories' },
  ];

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={`mx-auto flex items-center justify-between px-5 sm:px-8 lg:px-12 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-[#0A0B0E]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl'
            : 'py-5 bg-transparent'
        }`}
      >
        {/* LEFT: Logo - Werlton style with red mark */}
        <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
          <div className="w-6 h-6 rounded-md bg-[#E03E3E] flex items-center justify-center text-white shadow-md shadow-[#E03E3E]/30 group-hover:scale-105 transition-transform">
            <span className="text-[10px] font-black tracking-tighter">HI</span>
          </div>
          <span className="font-sans font-black text-sm sm:text-base tracking-widest text-white uppercase whitespace-nowrap">
            Hide India
          </span>
        </Link>

        {/* CENTER: Desktop Nav - Minimal uppercase links with red dot */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`relative py-1 text-[11px] font-bold tracking-widest transition-all whitespace-nowrap ${
                  active
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#E03E3E] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Actions according to user requirements */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Saved counter */}
          <Link
            href="/saved"
            className="relative p-2 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            title="Saved Heritage Gems"
          >
            <Bookmark className="w-4 h-4" />
            {savedPlaces.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#E03E3E] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {savedPlaces.length}
              </span>
            )}
          </Link>

          {/* Add Contribute Button - Vibrant Red/Coral */}
          <Link
            href="/contribute"
            className="flex items-center space-x-1.5 bg-[#E03E3E] hover:bg-[#c93232] text-white rounded-full px-3.5 sm:px-4 py-2 text-xs font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-[#E03E3E]/20 whitespace-nowrap cursor-pointer"
            title="Contribute a Hidden Heritage Place"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Contribute</span>
          </Link>

          {/* AI Planner CTA Button */}
          <Link
            href="/planner"
            className="hidden md:flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-full px-4 py-2 text-xs font-bold tracking-wider transition-all active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI PLANNER</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden mx-4 mt-1 bg-[#121318]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold tracking-wider transition-all ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.name}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#E03E3E]" />}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link
              href="/contribute"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-[#E03E3E] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-[#E03E3E]/30"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Contribute a Heritage Gem</span>
            </Link>
            <Link
              href="/planner"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-white/10 text-white text-xs font-bold tracking-wider uppercase border border-white/15"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Plan with AI</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
