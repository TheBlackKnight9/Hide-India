import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { placeId, authorName, rating, comment, travelTips } = await request.json();

    if (!placeId || !authorName || !comment) {
      return NextResponse.json(
        { success: false, message: 'Please provide placeId, authorName, and comment' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        placeId,
        authorName,
        rating: parseInt(rating) || 5,
        comment,
        travelTips: travelTips || '',
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Review create error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
