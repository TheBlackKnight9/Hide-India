import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_'));
  return NextResponse.json({
    status: 'online',
    geminiConfigured: isConfigured,
    activeModel: isConfigured ? 'gemini-1.5-flash' : 'rajasthan-heritage-engine',
    mode: isConfigured ? 'gemini_api' : 'cultural_engine',
  });
}
