const fs = require('fs');
const servicePath = 'apps/api/src/invitations/admin-invitations.service.ts';
let svcCode = fs.readFileSync(servicePath, 'utf8');

const methodCode = `
  async createQuick(adminId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      // Find a default template
      const defaultTemplate = await tx.template.findFirst({ where: { status: 'ACTIVE' } });
      if (!defaultTemplate) throw new Error('No active templates found');

      const created = await tx.invitation.create({
        data: {
          groomName: data.groomName || 'Groom',
          brideName: data.brideName || 'Bride',
          customerPhone: data.customerPhone || '',
          weddingDate: data.weddingDate ? new Date(data.weddingDate) : null,
          status: 'DRAFT',
          templateId: defaultTemplate.id,
          version: 1
        }
      });
      
      const slugStr = \`\${(data.groomName || 'g').substring(0,10)}-\${(data.brideName || 'b').substring(0,10)}-\${Math.random().toString(36).substring(2,6)}\`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      await tx.invitationSlug.create({
        data: { invitationId: created.id, slug: slugStr, isCurrent: true }
      });

      await tx.auditLog.create({
        data: { action: 'INVITATION_CREATED_QUICK', adminUserId: adminId, entityType: 'INVITATION', entityId: created.id, metadata: {} }
      });

      return created;
    });
  }
`;

if (!svcCode.includes('async createQuick(')) {
  svcCode = svcCode.replace(
    /async updateInvitation\(id: string,\s*adminId: string,\s*version: number,\s*data: any\)\s*\{/,
    methodCode + '\n  async updateInvitation(id: string, adminId: string, version: number, data: any) {'
  );
  fs.writeFileSync(servicePath, svcCode);
  console.log('Fixed service');
} else {
  console.log('Already fixed?');
}
