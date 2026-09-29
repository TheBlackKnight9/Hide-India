import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { rajasthanFallbackPlaces } from '../../../../data/rajasthanFallbackPlaces';

export const dynamic = 'force-dynamic';

const RAJASTHAN_CITIES = {
  jaipur: { district: 'Jaipur', name: 'Jaipur' },
  amer: { district: 'Jaipur', name: 'Amer, Jaipur' },
  jodhpur: { district: 'Jodhpur', name: 'Jodhpur' },
  udaipur: { district: 'Udaipur', name: 'Udaipur' },
  jaisalmer: { district: 'Jaisalmer', name: 'Jaisalmer' },
  bundi: { district: 'Bundi', name: 'Bundi' },
  pushkar: { district: 'Pushkar', name: 'Pushkar' },
  ajmer: { district: 'Ajmer', name: 'Ajmer' },
  bikaner: { district: 'Bikaner', name: 'Bikaner' },
  shekhawati: { district: 'Shekhawati', name: 'Shekhawati' },
  mandawa: { district: 'Shekhawati', name: 'Mandawa' },
  chittorgarh: { district: 'Chittorgarh', name: 'Chittorgarh' },
  kumbhalgarh: { district: 'Kumbhalgarh', name: 'Kumbhalgarh' },
  alwar: { district: 'Alwar', name: 'Alwar' },
  sariska: { district: 'Alwar', name: 'Sariska' },
  dausa: { district: 'Dausa', name: 'Dausa' },
  abhaneri: { district: 'Dausa', name: 'Abhaneri' },
};

function parseDurationMinutes(text) {
  const hourMatch = text.match(/(\d+)\s*(?:hours?|hrs?|h)\b/i);
  if (hourMatch) return parseInt(hourMatch[1], 10) * 60;

  const minuteMatch = text.match(/(\d+)\s*(?:minutes?|mins?|m)\b/i);
  if (minuteMatch) return parseInt(minuteMatch[1], 10);

  if (/half\s*(?:a)?\s*day/i.test(text)) return 240;
  if (/full\s*(?:a)?\s*day|1\s*day/i.test(text)) return 420;
  return 120; // default 2h
}

function detectCity(text) {
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(RAJASTHAN_CITIES)) {
    if (lower.includes(key)) return val;
  }
  return { district: 'Jaipur', name: 'Jaipur' };
}

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Please provide a prompt' },
        { status: 400 }
      );
    }

    const durationMinutes = parseDurationMinutes(prompt);
    const targetCity = detectCity(prompt);

    // Fetch places for target district
    let cityPlaces = [];
    try {
      cityPlaces = await prisma.place.findMany({
        where: { district: { contains: targetCity.district, mode: 'insensitive' } },
        take: 6,
      });
    } catch {
      cityPlaces = [];
    }

    if (!cityPlaces || cityPlaces.length === 0) {
      cityPlaces = rajasthanFallbackPlaces.filter(
        (p) => p.district.toLowerCase() === targetCity.district.toLowerCase()
      );
    }
    if (cityPlaces.length === 0) {
      cityPlaces = rajasthanFallbackPlaces.slice(0, 4);
    }

    // Determine slots based on duration
    const slotCount = Math.max(1, Math.min(3, Math.floor(durationMinutes / 60)));
    const selectedPlaces = cityPlaces.slice(0, slotCount);

    const timeline = selectedPlaces.map((p, idx) => ({
      time: `Stop ${idx + 1}`,
      duration: `${Math.round(durationMinutes / slotCount)} mins`,
      title: p.title,
      slug: p.slug,
      district: p.district,
      state: 'Rajasthan',
      category: p.category,
      highlight: p.tagline || p.history?.slice(0, 140) + '...',
      giCraft: p.giTagCraft || 'Local Rajasthan Handloom',
    }));

    const resultData = {
      targetCity: targetCity.name,
      duration: `${Math.round(durationMinutes / 60)} Hours`,
      itineraryTitle: `${targetCity.name} ${Math.round(durationMinutes / 60)}h Cultural Circuit`,
      itinerarySummary: `An unhurried heritage trail through ${targetCity.name} curated to bypass crowds and experience genuine Rajput architecture and craftsmanship.`,
      timeline,
    };

    // If Gemini API is available, try enhancement
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_')) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are an expert cultural historian of Rajasthan. User prompt: "${prompt}". Places available: ${selectedPlaces.map((p) => p.title).join(', ')}. Return a JSON with: itineraryTitle, itinerarySummary (1-2 sentences on how to enjoy these places without crowds). Format: {"itineraryTitle": "...", "itinerarySummary": "..."}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.itineraryTitle) resultData.itineraryTitle = parsed.itineraryTitle;
            if (parsed.itinerarySummary) resultData.itinerarySummary = parsed.itinerarySummary;
            return NextResponse.json({ success: true, engine: 'gemini-1.5-flash', data: resultData });
          }
        }
      } catch (err) {
        console.warn('Gemini enhancement skipped, using built-in heritage engine:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      engine: 'rajasthan-heritage-engine',
      data: resultData,
    });
  } catch (error) {
    console.error('AI plan route error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
