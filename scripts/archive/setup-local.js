const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🚀 Starting Automatic Setup for Wedding SaaS...");

// 1. Create .env files automatically
const dbDir = path.join(__dirname, 'packages', 'database');
const apiDir = path.join(__dirname, 'apps', 'api');
const webDir = path.join(__dirname, 'apps', 'web');

const dbEnvPath = path.join(dbDir, '.env');
const apiEnvPath = path.join(apiDir, '.env');
const webEnvPath = path.join(webDir, '.env.local');

const dbUrl = 'DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/wedding_db?schema=public"';
const apiEnvContent = `${dbUrl}
JWT_SECRET="local_test_secret_12345"
CORS_ORIGIN="http://localhost:3000"
PORT=4000
R2_ACCOUNT_ID="dummy_account_id"
R2_ACCESS_KEY_ID="dummy_access_key"
R2_SECRET_ACCESS_KEY="dummy_secret_key"
R2_BUCKET_NAME="dummy_bucket"
R2_PUBLIC_URL="https://dummy.com"`;
const webEnvContent = `NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"`;

fs.writeFileSync(dbEnvPath, dbUrl);
fs.writeFileSync(apiEnvPath, apiEnvContent);
fs.writeFileSync(webEnvPath, webEnvContent);
console.log("✅ Environment files created with exact settings.");

// 2. Docker
console.log("🐳 Restarting Docker Container (Port 5433)...");
try {
  // Ensure docker-compose.yml uses 5433
  const dockerComposePath = path.join(__dirname, 'docker-compose.yml');
  let composeContent = fs.readFileSync(dockerComposePath, 'utf8');
  composeContent = composeContent.replace(/"5432:5432"/g, '"5433:5432"');
  fs.writeFileSync(dockerComposePath, composeContent);

  execSync('docker-compose down -v', { stdio: 'inherit' });
  execSync('docker-compose up -d', { stdio: 'inherit' });
} catch(e) {
  console.log("❌ Docker is not running! Please open Docker Desktop first.");
  process.exit(1);
}

// wait for db to boot
console.log("⏳ Waiting 5 seconds for PostgreSQL to boot...");
execSync('node -e "setTimeout(() => {}, 5000)"');

// 3. Prisma
console.log("🗄️ Pushing database schema...");
try {
  execSync('npm run db:push', { stdio: 'inherit' });
  
  console.log("🌱 Seeding database with templates...");
  execSync('npm run generate --workspace=database', { stdio: 'inherit' });
  execSync('npx prisma db seed', { stdio: 'inherit', cwd: dbDir });
  
  console.log("🎉 Setup Complete! You can now run 'npm run dev' to start the project!");
} catch (error) {
  console.log("❌ Something went wrong while connecting to the database. Ensure Docker is running.");
}
