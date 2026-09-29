import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

const fallbackStories = [
  {
    id: 'story-kuldhara',
    title: 'The Midnight Exodus: How 84 Paliwal Villages Vanished in a Single Night',
    author: 'Kunal Sharma · Hide India Research Fellow',
    state: 'Rajasthan',
    district: 'Jaisalmer',
    category: 'Folklore & Legend',
    readTimeMinutes: 5,
    summary: 'In 1825, over a thousand prosperous villagers vanished overnight leaving behind intact kitchens, grain silos, and a curse upon any who would dare settle their soil.',
    content: 'Deep in the Thar Desert lies Kuldhara, once a thriving agricultural township founded in the 13th century by prosperous Paliwal Brahmins who mastered deep desert water harvesting.\n\nLocal legend holds that the despotic Prime Minister of Jaisalmer, Salim Singh, set his eyes on the village chief’s daughter and delivered an ultimatum: surrender the girl or face massacre. Instead of submitting to tyranny or breaking their honor, the community elders held a secret council. In a single dark desert night, all 84 surrounding villages evacuated their ancestral homes without taking their wealth or silver.\n\nBefore leaving, the council cast a binding curse: that no one would ever be able to inhabit Kuldhara again. To this day, the roofless yellow sandstone streets remain frozen in time, silently defying the desert winds.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Kuldhara%2C_an_abandoned_village_%2830738705327%29.jpg/1280px-Kuldhara%2C_an_abandoned_village_%2830738705327%29.jpg',
    tags: ['Ghost Village', 'Paliwal Brahmins', 'Jaisalmer', 'Desert Legends'],
  },
  {
    id: 'story-chand-baori',
    title: 'The Mathematical Mirage of Abhaneri: 3,500 Steps Engineered for Desert Solace',
    author: 'Sunil Rao · Architectural Historian',
    state: 'Rajasthan',
    district: 'Dausa',
    category: 'Hydro-Engineering',
    readTimeMinutes: 6,
    summary: 'Descending 13 storeys into the earth, Chand Baori is an acoustic and mathematical wonder built by King Chanda in the 9th century to master the arid climate.',
    content: 'Built in the 9th century CE by King Chanda of the Nikumbha dynasty, Chand Baori is one of the deepest and most spectacular stepped hydro-structures on earth. Descending 13 storeys (approx. 20 meters), 3,500 symmetrical narrow steps create an inverted pyramid designed to retain cool rainwater in an intensely arid zone.\n\nBecause of its inverted subterranean geometry, the ambient temperature at the bottom of the well remains 5 to 6 degrees cooler than at the surface, providing a natural community sanctuary during searing Rajasthan summers.\n\nLocal lore attributed the stepwell’s impossible symmetry to nocturnal spirit architects (Djinns), as villagers believed no mortal builder could carve such endless geometric precision without repeating a single step.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Chand_Baori_perspective_panorama_%28July_2022%29.jpg/1280px-Chand_Baori_perspective_panorama_%28July_2022%29.jpg',
    tags: ['Hydro-Engineering', 'Abhaneri', 'Stepwells', 'Nikumbha Dynasty'],
  },
];

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({
      success: true,
      count: stories.length > 0 ? stories.length : fallbackStories.length,
      data: stories.length > 0 ? stories : fallbackStories,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      count: fallbackStories.length,
      data: fallbackStories,
    });
  }
}
