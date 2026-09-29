import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const { slug } = params;

    const place = await prisma.place.update({
      where: { slug },
      data: { likesCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      likesCount: place.likesCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
