const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const existing = await prisma.template.findUnique({
      where: { slug: 'butterfly-elegance' }
    });

    if (!existing) {
      const created = await prisma.template.create({
        data: {
          name: 'Butterfly Elegance',
          slug: 'butterfly-elegance',
          description: 'An envelope with a soft reveal and fluttering butterfly. Minimal yet luxurious.',
          sortOrder: 7,
          config: {
            colors: ['#FDFBF7', '#D4AF37', '#7D6E63'],
            sections: ['envelope', 'hero', 'verse', 'countdown', 'timeline', 'venue', 'rsvp']
          }
        }
      });
      console.log('Created template:', created);
    } else {
      console.log('Template already exists:', existing);
    }
  } catch (err) {
    console.error('Error seeding template:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
