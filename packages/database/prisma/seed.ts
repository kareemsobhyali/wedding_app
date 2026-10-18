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
    { name: 'Butterfly Elegance 🦋', slug: 'butterfly-elegance', description: 'تصميم ملكي بمظروف ينفتح وفراشة ثلاثية الأبعاد تطير بنعومة.', sortOrder: 1 },
    { name: 'Heavenly Roses 🌹', slug: 'heavenly-roses', description: 'ورود زهرية ناعمة مع تفاصيل زجاجية فاخرة وجدول الفعاليات.', sortOrder: 2 },
    { name: 'Golden Arabic ⚜️', slug: 'golden-arabic', description: 'طابع عربي أصيل ببريق الذهب وقصتنا ومحطات الحب والزفاف.', sortOrder: 3 },
    { name: 'Classic Elegance ✨', slug: 'classic-elegance', description: 'أناقة كلاسيكية فاخرة بالأسود والذهب الملكي والقصاصات الاحتفالية.', sortOrder: 4 },
    { name: 'Modern Minimalist 🖤', slug: 'modern-minimalist', description: 'تصميم عصري بسيط بخطوط جريئة وتناغم هادئ.', sortOrder: 5 },
    { name: 'Floral Romance 🌸', slug: 'floral-romance', description: 'درجات الوردي الباستيل الرقيقة مع بتلات متساقطة وقصة التعارف.', sortOrder: 6 },
    { name: 'Botanical Rustic 🌿', slug: 'botanical-rustic', description: 'طابع الورق الطبيعي المعتق وأغصان الزيتون وختم الشمع الأحمر.', sortOrder: 7 },
    { name: 'Royal Velvet 🎀', slug: 'royal-velvet', description: 'مخمل ملكي زمردي فاخر مع شريط ساتان ذهبي ينفك بنعومة ومونوغرام مذهب.', sortOrder: 8 },
    { name: 'Grand Palace Gates 🏰', slug: 'palace-gates', description: 'بوابات قصر ذهبية ثلاثية الأبعاد تنفتح لتكشف عن قاعة ملكية ساحرة.', sortOrder: 9 },
    { name: 'Celestial Stardust 🌌', slug: 'celestial-stardust', description: 'سماء النجوم والفلك الليلي مع هلال ذهبي متوهج وأبراج فلكية.', sortOrder: 10 },
    { name: 'Pearl & Jasmine Box 🦪', slug: 'pearl-box', description: 'صندوق دعوة أبيض لؤلؤي مبطن بالحرير العاجي وأزهار الياسمين وعقدة لؤلؤ.', sortOrder: 11 },
  ];

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
