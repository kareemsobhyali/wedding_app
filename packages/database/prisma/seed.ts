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
  const templatesData = [
    { name: 'Palace Doors Reveal 🚪✨', slug: 'palace-doors-reveal', description: 'بوابة القصر الملكي التفاعلية: دق على الباب 3 مرات لتفتح الأبواب بمؤثرات صوتية وضوئية وتكشف قاعة الحفل وبطاقة الزفاف الفاخرة.', sortOrder: 1 },
    { name: 'Mughal Palace Portal 🕌', slug: 'mughal-palace-portal', description: 'بوابة القصر الملكية بأقواس الحجر المنحوتة وأعمدة الرخام المذهبة وشلال الزهور المتدلية مع تساقط البتلات.', sortOrder: 2 },
    { name: 'Cathedral Grand Arch ⛪', slug: 'cathedral-grand-arch', description: 'تصميم ملكي فاخر، ثريات كريستال معلقة وفوانيس بلهب شموع متحرك واقعي وبطاقات مراسم الحفل.', sortOrder: 3 },
    { name: 'Sculpted Porcelain Arch 🏛️', slug: 'sculpted-porcelain-arch', description: 'إطار البورسلين المنحوت 3D والورود البيضاء واللؤلؤ مع تفاصيل العائلات وجدول المواعيد المذهب.', sortOrder: 4 },
    { name: 'Butterfly Elegance 🦋', slug: 'butterfly-elegance', description: 'تصميم ملكي فاخر بمظروف ينفتح وفراشة ثلاثية الأبعاد تطير بنعومة وأناقة.', sortOrder: 5 },
    { name: 'Golden Arabic ⚜️', slug: 'golden-arabic', description: 'طابع عربي أصيل ببريق الذهب وقصص اللقاء والخطوبة والزفاف.', sortOrder: 6 },
  ];

  // Remove deleted templates from database
  await prisma.template.deleteMany({
    where: {
      slug: {
        notIn: templatesData.map(t => t.slug)
      }
    }
  });

  for (const t of templatesData) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description, sortOrder: t.sortOrder },
      create: {
        name: t.name,
        slug: t.slug,
        description: t.description,
        sortOrder: t.sortOrder,
        config: { sections: ['envelope', 'hero', 'timeline', 'venue', 'rsvp'] }
      }
    });
  }
  const template1 = await prisma.template.findUnique({ where: { slug: 'butterfly-elegance' } });
  console.log('All 11 Templates seeded successfully');

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
