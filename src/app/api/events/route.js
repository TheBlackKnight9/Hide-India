import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

const fallbackEvents = [
  {
    id: 'pushkar-mela-1',
    title: 'Pushkar Camel & Sacred Lake Fair',
    category: 'Sacred Mela',
    location: 'Pushkar Lake & Thar Dunes',
    state: 'Rajasthan',
    startDate: new Date('2026-11-15'),
    endDate: new Date('2026-11-23'),
    description: 'One of the world’s largest and oldest camel and livestock fairs combined with holy Kartik Purnima dip in the sacred waters of Lake Pushkar.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg/1280px-Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg',
    organizer: 'Rajasthan Tourism & Pushkar Purohit Guild',
    isAnnual: true,
  },
  {
    id: 'desert-festival-jaisalmer',
    title: 'Jaisalmer Desert Festival (Maru Mahotsav)',
    category: 'Folk Festival',
    location: 'Sam Sand Dunes, Jaisalmer',
    state: 'Rajasthan',
    startDate: new Date('2027-02-18'),
    endDate: new Date('2027-02-21'),
    description: 'A celebration of Thar desert folk music featuring Manganiyar singers, Ghoomar dancers, Kalbelia performers, and camel polo against golden sand dunes.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/1280px-Jaisalmer_forteresse.jpg',
    organizer: 'Department of Tourism Rajasthan',
    isAnnual: true,
  },
  {
    id: 'bundi-utsav',
    title: 'Bundi Utsav & Stepwell Deepotsav',
    category: 'Cultural Festival',
    location: 'Raniji Ki Baori & Garh Palace, Bundi',
    state: 'Rajasthan',
    startDate: new Date('2026-11-28'),
    endDate: new Date('2026-11-30'),
    description: 'Centuries-old celebration of Bundi craftsmanship where thousands of earthen diyas light up the historic stepwells, accompanied by classical Hadoti music.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Rani_ji_ki_Baori_Bundi.jpg/1280px-Rani_ji_ki_Baori_Bundi.jpg',
    organizer: 'District Administration Bundi',
    isAnnual: true,
  },
];

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
    });
    return NextResponse.json({
      success: true,
      count: events.length > 0 ? events.length : fallbackEvents.length,
      data: events.length > 0 ? events : fallbackEvents,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      count: fallbackEvents.length,
      data: fallbackEvents,
    });
  }
}
