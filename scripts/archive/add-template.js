const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
  await prisma.template.upsert({
    where: { slug: 'heavenly-roses' },
    update: {
      name: 'Heavenly Roses',
      description: 'A beautiful floral background with pink roses bordering a cloudy sky.',
      thumbnail: '/assets/templates/heavenly-roses-bg.jpg',
    },
    create: {
      name: 'Heavenly Roses',
      slug: 'heavenly-roses',
      description: 'A beautiful floral background with pink roses bordering a cloudy sky.',
      thumbnail: '/assets/templates/heavenly-roses-bg.jpg',
      isActive: true,
      sortOrder: 1,
    }
  });
  console.log('Template inserted!');
  
  // Assign it to the current active invitation so the user can see it right away!
  const inv = await prisma.invitation.findFirst();
  if (inv) {
    const t = await prisma.template.findUnique({ where: { slug: 'heavenly-roses' }});
    await prisma.invitation.update({
      where: { id: inv.id },
      data: { templateId: t.id }
    });
    console.log('Assigned to invitation:', inv.id);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
