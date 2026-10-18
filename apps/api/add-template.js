const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const template = await prisma.template.upsert({
    where: { slug: 'golden-arabic' },
    update: {},
    create: {
      slug: 'golden-arabic',
      name: 'Golden Arabic',
      description: 'A luxurious Arabic invitation with gold shimmering effects.',
      isActive: true,
    },
  });
  console.log('Template ensured:', template);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
