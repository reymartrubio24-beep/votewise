const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';

if (isVercel) {
  const tmpDbPath = path.join('/tmp', 'dev.db');
  
  // Look for bundled dev.db created during build
  const possiblePaths = [
    path.resolve(process.cwd(), 'dev.db'),
    path.resolve(process.cwd(), 'server/prisma/dev.db'),
    path.resolve(__dirname, '../../prisma/dev.db'),
    path.resolve(__dirname, '../prisma/dev.db'),
  ];

  let foundDb = null;
  for (const dbP of possiblePaths) {
    if (fs.existsSync(dbP) && fs.statSync(dbP).size > 0) {
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

// Helper to auto-seed admin if missing
let isSeeded = false;
async function ensureAdminExists() {
  if (isSeeded) return;
  try {
    const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!admin) {
      console.log('Admin user missing in DB, seeding default admin...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.user.create({
        data: {
          studentId: 'admin',
          name: 'Super Admin',
          email: 'admin@votewise.edu',
          password: hashedPassword,
          role: 'admin',
        }
      });

      await prisma.user.create({
        data: {
          studentId: '20230001',
          name: 'John Doe',
          email: 'john@student.edu',
          password: hashedPassword,
          role: 'voter',
        }
      });

      const existingElection = await prisma.election.findFirst();
      if (!existingElection) {
        await prisma.election.create({
          data: {
            title: 'Student Government Council 2026',
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'active',
            positions: {
              create: [
                {
                  title: 'President',
                  candidates: {
                    create: [
                      { name: 'Alice Smith', party: 'Integrity Party', platform: 'Building the future.' },
                      { name: 'Bob Johnson', party: 'Progressive Party', platform: 'Empowering students.' }
                    ]
                  }
                },
                {
                  title: 'Vice President',
                  candidates: {
                    create: [
                      { name: 'Charlie Brown', party: 'Integrity Party', platform: 'Service first.' },
                      { name: 'Diana Prince', party: 'Progressive Party', platform: 'Truth and justice.' }
                    ]
                  }
                }
              ]
            }
          }
        });
      }
      console.log('Auto-seeded default admin and election data successfully!');
    }
    isSeeded = true;
  } catch (err) {
    console.error('Error auto-seeding admin:', err);
  }
}

// Call ensureAdminExists on startup
ensureAdminExists();

module.exports = prisma;
