const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Handle SQLite database in Vercel serverless environment (/tmp directory)
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';

if (isVercel) {
  const tmpDbPath = path.join('/tmp', 'dev.db');
  
  // Look for bundled dev.db created during build
  const possiblePaths = [
    path.resolve(process.cwd(), 'server/prisma/dev.db'),
    path.resolve(__dirname, '../../prisma/dev.db'),
    path.resolve(__dirname, '../prisma/dev.db'),
  ];

  let foundDb = null;
  for (const dbP of possiblePaths) {
    if (fs.existsSync(dbP)) {
      foundDb = dbP;
      break;
    }
  }

  if (foundDb && (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0)) {
    try {
      fs.copyFileSync(foundDb, tmpDbPath);
      console.log(`Successfully copied SQLite DB from ${foundDb} to ${tmpDbPath}`);
    } catch (err) {
      console.error('Error copying DB to /tmp:', err);
    }
  }

  process.env.DATABASE_URL = `file:${tmpDbPath}`;
} else if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const prisma = new PrismaClient();

module.exports = prisma;
