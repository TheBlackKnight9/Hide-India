'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Sparkles, CheckCircle, Navigation, MapPin, Eye, Info, ArrowLeft } from 'lucide-react';

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
      () => {
        setLocating(false);
        alert('Could not detect coordinates. You can type them manually.');
      }
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
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <Link
          href="/explore"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Rajasthan Archive</span>
        </Link>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-[11px] font-semibold text-stone-700 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Hide Rajasthan · Community Living Archive</span>
        </div>

        <h1 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-3">
          Contribute a Rajasthan Place
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Document an unsung stepwell, forgotten Rajput citadel, artisan haveli, or sacred desert grove to help preserve Rajasthan's oral and architectural history.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Submission Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm">
          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Contribution Received with Gratitude!</h4>
                <p className="text-xs mt-1">
                  Your place entry has been recorded in the Rajasthan Heritage Archive. Thank you for keeping Rajasthan’s living history alive.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Place / Monument Name *
              </label>
              <input
                type="text"
                name="placeName"
                required
                value={formData.placeName}
                onChange={handleChange}
                placeholder="e.g. Nagar Sagar Kund or Gatore Ki Chhatriyan"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-stone-900/10 focus:outline-none transition-all"
              />
            </div>

            {/* Type: Major Landmark vs Hidden Gem */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Classification *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isMajor: false })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    !formData.isMajor
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center space-x-1">
                    <span>✦ Hidden Gem</span>
                  </span>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Uncrowded, secluded sanctuary or lesser-known local secret
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isMajor: true })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.isMajor
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 text-amber-950'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center space-x-1">
                    <span>🏛️ Major Landmark</span>
                  </span>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Prominent, widely recognized citadel, palace, or lake
                  </p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  City / District in Rajasthan *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none"
                >
                  {rajasthanDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* GPS coordinates */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Coordinates (Optional)
                </label>
                <button
                  type="button"
                  onClick={handleGetCurrentCoords}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-emerald-600" />
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
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Longitude (e.g. 75.8569)"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Historical Significance & Architecture *
              </label>
              <textarea
                name="historicalSignificance"
                required
                rows="4"
                value={formData.historicalSignificance}
                onChange={handleChange}
                placeholder="Explain the background, century, builders, and why this monument is historically significant..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Oral Folklore & Local Legends
              </label>
              <textarea
                name="folkloreStory"
                rows="3"
                value={formData.folkloreStory}
                onChange={handleChange}
                placeholder="Any oral legends, ghost stories, or community folklore associated with this site?"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Real Image URL (Wikipedia Commons / Public Photo) *
                </label>
                <span className="text-[11px] text-stone-500">Direct image link (.jpg / .png)</span>
              </div>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://upload.wikimedia.org/..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none"
              />
              <p className="text-[11px] text-stone-500 mt-1.5 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Tip: Right-click any Wikipedia or Wikimedia Commons monument photograph and select "Copy image address".</span>
              </p>
            </div>

            {/* Submitter Details */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Contributor Info
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="submitterName"
                    required
                    value={formData.submitterName}
                    onChange={handleChange}
                    placeholder="e.g. Kunal Sharma"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Email *</label>
                  <input
                    type="email"
                    name="submitterEmail"
                    required
                    value={formData.submitterEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Role</label>
                  <select
                    name="submitterRole"
                    value={formData.submitterRole}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
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
              className="w-full py-4 bg-stone-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Submitting to Archive...' : '+ Submit Place to Rajasthan Archive'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-stone-900" />
            <span>Live Archive Card Preview</span>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-md">
            <div className="relative aspect-[16/10] bg-stone-100">
              <img
                src={formData.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/b/b1/20191219_Panna_Meena_ka_Kund_step_well%2C_Amber%2C_Jaipur%2C_1130_9630.jpg'}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-white text-xs drop-shadow-md">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{formData.district || 'Rajasthan'}, Rajasthan</span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center space-x-2 text-[11px] font-medium text-stone-500 mb-2">
                <span className="bg-stone-100 text-stone-800 font-semibold px-2.5 py-0.5 rounded-full">
                  {formData.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  formData.isMajor ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {formData.isMajor ? 'Major Landmark' : '✦ Hidden Gem'}
                </span>
              </div>
              <h3 className="font-sans text-lg font-bold text-stone-900 mb-2">
                {formData.placeName || 'Unnamed Rajasthan Marvel'}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                {formData.historicalSignificance || 'Your historical summary and significance details will appear here once entered...'}
              </p>
              {formData.folkloreStory && (
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-900 italic mb-4">
                  "{formData.folkloreStory}"
                </div>
              )}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Contributed by {formData.submitterName || 'You'}</span>
                <span className="font-semibold text-emerald-700">Ready to Submit</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-600 leading-relaxed shadow-xs">
            <strong className="text-stone-900 block mb-1">Preserve Rajasthan Heritage</strong>
            Help document unmonitored baoris, cenotaphs, and haveli frescoes. Your contribution helps travelers bypass crowds and experience genuine history.
          </div>
        </div>
      </div>
    </div>
  );
}
