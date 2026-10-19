import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Production Admin Provisioning...');

  const email = (process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || 'admin@wedding.com').trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || 'admin123456').trim();

  if (!email || !password) {
    console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.');
    process.exit(1);
  }

  const passwordHash = await argon2.hash(password);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    await prisma.adminUser.update({
      where: { id: existingAdmin.id },
      data: { passwordHash, isActive: true },
    });
    console.log(`Admin ${email} password updated successfully.`);
    process.exit(0);
  }

  const adminUser = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      name: 'Initial System Admin',
    },
  });

  console.log(`Successfully provisioned admin: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
