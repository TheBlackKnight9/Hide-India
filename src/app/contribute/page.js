'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, CheckCircle, Navigation, MapPin, Eye, Info, ArrowLeft } from 'lucide-react';

const categories = [
  'Stepwell',
  'Forgotten Fort',
  'Ancient Temple',
  'Rock Art & Caves',
  'Living Crafts & Handloom',
  'Sacred Grove & Nature Shrine',
];

const rajasthanDistricts = [
  'Jaipur',
  'Jodhpur',
  'Udaipur',
  'Jaisalmer',
  'Bundi',
  'Pushkar',
  'Ajmer',
  'Bikaner',
  'Shekhawati',
  'Chittorgarh',
  'Kumbhalgarh',
  'Alwar',
  'Dausa',
  'Pali',
  'Other Rajasthan District',
];

export default function ContributePage() {
  const [formData, setFormData] = useState({
    placeName: '',
    category: 'Stepwell',
    state: 'Rajasthan',
    district: 'Jaipur',
    isMajor: false,
    latitude: '',
    longitude: '',
    historicalSignificance: '',
    folkloreStory: '',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/20191219_Panna_Meena_ka_Kund_step_well%2C_Amber%2C_Jaipur%2C_1130_9630.jpg',
    submitterName: '',
    submitterEmail: '',
    submitterRole: 'Heritage Enthusiast',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [locating, setLocating] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGetCurrentCoords = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
      },
      (err) => {
        setLocating(false);
        alert('Could not retrieve coordinates: ' + err.message);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.placeName || !formData.district || !formData.historicalSignificance || !formData.submitterName || !formData.submitterEmail) {
      setErrorMsg('Please complete all mandatory fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: [formData.imageUrl],
        }),
      }).then((r) => r.json());

      if (res.success) {
        setSuccess(true);
        setFormData({
          placeName: '',
          category: 'Stepwell',
          state: 'Rajasthan',
          district: 'Jaipur',
          isMajor: false,
          latitude: '',
          longitude: '',
          historicalSignificance: '',
          folkloreStory: '',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/20191219_Panna_Meena_ka_Kund_step_well%2C_Amber%2C_Jaipur%2C_1130_9630.jpg',
          submitterName: '',
          submitterEmail: '',
          submitterRole: 'Heritage Enthusiast',
        });
      } else {
        setErrorMsg(res.message || 'Error submitting contribution.');
      }
    } catch (err) {
      console.error('Error submitting contribution:', err);
      setErrorMsg('Error submitting contribution. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-[#E03E3E] selection:text-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <Link
          href="/explore"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white/50 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Rajasthan Archive</span>
        </Link>

        <span className="text-[10px] font-bold tracking-[0.25em] text-[#E03E3E] uppercase block mb-1">
          Community Living Archive
        </span>

        <h1 className="headline-werlton text-3xl sm:text-5xl text-white mb-3">
          CONTRIBUTE A SANCTUARY
        </h1>
        <p className="text-white/60 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
          Document an unsung stepwell, forgotten Rajput citadel, artisan haveli, or sacred desert grove to help preserve Rajasthan's oral and architectural history.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Submission Form */}
        <div className="lg:col-span-7 bg-[#121318] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          {success && (
            <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-[#3EBFA0]/40 text-white space-y-3 animate-fadeIn">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#3EBFA0] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#3EBFA0]">Place Successfully Added to Hide India!</h4>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed font-light">
                    Thank you for keeping living history alive. Your contributed place has been recorded and submitted to the community heritage catalog.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 bg-[#E03E3E] hover:bg-[#c93232] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  + Add Another Place
                </button>
                <Link
                  href="/explore"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Explore All Sanctuaries →
                </Link>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-[#E03E3E]/10 border border-[#E03E3E]/30 text-[#E03E3E] text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">
                Place / Monument Name *
              </label>
              <input
                type="text"
                name="placeName"
                required
                value={formData.placeName}
                onChange={handleChange}
                placeholder="e.g. Nagar Sagar Kund or Gatore Ki Chhatriyan"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#E03E3E] transition-all"
              />
            </div>

            {/* Classification */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                Classification *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isMajor: false })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    !formData.isMajor
                      ? 'bg-[#E03E3E]/20 border-[#E03E3E] text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">✦ Hidden Gem</span>
                  <p className="text-[11px] text-white/50 mt-1 leading-snug font-light">
                    Uncrowded, secluded sanctuary or lesser-known local secret
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isMajor: true })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.isMajor
                      ? 'bg-[#E03E3E]/20 border-[#E03E3E] text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">🏛️ Major Landmark</span>
                  <p className="text-[11px] text-white/50 mt-1 leading-snug font-light">
                    Prominent, widely recognized citadel, palace, or lake
                  </p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#121318] border border-white/10 rounded-2xl text-sm text-white focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#121318]">
                      {cat === 'Forgotten Fort' ? 'Forts & Citadels' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#121318] border border-white/10 rounded-2xl text-sm text-white focus:outline-none"
                >
                  {rajasthanDistricts.map((dist) => (
                    <option key={dist} value={dist} className="bg-[#121318]">
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* GPS Coordinates */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/50">
                  GPS Coordinates (Optional)
                </label>
                <button
                  type="button"
                  onClick={handleGetCurrentCoords}
                  disabled={locating}
                  className="text-xs font-semibold text-[#E03E3E] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-[#E03E3E]" />
                  <span>{locating ? 'Detecting...' : 'Pin Current GPS'}</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Latitude (e.g. 26.9859)"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Longitude (e.g. 75.8569)"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">
                Historical Significance & Architecture *
              </label>
              <textarea
                name="historicalSignificance"
                required
                rows="4"
                value={formData.historicalSignificance}
                onChange={handleChange}
                placeholder="Explain the background, century, builders, and why this monument is historically significant..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">
                Oral Folklore & Local Legends
              </label>
              <textarea
                name="folkloreStory"
                rows="3"
                value={formData.folkloreStory}
                onChange={handleChange}
                placeholder="Any oral legends, ghost stories, or community folklore associated with this site?"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/50">
                  Real Image URL *
                </label>
                <span className="text-[11px] text-white/40">Direct image link (.jpg / .png)</span>
              </div>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://upload.wikimedia.org/..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none"
              />
              <p className="text-[11px] text-white/40 mt-1.5 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <span>Tip: Right-click any Wikimedia Commons photograph and select "Copy image address".</span>
              </p>
            </div>

            {/* Submitter Details */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
                Contributor Info
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-white/50 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="submitterName"
                    required
                    value={formData.submitterName}
                    onChange={handleChange}
                    placeholder="e.g. Kunal Sharma"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/50 mb-1">Your Email *</label>
                  <input
                    type="email"
                    name="submitterEmail"
                    required
                    value={formData.submitterEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/50 mb-1">Your Role</label>
                  <select
                    name="submitterRole"
                    value={formData.submitterRole}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#121318] border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="Local Resident">Local Resident</option>
                    <option value="Heritage Enthusiast">Heritage Enthusiast</option>
                    <option value="History Researcher">History Researcher</option>
                    <option value="Traveler / Explorer">Traveler / Explorer</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#E03E3E] hover:bg-[#c93232] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#E03E3E]/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>{loading ? 'Adding Place to Archive...' : '+ Add Place to Hide India Archive'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-white/50 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-[#E03E3E]" />
            <span>Live Archive Card Preview</span>
          </div>

          <div className="bg-[#121318] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="relative aspect-[16/10]">
              <img
                src={formData.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/b/b1/20191219_Panna_Meena_ka_Kund_step_well%2C_Amber%2C_Jaipur%2C_1130_9630.jpg'}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 flex items-center space-x-1 text-white text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#E03E3E]" />
                <span>{formData.district || 'Rajasthan'}, Rajasthan</span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-sans text-lg font-bold text-white mb-2">
                {formData.placeName || 'Unnamed Rajasthan Marvel'}
              </h3>
              <p className="text-xs text-white/60 line-clamp-3 leading-relaxed mb-4 font-light">
                {formData.historicalSignificance || 'Your historical summary and significance details will appear here once entered...'}
              </p>
              {formData.folkloreStory && (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-white/70 italic mb-4">
                  "{formData.folkloreStory}"
                </div>
              )}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
                <span>Contributed by {formData.submitterName || 'You'}</span>
                <span className="font-semibold text-[#3EBFA0]">Ready to Submit</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121318] border border-white/10 text-xs text-white/60 leading-relaxed shadow-xl font-light">
            <strong className="text-white block mb-1 font-bold">Preserve Rajasthan Heritage</strong>
            Help document unmonitored baoris, cenotaphs, and haveli frescoes. Your contribution helps travelers bypass crowds and experience genuine history.
          </div>
        </div>
      </div>
    </div>
  );
}
