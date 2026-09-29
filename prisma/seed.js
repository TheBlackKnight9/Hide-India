const { PrismaClient } = require('@prisma/client');
const { rajasthanFallbackPlaces } = require('../src/data/rajasthanFallbackPlaces.js');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Rajasthan Specific Heritage & Cultural Seed with 82 destinations & verified images...');

  // Clear existing data safely
  await prisma.review.deleteMany();
  await prisma.event.deleteMany();
  await prisma.place.deleteMany();
  await prisma.story.deleteMany();
  await prisma.contribution.deleteMany();

  console.log(`Seeding ${rajasthanFallbackPlaces.length} destinations...`);

  for (const p of rajasthanFallbackPlaces) {
    const { id, _count, createdAt, updatedAt, ...placeData } = p;
    await prisma.place.create({
      data: {
        ...placeData,
        isVerified: true,
      },
    });
  }

  // Seed Events in Rajasthan
  const eventsData = [
    {
      title: 'Momasar Utsav (Rural Village Festival)',
      category: 'Folk Festival',
      location: 'Momasar Village, Bikaner District',
      state: 'Rajasthan',
      startDate: new Date('2026-11-06'),
      endDate: new Date('2026-11-08'),
      description: 'An intimate 2-day celebration highlighted by Rajasthan Tourism gathering over 200 folk artists, Kalbelia dancers, and generational artisans without commercial commercialization.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/India_Bikaner_Junagarh_Fort.jpg/1280px-India_Bikaner_Junagarh_Fort.jpg',
      organizer: 'Momasar Community Guild & Jodhpur RIFF Partners',
    },
    {
      title: 'Kajli Teej Festival & Hadoti Procession',
      category: 'Cultural Festival',
      location: 'Naval Sagar & Garh Palace, Bundi',
      state: 'Rajasthan',
      startDate: new Date('2026-08-31'),
      endDate: new Date('2026-09-02'),
      description: 'A distinctive 15-day Bundi festival featuring an imperial palanquin procession of Goddess Teej through narrow cobblestone lanes, decorated elephants, and local sweet-making fairs.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Garh_Palace_and_Taragarh_Fort%2C_Bundi_2011-12-26_EK_II.jpg/1280px-Garh_Palace_and_Taragarh_Fort%2C_Bundi_2011-12-26_EK_II.jpg',
      organizer: 'District Administration Bundi',
    },
    {
      title: 'Marwar Festival at Osian Dunes',
      category: 'Folk Festival',
      location: 'Mehrangarh Fort & Osian Sand Dunes, Jodhpur',
      state: 'Rajasthan',
      startDate: new Date('2026-10-25'),
      endDate: new Date('2026-10-27'),
      description: 'Celebrated on the full moon of Sharad Purnima in honor of Marwar warriors. One night is traditionally held among the ancient temples and dunes of Osian with bards and folk dancers.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Osiyan1_photo_wiki.jpg',
      organizer: 'Department of Tourism Rajasthan & Marwar Heritage',
    },
    {
      title: 'Menar Jamra Beej & Winter Bird Gathering',
      category: 'Sacred Mela',
      location: 'Brahm Talab & Dhandh Lake, Menar, Udaipur',
      state: 'Rajasthan',
      startDate: new Date('2027-03-24'),
      endDate: new Date('2027-03-25'),
      description: 'A 400-year-old Mewar victory celebration where Menaria Brahmins don warrior costumes, perform Gair sword dances, and fire real gunpowder blunderbusses beside the bird sanctuary.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/White-tailedLapwingMenarUdaipur.jpg',
      organizer: 'Menar Village Bird Protection Panchayat',
    },
    {
      title: 'Kolayat Fair & Kapil Muni Deepdaan',
      category: 'Sacred Mela',
      location: 'Kolayat Sacred Lake (52 Ghats), Bikaner',
      state: 'Rajasthan',
      startDate: new Date('2026-11-23'),
      endDate: new Date('2026-11-25'),
      description: 'Huge spiritual congregation on Kartik Purnima where thousands of clay lamps (deepdaan) are floated across Kolayat’s 52 marble bathing ghats in honor of Vedic Sage Kapila.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kolayat_Lake_Kapil_Muni_Ghats.jpg/1280px-Kolayat_Lake_Kapil_Muni_Ghats.jpg',
      organizer: 'Kolayat Tirth Trust & Rajasthan Tourism',
    },
    {
      title: 'Kumbhalgarh Classical & Folk Festival',
      category: 'Cultural Festival',
      location: 'Kumbhalgarh Fort Amphitheater',
      state: 'Rajasthan',
      startDate: new Date('2026-12-01'),
      endDate: new Date('2026-12-03'),
      description: 'Stunning cultural extravaganza set against the illuminated 36-km Great Wall of Kumbhalgarh, showcasing classical Odissi, Kathak, Kalbelia, and traditional tug-of-war games.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kumbhalgarh_fort_wall.jpg/1280px-Kumbhalgarh_fort_wall.jpg',
      organizer: 'Rajasthan Tourism & West Zone Cultural Centre',
    },
    {
      title: 'Matsya Festival of Alwar',
      category: 'Cultural Festival',
      location: 'Moosi Maharani Chhatri & Siliserh Lake, Alwar',
      state: 'Rajasthan',
      startDate: new Date('2026-11-25'),
      endDate: new Date('2026-11-26'),
      description: 'Celebrates the 2,500-year-old heritage of the ancient Matsya kingdom with paddle boat regattas, traditional Shehnai recitals, archery competitions, and regional crafts.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Garbhaji_Waterfalls_Aravalli_Alwar.jpg/1280px-Garbhaji_Waterfalls_Aravalli_Alwar.jpg',
      organizer: 'District Administration Alwar',
    },
    {
      title: 'Abhaneri Festival at Chand Baori',
      category: 'Folk Festival',
      location: 'Chand Baori Stepwell, Abhaneri, Dausa',
      state: 'Rajasthan',
      startDate: new Date('2026-10-18'),
      endDate: new Date('2026-10-20'),
      description: 'Two-day festival held around the 3,500 illuminated stone steps of Chand Baori, featuring puppet theater, Langa-Manganiyar vocalists, and village pottery bazaars.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Chand_Baori_perspective_panorama_%28July_2022%29.jpg/1280px-Chand_Baori_perspective_panorama_%28July_2022%29.jpg',
      organizer: 'Rajasthan Tourism & Dausa District Administration',
    },
    {
      title: 'Pushkar Camel & Sacred Lake Fair',
      category: 'Sacred Mela',
      location: 'Pushkar Lake & Thar Dunes',
      state: 'Rajasthan',
      startDate: new Date('2026-11-15'),
      endDate: new Date('2026-11-23'),
      description: 'One of the world’s largest and oldest camel and livestock fairs combined with holy Kartik Purnima dip in the sacred waters of Lake Pushkar.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg/1280px-Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg',
      organizer: 'Rajasthan Tourism & Pushkar Purohit Guild',
    },
    {
      title: 'Jaisalmer Desert Festival (Maru Mahotsav)',
      category: 'Folk Festival',
      location: 'Sam & Khuri Sand Dunes, Jaisalmer',
      state: 'Rajasthan',
      startDate: new Date('2027-02-18'),
      endDate: new Date('2027-02-21'),
      description: 'A celebration of Thar desert folk music featuring Manganiyar singers, Ghoomar dancers, Kalbelia performers, and camel polo against golden sand dunes.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/1280px-Jaisalmer_forteresse.jpg',
      organizer: 'Department of Tourism Rajasthan',
    },
  ];

  for (const ev of eventsData) {
    await prisma.event.create({ data: ev });
  }

  // Seed Stories
  const storiesData = [
    {
      title: 'The Subterranean Water Engineers of the Thar Desert',
      author: 'Kunal Vaishnav & Hide Rajasthan Field Cell',
      state: 'Rajasthan',
      district: 'Bundi & Jodhpur',
      category: 'Water Architecture',
      summary: 'How ancient Rajasthani desert communities engineered stepwells and sand aquifers to survive centuries of extreme drought without modern plumbing.',
      content: 'In the hyper-arid geography of Rajasthan, water was not simply a resource; it was divinity. From Chand Baori in Abhaneri descending 13 subterranean storeys, to the communal stepwells of Bundi and Toorji Ka Jhalra in Jodhpur, Rajasthani architects developed hydraulic geometry that maximized rainwater harvesting while keeping the water sheltered from evaporation under punishing 48°C summer temperatures...',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Chand_Baori_perspective_panorama_%28July_2022%29.jpg/1280px-Chand_Baori_perspective_panorama_%28July_2022%29.jpg',
      tags: ['Stepwells', 'Baoris', 'Hydrology', 'Thar Desert'],
      readTimeMinutes: 5,
    },
    {
      title: 'The Vanishing Frescoes of Shekhawati: An Open-Air Gallery Under Threat',
      author: 'Hide Rajasthan Oral Heritage Archive',
      state: 'Rajasthan',
      district: 'Shekhawati',
      category: 'Folk Art',
      summary: 'Exploring the 700+ hand-painted havelis of Mandawa, Nawalgarh, and Fatehpur, and the urgent race to preserve their natural mineral pigments.',
      content: 'Between the 18th and early 20th centuries, wealthy Marwari merchants returning from Bombay and Calcutta channeled their fortunes into building painted palatial havelis in the semi-arid towns of Shekhawati. Local artisans used fresco buono techniques with natural lime plaster, mineral dyes, and gold foil to illustrate everything from Indian epics to the first steam locomotives and gramophones...',
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Haveli_mandawa.jpg',
      tags: ['Shekhawati', 'Fresco Buono', 'Havelis', 'Mandawa'],
      readTimeMinutes: 6,
    }
  ];

  for (const st of storiesData) {
    await prisma.story.create({ data: st });
  }

  console.log(`🎉 Successfully seeded ${rajasthanFallbackPlaces.length} destinations, ${eventsData.length} events, and ${storiesData.length} stories!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
