'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import {
  MapPin,
  Heart,
  Bookmark,
  Share2,
  Sparkles,
  ArrowLeft,
  Volume2,
  Compass,
  Clock,
  Layers,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function PlaceLivingHero({
  place,
  likes = 0,
  hasLiked = false,
  handleLike,
  saved = false,
  toggleSave,
  handleShare,
  copied = false,
  onOpenFolklore,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const coverImg = place?.coverImage || (place?.images && place.images[0]) || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop';

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animId = null;
    let destroyed = false;

    // Check prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Setup Three.js Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 1, 3000);
    camera.position.z = 1200;

    let renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight, false);
    } catch (err) {
      console.warn('WebGL init notice:', err);
      return;
    }

    // ── Radial Glow Texture for Pollen Motes ──
    function createRadialParticleTexture() {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 64;
      texCanvas.height = 64;
      const ctx = texCanvas.getContext('2d');
      if (!ctx) return null;
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(236, 244, 224, 0.75)');
      grad.addColorStop(0.7, 'rgba(195, 218, 172, 0.25)');
      grad.addColorStop(1, 'rgba(195, 218, 172, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const texture = new THREE.CanvasTexture(texCanvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    }

    const particleTexture = createRadialParticleTexture();

    // ── Uniforms ──
    const uTime = { value: 0 };

    // ── 3,500 Drifting Pollen Motes ──
    const MOTE_COUNT = 3200;
    const motePos = new Float32Array(MOTE_COUNT * 3);
    const moteSeed = new Float32Array(MOTE_COUNT * 4);

    for (let i = 0; i < MOTE_COUNT; i++) {
      const o = i * 3;
      motePos[o] = (Math.random() - 0.5) * 1900;
      motePos[o + 1] = (Math.random() - 0.5) * 1200;
      motePos[o + 2] = (Math.random() - 0.5) * 900 - 150;

      const so = i * 4;
      moteSeed[so] = Math.random() * Math.PI * 2; // phase
      moteSeed[so + 1] = 0.4 + Math.random() * 1.1; // speed
      moteSeed[so + 2] = 0.5 + Math.random() * 0.9; // amp
      moteSeed[so + 3] = 0.6 + Math.random() * 1.4; // size
    }

    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    moteGeo.setAttribute('seed', new THREE.BufferAttribute(moteSeed, 4));

    const moteMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime,
        uMap: { value: particleTexture },
        uSize: { value: 9.0 },
        uScale: { value: 450.0 }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute vec4 seed;
        uniform float uTime, uSize, uScale;
        varying float vFade;
        void main(){
          float ph = seed.x, sp = seed.y, am = seed.z;
          vec3 p = position;
          p.x += sin(uTime * sp * 0.35 + ph) * 36.0 * am;
          float climb = mod(uTime * 12.0 * sp + ph * 60.0, 1500.0) - 750.0;
          p.y += climb;
          p.z += cos(uTime * sp * 0.28 + ph) * 24.0 * am;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * seed.w * (uScale / max(-mv.z, 1.0));
          float edge = 1.0 - abs(climb) / 750.0;
          float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + sp * 1.6) + ph * 3.1);
          vFade = clamp(edge * 3.0, 0.0, 1.0) * twinkle;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uMap;
        varying float vFade;
        void main(){
          vec4 t = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(t.rgb, t.a * vFade * 0.58);
        }
      `
    });

    const motes = new THREE.Points(moteGeo, moteMat);
    motes.frustumCulled = false;
    scene.add(motes);

    // ── Interactive Cursor Spray (Fairy Dust Trail) ──
    const SPRAY_COUNT = 450;
    const sprayPos = new Float32Array(SPRAY_COUNT * 3);
    const sprayVel = new Float32Array(SPRAY_COUNT * 3);
    const sprayBirth = new Float32Array(SPRAY_COUNT);
    const sprayRnd = new Float32Array(SPRAY_COUNT * 2);
    for (let i = 0; i < SPRAY_COUNT; i++) sprayBirth[i] = -999;

    const sprayGeo = new THREE.BufferGeometry();
    sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
    sprayGeo.setAttribute('aVel', new THREE.BufferAttribute(sprayVel, 3));
    sprayGeo.setAttribute('aBirth', new THREE.BufferAttribute(sprayBirth, 1));
    sprayGeo.setAttribute('aRnd', new THREE.BufferAttribute(sprayRnd, 2));

    const sprayMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime,
        uMap: { value: particleTexture },
        uSize: { value: 12.0 },
        uScale: { value: 450.0 },
        uLife: { value: 1.5 }
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute vec3 aVel;
        attribute float aBirth;
        attribute vec2 aRnd;
        uniform float uTime, uSize, uScale, uLife;
        varying float vA;
        void main(){
          float age = uTime - aBirth;
          if (age < 0.0 || age > uLife) {
            vA = 0.0;
            gl_PointSize = 0.0;
            gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
            return;
          }
          float u = age / uLife;
          vec3 p = position + aVel * age * (1.0 - 0.35 * u)
                 + vec3(sin(aRnd.y * 6.28 + age * 2.8) * 20.0 * u, 48.0 * age, 0.0);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * aRnd.x * (uScale / max(-mv.z, 1.0)) * (0.45 + 0.55 * (1.0 - u));
          vA = smoothstep(0.0, 0.08, u) * (1.0 - smoothstep(0.42, 1.0, u));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uMap;
        varying float vA;
        void main(){
          vec4 t = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(t.rgb, t.a * vA * 0.90);
        }
      `
    });

    const spray = new THREE.Points(sprayGeo, sprayMat);
    spray.frustumCulled = false;
    scene.add(spray);

    let sprayHead = 0;
    let sprayDirty = false;
    const sprayPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -150);
    const raycaster = new THREE.Raycaster();
    const sprayAt = new THREE.Vector3();
    const sprayLast = new THREE.Vector3(9999, 0, 0);
    const sprayStep = new THREE.Vector3();
    const ndc = new THREE.Vector2(999, 999);

    function spawnSpray(p, boost = 1) {
      const i = sprayHead;
      sprayHead = (sprayHead + 1) % SPRAY_COUNT;
      const o = i * 3;
      sprayPos[o] = p.x + (Math.random() - 0.5) * 24 * boost;
      sprayPos[o + 1] = p.y + (Math.random() - 0.5) * 24 * boost;
      sprayPos[o + 2] = p.z + (Math.random() - 0.5) * 40;

      sprayVel[o] = (Math.random() - 0.5) * 55 * boost;
      sprayVel[o + 1] = (Math.random() * 50 + 15) * boost;
      sprayVel[o + 2] = (Math.random() - 0.5) * 35 * boost;

      sprayBirth[i] = uTime.value;
      sprayRnd[i * 2] = 0.6 + Math.random() * 0.8;
      sprayRnd[i * 2 + 1] = Math.random();
      sprayDirty = true;
    }

    function flushSpray() {
      if (!sprayDirty) return;
      const at = sprayGeo.attributes;
      at.position.needsUpdate = true;
      at.aVel.needsUpdate = true;
      at.aBirth.needsUpdate = true;
      at.aRnd.needsUpdate = true;
      sprayDirty = false;
    }

    // ── Mouse & Parallax State ──
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let mouseActive = false;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      ndc.x = pointer.x;
      ndc.y = pointer.y;
      mouseActive = true;
    };

    const handlePointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
      ndc.x = 999;
      ndc.y = 999;
      mouseActive = false;
      sprayLast.x = 9999;
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // ── Resize Observer ──
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      const halfH = renderer.getDrawingBufferSize(new THREE.Vector2()).y * 0.5;
      moteMat.uniforms.uScale.value = halfH;
      sprayMat.uniforms.uScale.value = halfH;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // ── Animation Loop ──
    let clock = new THREE.Clock();

    const tick = () => {
      if (destroyed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!reducedMotion) uTime.value += dt;

      // Parallax smoothing
      smooth.x += (pointer.x - smooth.x) * 0.05;
      smooth.y += (pointer.y - smooth.y) * 0.05;

      // Update CSS variables on container for photo parallax
      container.style.setProperty('--px', smooth.x.toFixed(3));
      container.style.setProperty('--py', (-smooth.y).toFixed(3));

      // Camera tilt
      camera.position.x = -smooth.x * 24;
      camera.position.y = smooth.y * 16;
      camera.lookAt(camera.position.x * 0.35, camera.position.y * 0.35, 0);

      // Cursor spray emission
      if (mouseActive && !reducedMotion) {
        raycaster.setFromCamera(ndc, camera);
        if (raycaster.ray.intersectPlane(sprayPlane, sprayAt)) {
          if (sprayLast.x > 9000) {
            sprayLast.copy(sprayAt);
          } else {
            const dist = sprayAt.distanceTo(sprayLast);
            const count = Math.min(12, Math.floor(dist / 9));
            for (let k = 1; k <= count; k++) {
              sprayStep.lerpVectors(sprayLast, sprayAt, k / count);
              spawnSpray(sprayStep);
            }
            if (count > 0) sprayLast.copy(sprayAt);
          }
          flushSpray();
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      if (animId) cancelAnimationFrame(animId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();

      moteGeo.dispose();
      moteMat.dispose();
      sprayGeo.dispose();
      sprayMat.dispose();
      particleTexture?.dispose();
      renderer.dispose();
    };
  }, []);

  const scrollToDossier = (e) => {
    e.preventDefault();
    const el = document.getElementById('dossier-content');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[92vh] sm:min-h-screen overflow-hidden flex flex-col justify-between select-none"
      style={{
        background: '#0B0E0C',
        '--px': '0',
        '--py': '0',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. FULL-BLEED LIVING PHOTO BACKDROP (Parallax + Ambient Breathing)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute -inset-10 z-0 pointer-events-none overflow-hidden"
        style={{
          transform: 'translate3d(calc(var(--px, 0) * 22px), calc(var(--py, 0) * 14px), 0) scale(1.05)',
          willChange: 'transform',
          transition: 'transform 0.15s cubic-bezier(0.2, 0.6, 0.35, 1)',
        }}
      >
        <img
          src={coverImg}
          alt={place?.title || 'Heritage Sanctuary'}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop';
          }}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            imgLoaded ? 'opacity-90' : 'opacity-40'
          }`}
          style={{
            filter: 'brightness(0.66) contrast(1.12) saturate(1.06)',
            animation: 'wallBreathing 24s ease-in-out infinite',
          }}
        />

        {/* Cinematic Living Gradients & Ambient Sanctuary Light Pool */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 36%, rgba(62,191,160,0.08) 0%, rgba(13,18,14,0.38) 55%, rgba(11,14,12,0.85) 100%)',
          }}
        />

        {/* Bottom seamless transition into light page body */}
        <div
          className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #f5f6f1 0%, rgba(245,246,241,0.88) 40%, rgba(245,246,241,0.2) 75%, transparent 100%)',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. THREE.JS 3D LIVING PARTICLE CANVAS (Motes & Cursor Spray)
             (Strictly NO butterfly - as specified by user)
         ───────────────────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
      />

      {/* ─────────────────────────────────────────────────────────────
          3. TOP FLOATING BREADCRUMB & UTILITY CAPSULE
         ───────────────────────────────────────────────────────────── */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 pt-28 sm:pt-32">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Breadcrumb glass capsule */}
          <nav
            aria-label="Breadcrumb"
            className="threeui-panel inline-flex items-center space-x-2.5 px-4 py-2 text-xs text-[#555c4e] font-medium shadow-md"
          >
            <Link
              href="/"
              className="hover:text-[#23261f] transition-colors flex items-center space-x-1"
            >
              <span>Atlas</span>
            </Link>
            <span className="text-[#7c8177]/40">/</span>
            <Link
              href={`/cities/${place?.district?.toLowerCase() || 'jaipur'}`}
              className="hover:text-[#23261f] transition-colors"
            >
              {place?.district || 'Rajasthan'}
            </Link>
            <span className="text-[#7c8177]/40">/</span>
            <span className="text-[#23261f] font-semibold truncate max-w-[200px] sm:max-w-xs">
              {place?.title}
            </span>
          </nav>

          {/* Action buttons (Share, Like, Save in Sylva Dock) */}
          <div className="sylva-dock">
            <button
              onClick={handleShare}
              className="sylva-dock-item"
              title="Copy dossier link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            {copied && (
              <span className="text-[11px] text-[#3EBFA0] font-bold px-2 animate-fadeIn">
                Copied!
              </span>
            )}

            <button
              onClick={handleLike}
              className={hasLiked ? 'sylva-pill-active' : 'sylva-dock-item'}
              title="Curate sanctuary"
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-[#E03E3E]' : ''}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => toggleSave(place)}
              className={saved ? 'sylva-pill-active' : 'sylva-dock-item'}
              title={saved ? 'Remove from Royal Itinerary' : 'Save to Royal Itinerary'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current text-[#E03E3E]' : ''}`} />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          4. GRAND EDITORIAL TITLE & HERO STAGE
         ───────────────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 py-10 sm:py-16 space-y-6">
        {/* Category & District Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3.5 py-1 rounded-full bg-[#E03E3E]/20 border border-[#E03E3E]/40 text-[#E03E3E] text-[11px] font-bold uppercase tracking-widest">
            {place?.category || 'Sanctuary'}
          </span>

          <span className="threeui-panel px-3.5 py-1 text-[11px] font-medium text-white/80 flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E03E3E]" />
            <span>{place?.district}, Rajasthan</span>
          </span>

          {place?.century && (
            <span className="threeui-panel px-3 py-1 text-[11px] font-medium text-white/70">
              {place.century}
            </span>
          )}

          <span className="threeui-panel px-3 py-1 text-[11px] font-semibold text-[#3EBFA0]">
            {place?.isMajor ? 'Crown Landmark' : 'Zero Crowd Sanctuary'}
          </span>
        </div>

        {/* Grand Headline Title */}
        <h1 className="headline-werlton text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-white tracking-tight leading-[0.98] max-w-5xl drop-shadow-2xl">
          {place?.title}
        </h1>

        {/* Editorial Tagline */}
        <p className="text-white/80 text-sm sm:text-lg max-w-3xl font-light leading-relaxed drop-shadow">
          {place?.tagline || place?.history?.slice(0, 180) + '...'}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          {place?.folklore && (
            <button
              onClick={onOpenFolklore}
              className="sylva-dock-btn-accent px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Oral Folklore</span>
            </button>
          )}

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.title + ' ' + place?.district + ' Rajasthan')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sylva-dock px-5 py-2.5 text-white/90 hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#3EBFA0]" />
            <span>Directions & Coordinates</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/60" />
          </a>

          <a
            href="#dossier-content"
            onClick={scrollToDossier}
            className="sylva-dock px-5 py-2.5 text-white/90 hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>Explore Field Dossier</span>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </a>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. ASYMMETRIC FLOATING QUICK-SPEC CARDS (4 Columns)
         ───────────────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 pb-12 sm:pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="threeui-card p-4 sm:p-5 space-y-1 shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7c8177] block">
              Historical Era
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#23261f] leading-snug">
              {place?.century || 'Medieval Royal Era'}
            </p>
          </div>

          <div className="threeui-card p-4 sm:p-5 space-y-1 shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7c8177] block">
              Sanctuary Access
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#23261f] leading-snug">
              {place?.timings || 'Sunrise to Sunset'}
            </p>
          </div>

          <div className="threeui-card p-4 sm:p-5 space-y-1 shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7c8177] block">
              Crowd Quotient
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#1b8a6b] leading-snug">
              {place?.isMajor ? 'Crown Landmark' : 'Zero Crowd Sanctuary'}
            </p>
          </div>

          <div className="threeui-card p-4 sm:p-5 space-y-1 shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7c8177] block">
              Living GI Craft
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#23261f] leading-snug truncate">
              {place?.giTagCraft || 'Generational Artisan Lineage'}
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. VERTICAL "DISCOVER" SCROLL CUE
         ───────────────────────────────────────────────────────────── */}
      <a
        href="#dossier-content"
        onClick={scrollToDossier}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center space-y-3 text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors font-medium cursor-pointer"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span>Discover Dossier</span>
        <div className="w-[1px] h-14 bg-white/20 relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-5 bg-[#3EBFA0]"
            style={{ animation: 'trickle 2.4s ease-in-out infinite' }}
          />
        </div>
      </a>
    </div>
  );
}
