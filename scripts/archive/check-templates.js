const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const templates = await prisma.template.findMany();
    console.log('TEMPLATES IN DB:', templates.map(t => ({ id: t.id, slug: t.slug, name: t.name })));
  } catch (err) {
    console.error('Error fetching templates:', err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
