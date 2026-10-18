const { PrismaClient } = require('./node_modules/@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function run() {
  const admin = await prisma.adminUser.findFirst();
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  await prisma.adminSession.create({
    data: {
      adminUserId: admin.id,
      tokenHash,
      expiresAt,
    }
  });
  
  const id = '5ebf372e-6cc1-49d2-aa5a-3cee6a648f80'; // The invitation ID we fetched earlier
  const res = await fetch(`http://localhost:4000/api/v1/admin/invitations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `admin_session=${rawToken}`
    },
    body: JSON.stringify({
      version: 1,
      caption: 'TEST UPDATE',
      groomName: 'Karim Edited'
    })
  });
  
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Data:', data);
  
  const updated = await prisma.invitation.findUnique({ where: { id }});
  console.log('Updated DB version:', updated.version, 'Caption:', updated.caption);
}

run().catch(console.error).finally(() => prisma.$disconnect());
