import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { rajasthanFallbackPlaces } from '../../../../data/rajasthanFallbackPlaces';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    let place = await prisma.place.findUnique({
      where: { slug },
      include: {
        reviews: { orderBy: { createdAt: 'desc' } },
        events: true,
      },
    });

    if (place) {
      // Async increment views
      prisma.place.update({
        where: { id: place.id },
        data: { viewsCount: { increment: 1 } },
      }).catch(() => {});

      const nearby = await prisma.place.findMany({
        where: {
          district: place.district,
          id: { not: place.id },
        },
        take: 3,
      });

      return NextResponse.json({
        success: true,
        data: place,
        nearby,
      });
    }

    // Fallback matching
    const fallback = rajasthanFallbackPlaces.find((p) => p.slug === slug);
    if (fallback) {
      const nearby = rajasthanFallbackPlaces
        .filter((p) => p.district === fallback.district && p.id !== fallback.id)
        .slice(0, 3);
      return NextResponse.json({
        success: true,
        data: fallback,
        nearby,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Place not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in /api/places/[slug]:', error);
    const fallback = rajasthanFallbackPlaces.find((p) => p.slug === params.slug);
    if (fallback) {
      return NextResponse.json({
        success: true,
        data: fallback,
        nearby: [],
      });
    }
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
