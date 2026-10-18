const fs = require('fs');
const file = 'apps/api/src/invitations/admin-invitations.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "customerPhone: data.customerPhone || '',",
  "customerPhone: data.customerPhone || '',\n          venueName: '',"
);

fs.writeFileSync(file, code);
console.log('Fixed venueName required');
