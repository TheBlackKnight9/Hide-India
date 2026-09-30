'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Landmark,
  Layers,
  Shield,
  Sparkles,
  BookOpen,
  Flame,
  Bookmark,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { useSaved } from '../context/SavedContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { savedPlaces } = useSaved();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'EXPLORE',     path: '/',            icon: Compass },
    { name: 'CITIES',      path: '/cities',       icon: Landmark },
    { name: 'STEPWELLS',   path: '/hidden-gems',  icon: Layers },
    { name: 'CITADELS',    path: '/landmarks',    icon: Shield },
    { name: 'GI CRAFTS',   path: '/crafts',       icon: Sparkles },
    { name: 'STORIES',     path: '/stories',      icon: BookOpen },
    { name: 'FESTIVALS',   path: '/events',       icon: Flame },
  ];

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none flex flex-col items-center">
      {/* ── THREEUI SYLVA FLOATING DOCK (Matches media_1790741345547.png) ── */}
      <nav
        className="sylva-dock pointer-events-auto max-w-full overflow-x-auto scrollbar-none"
        aria-label="Primary Navigation"
      >
        {/* 1. LEFT: Brand Anchor Mark (Porcelain Squircle Knob) */}
        <Link
          href="/"
          className="sylva-dock-mark"
          title="Hide India - Living Heritage Atlas"
          aria-label="Hide India Home"
        >
          {/* Heritage Architectural Dome / Temple Chhatri Glyph */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M12 2C9 2 7 5.5 7 8v1.5H5a1 1 0 0 0-1 1V21a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10.5a1 1 0 0 0-1-1h-2V8c0-2.5-2-6-5-6zm0 2.2c1.8 0 2.8 2 2.9 3.8H9.1C9.2 6.2 10.2 4.2 12 4.2zM8.5 11h7v9h-7v-9z"/>
          </svg>
        </Link>

        {/* Brand Label (Hidden on small laptops, visible on wide screens) */}
        <Link
          href="/"
          className="hidden 2xl:flex flex-col ml-1 mr-2 text-left leading-none"
          title="Hide India Atlas"
        >
          <span className="text-[11px] font-black tracking-widest text-[#fbfcf8] uppercase">
            HIDE INDIA
          </span>
          <span className="text-[8px] font-mono tracking-widest text-[#9ca395] uppercase">
            SANCTUARY
          </span>
        </Link>

        {/* 2. CENTER: Desktop Nav Links with Micro-Glyphs */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={active ? 'sylva-pill-active' : 'sylva-dock-item'}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#1c2018]' : ''}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* 3. RIGHT: Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-1">
          {/* Saved Places Counter */}
          <Link
            href="/saved"
            className={pathname === '/saved' ? 'sylva-pill-active' : 'sylva-dock-item'}
            title="Saved Heritage Gems"
          >
            <Bookmark className={`w-3.5 h-3.5 text-[#E03E3E] ${pathname === '/saved' ? 'fill-current' : ''}`} />
            <span className="hidden xl:inline">SAVED</span>
            {savedPlaces.length > 0 && (
              <span className="bg-[#E03E3E] text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full px-1 flex items-center justify-center ml-0.5">
                {savedPlaces.length}
              </span>
            )}
          </Link>

          {/* AI Route Planner Button */}
          <Link
            href="/planner"
            className={pathname === '/planner' ? 'sylva-pill-active' : 'sylva-dock-item'}
            title="AI Heritage Route Planner"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI PLANNER</span>
          </Link>

          {/* Contribute / Add Place CTA */}
          <Link
            href="/contribute"
            className="sylva-dock-btn-accent"
            title="Contribute a Heritage Gem"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">ADD PLACE</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-0.5 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE ACCORDION DRAWER (ThreeUI Sylva Floating Sheet) ── */}
      {isOpen && (
        <div className="lg:hidden pointer-events-auto mt-2 w-full max-w-sm p-4 rounded-3xl bg-[#141812]/95 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/60 space-y-1.5 animate-fadeIn text-[#fbfcf8]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#9ca395]">
              Heritage Navigation Atlas
            </span>
            <span className="text-[10px] font-bold text-[#E03E3E] uppercase tracking-wider">
              Hide India
            </span>
          </div>

          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                  active
                    ? 'bg-[#fbfcf8] text-[#1c2018] shadow-md shadow-black/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#1c2018]' : 'text-white/60'}`} />
                  <span>{link.name}</span>
                </div>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#E03E3E]" />}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link
              href="/contribute"
              onClick={() => setIsOpen(false)}
              className="w-full sylva-dock-btn-accent justify-center py-2.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Contribute a Heritage Gem</span>
            </Link>
            <Link
              href="/planner"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-[#fbfcf8] text-xs font-bold tracking-wider uppercase border border-white/10"
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
