const { execSync } = require('child_process');
const path = require('path');

console.log('==============================================');
console.log('🚀 Running Automatic Database Synchronization');
console.log('==============================================');

const schemaPath = path.resolve(__dirname, '../../packages/database/prisma/schema.prisma');

// 1. Generate Prisma Client
try {
  console.log('📦 Generating Prisma Client...');
  execSync(`npx prisma generate --schema="${schemaPath}"`, { stdio: 'inherit' });
} catch (e) {
  console.warn('⚠️ Prisma generate warning:', e.message);
}

// 2. If DATABASE_URL is configured, push schema to create all tables
const dbUrl = process.env.DATABASE_URL;

if (dbUrl && !dbUrl.includes('localhost:5432')) {
  try {
    console.log('🗄️ DATABASE_URL detected! Syncing database tables...');
    execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, { 
      stdio: 'inherit',
      timeout: 30000 
    });
    console.log('✅ Database tables created and synchronized successfully!');
  } catch (err) {
    console.error('⚠️ Database sync warning (will continue startup):', err.message);
  }
} else if (dbUrl) {
  try {
    console.log('🗄️ Local DATABASE_URL detected, attempting sync...');
    execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, { 
      stdio: 'inherit',
      timeout: 10000 
    });
    console.log('✅ Local database synchronized!');
  } catch (e) {
    console.log('ℹ️ Local database offline, skipping sync.');
  }
} else {
  console.log('ℹ️ No DATABASE_URL found, skipping table sync.');
}

console.log('==============================================');
