
const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.invitation.findUnique({ where: { id: 'undefined' } }).then(console.log).catch(e => console.error(e.message)).finally(() => prisma.$disconnect());

