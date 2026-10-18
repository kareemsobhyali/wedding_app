const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const inv = await prisma.invitation.findFirst();
  console.log('Version is', inv.version);
  try {
    const res = await prisma.invitation.update({
      where: { id: inv.id, version: inv.version },
      data: { version: { increment: 1 } }
    });
    console.log('Success:', res.version);
  } catch (e) {
    console.log('Error:', e.message);
  }
}
run().finally(() => prisma.$disconnect());
