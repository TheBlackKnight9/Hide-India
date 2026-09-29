import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

// In-memory fallback for local development or when database is offline
const memoryContributions = [];

export async function GET() {
  try {
    const contributions = await prisma.contribution.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ success: true, data: [...contributions, ...memoryContributions] });
  } catch (error) {
    // If DB is offline, return memory contributions
    return NextResponse.json({ success: true, data: memoryContributions });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      placeName,
      category,
      state = 'Rajasthan',
      district,
      isMajor = false,
      latitude,
      longitude,
      historicalSignificance,
      folkloreStory = '',
      images = [],
      submitterName,
      submitterEmail,
      submitterRole = 'Heritage Enthusiast',
    } = body;

    if (!placeName || !category || !district || !historicalSignificance || !submitterName || !submitterEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide mandatory fields: Place Name, Category, District, Significance, and your Name & Email.',
        },
        { status: 400 }
      );
    }

    const newRecord = {
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
      status: 'approved', // auto-approve so contributors see their impact
    };

    let contribution;
    try {
      contribution = await prisma.contribution.create({
        data: newRecord,
      });
    } catch (dbError) {
      console.warn('Prisma DB unavailable, storing in memory fallback:', dbError.message);
      contribution = {
        id: 'contrib-' + Date.now(),
        ...newRecord,
        createdAt: new Date().toISOString(),
      };
      memoryContributions.unshift(contribution);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contributing to Hide India! Your place is successfully added to the archive.',
        data: contribution,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in /api/contributions:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
