import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { rajasthanFallbackPlaces } from '../../../data/rajasthanFallbackPlaces';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const district = searchParams.get('district') || searchParams.get('city') || '';
    const state = searchParams.get('state') || '';
    const isMajor = searchParams.get('isMajor');
    const sort = searchParams.get('sort') || 'popular';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined;

    const where = {};
    if (state && state.toLowerCase() !== 'all') {
      where.state = { equals: state, mode: 'insensitive' };
    }
    if (category && category.toLowerCase() !== 'all') {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (district && district.toLowerCase() !== 'all' && district.toLowerCase() !== 'all cities') {
      where.district = { contains: district, mode: 'insensitive' };
    }
    if (isMajor !== null && isMajor !== undefined && isMajor !== '') {
      where.isMajor = isMajor === 'true';
    }
    if (search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { district: { contains: search.trim(), mode: 'insensitive' } },
        { history: { contains: search.trim(), mode: 'insensitive' } },
        { dynasty: { contains: search.trim(), mode: 'insensitive' } },
        { tagline: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    let orderBy = { viewsCount: 'desc' };
    if (sort === 'popular') orderBy = { likesCount: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const places = await prisma.place.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        _count: { select: { reviews: true, events: true } },
      },
    });

    if (places && places.length > 0) {
      return NextResponse.json({
        success: true,
        count: places.length,
        data: places,
      });
    }

    // Fallback if DB returns empty
    let fallback = [...rajasthanFallbackPlaces];
    if (district && district.toLowerCase() !== 'all' && district.toLowerCase() !== 'all cities') {
      fallback = fallback.filter((p) => p.district.toLowerCase().includes(district.toLowerCase()));
    }
    if (category && category.toLowerCase() !== 'all') {
      fallback = fallback.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (isMajor !== null && isMajor !== undefined && isMajor !== '') {
      fallback = fallback.filter((p) => p.isMajor === (isMajor === 'true'));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      fallback = fallback.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }
    if (limit) fallback = fallback.slice(0, limit);

    return NextResponse.json({
      success: true,
      count: fallback.length,
      data: fallback,
    });
  } catch (error) {
    console.error('API /api/places error, serving fallback archive:', error);
    return NextResponse.json({
      success: true,
      count: rajasthanFallbackPlaces.length,
      data: rajasthanFallbackPlaces,
    });
  }
}
