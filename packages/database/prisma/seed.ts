import { PrismaClient, InvitationStatus, MediaType, MediaRole, AnalyticsEventType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: Development seed script cannot be run in production.');
    process.exit(1);
  }

  console.log('Starting development seed...');

  const password = process.env.SEED_ADMIN_PASSWORD || 'admin_password123';
  const passwordHash = await argon2.hash(password);

  // 1. Admin User
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@wedding.com' },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL || 'admin@wedding.com',
      passwordHash: passwordHash,
      name: 'System Admin',
    },
  });
  console.log(`Admin User created: ${adminUser.email}`);

  // 2. Templates
  const template1 = await prisma.template.upsert({
    where: { slug: 'classic-elegance' },
    update: {},
    create: {
      name: 'Classic Elegance',
      slug: 'classic-elegance',
      description: 'A traditional and elegant template for classic weddings.',
      sortOrder: 1,
      config: { colors: ['#ffffff', '#000000'], sections: ['cover', 'story', 'gallery', 'rsvp'] },
    },
  });

  const template2 = await prisma.template.upsert({
    where: { slug: 'modern-minimalist' },
    update: {},
    create: {
      name: 'Modern Minimalist',
      slug: 'modern-minimalist',
      description: 'Clean lines and lots of whitespace for a modern look.',
      sortOrder: 2,
      config: { colors: ['#f4f4f5', '#18181b'], sections: ['cover', 'gallery'] },
    },
  });

  const template3 = await prisma.template.upsert({
    where: { slug: 'floral-romance' },
    update: {},
    create: {
      name: 'Floral Romance',
      slug: 'floral-romance',
      description: 'Beautiful floral patterns and soft colors.',
      sortOrder: 3,
      config: { colors: ['#fce7f3', '#831843'], sections: ['cover', 'details', 'gallery'] },
    },
  });
  console.log('Templates created');

  // 3. App Settings
  await prisma.appSetting.upsert({
    where: { key: 'site_name' },
    update: {},
    create: {
      key: 'site_name',
      value: 'Wedding SaaS Platform',
      type: 'STRING',
    },
  });

  // 4. Sample Invitation
  // We'll create one sample invitation that is active.
  const existingInv = await prisma.invitation.findFirst({
    where: { customerPhone: '+201012345678' }
  });

  if (!existingInv) {
    const invitation = await prisma.invitation.create({
      data: {
        groomName: 'Karim',
        brideName: 'Fatma',
        customerPhone: '+201012345678',
        weddingDate: new Date('2027-10-15T18:00:00Z'),
        venueName: 'Grand Nile Tower',
        venueAddress: 'Corniche El Nil, Cairo',
        status: InvitationStatus.ACTIVE,
        templateId: template1.id,
        activatedAt: new Date(),
        slugs: {
          create: {
            slug: 'karim-fatma',
            isCurrent: true
          }
        },
        media: {
          create: [
            {
              type: MediaType.IMAGE,
              role: MediaRole.COVER,
              storageKey: 'sample/karim-fatma-cover.jpg',
              originalFilename: 'cover.jpg',
              isCurrent: true,
            }
          ]
        }
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'INVITATION_ACTIVATED',
        entityType: 'Invitation',
        entityId: invitation.id,
        adminUserId: adminUser.id,
      }
    });
    
    console.log(`Invitation created: ${invitation.id}`);
  } else {
    console.log('Sample invitation already exists.');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
