const fs = require('fs');
const file = 'apps/api/src/invitations/admin-invitations.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const defaultTemplate = await tx.template.findFirst({ where: { status: 'ACTIVE' } });",
  "const defaultTemplate = await tx.template.findFirst();"
);

code = code.replace(
  "templateId: defaultTemplate.id,",
  "template: { connect: { id: defaultTemplate.id } },"
);

fs.writeFileSync(file, code);
console.log('Fixed createQuick types');
