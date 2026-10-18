const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.invitation.findFirst().then(inv => {
  console.log(inv);
}).catch(e => console.error(e)).finally(() => prisma.$disconnect());
