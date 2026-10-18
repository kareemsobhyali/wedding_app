const fs = require('fs');

const servicePath = 'apps/api/src/invitations/admin-invitations.service.ts';
let svcCode = fs.readFileSync(servicePath, 'utf8');

if (!svcCode.includes('async createQuick(')) {
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

  svcCode = svcCode.replace(
    'async updateInvitation(id: string, adminId: string, currentVersion: number, updateData: any) {',
    methodCode + '\n  async updateInvitation(id: string, adminId: string, currentVersion: number, updateData: any) {'
  );
  fs.writeFileSync(servicePath, svcCode);
  console.log('Service updated');
}

const ctrlPath = 'apps/api/src/invitations/invitations.controller.ts';
let ctrlCode = fs.readFileSync(ctrlPath, 'utf8');

if (!ctrlCode.includes('@Post()')) {
  ctrlCode = ctrlCode.replace(
    "@Patch(':id')\n  async updateInvitation(",
    `@Post()\n  async createQuick(@Body() body: any, @Request() req: any) {\n    return this.svc.createQuick(req.user.id, body);\n  }\n\n  @Patch(':id')\n  async updateInvitation(`
  );
  
  // also check \r\n
  ctrlCode = ctrlCode.replace(
    "@Patch(':id')\r\n  async updateInvitation(",
    `@Post()\n  async createQuick(@Body() body: any, @Request() req: any) {\n    return this.svc.createQuick(req.user.id, body);\n  }\n\n  @Patch(':id')\n  async updateInvitation(`
  );
  fs.writeFileSync(ctrlPath, ctrlCode);
  console.log('Controller updated');
}
