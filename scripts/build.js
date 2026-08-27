const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables from server/.env if available
const envPath = path.resolve(__dirname, '../server/.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Fallback Supabase credentials if env variable is not set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres.tdlyzirjezvvipbqurri:Z2y8qVSmajjckW3o@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = "postgresql://postgres.tdlyzirjezvvipbqurri:Z2y8qVSmajjckW3o@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres";
}

try {
  console.log('1/3 Pushing Prisma schema to Supabase...');
  execSync('npx prisma db push --accept-data-loss --schema=./server/prisma/schema.prisma', {
    stdio: 'inherit',
    env: process.env
  });

  console.log('2/3 Seeding database tables...');
  execSync('node server/prisma/seed.js', {
    stdio: 'inherit',
    env: process.env
  });

  console.log('3/3 Building Vite React frontend...');
  execSync('npm run build --workspace=client', {
    stdio: 'inherit',
    env: process.env
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build step failed:', error.message);
  process.exit(1);
}
