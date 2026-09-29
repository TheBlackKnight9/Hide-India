import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const contributions = await prisma.contribution.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ success: true, data: contributions });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      placeName,
      category,
      state,
      district,
      isMajor,
      latitude,
      longitude,
      historicalSignificance,
      folkloreStory,
      images,
      submitterName,
      submitterEmail,
      submitterRole,
    } = body;

    if (!placeName || !category || !state || !district || !historicalSignificance || !submitterName || !submitterEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide all required fields: place name, category, state, district, historical summary, and your name/email',
        },
        { status: 400 }
      );
    }

    const contribution = await prisma.contribution.create({
      data: {
        placeName,
        category,
        state,
        district,
        isMajor: Boolean(isMajor),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        historicalSignificance,
        folkloreStory: folkloreStory || '',
        images: Array.isArray(images) ? images : images ? [images] : [],
        submitterName,
        submitterEmail,
        submitterRole: submitterRole || 'Heritage Enthusiast',
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for contributing to Hide Rajasthan! Your submission is in moderation review.',
      data: contribution,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in /api/contributions:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
