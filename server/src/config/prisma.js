const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper to auto-seed admin user and default election if DB is empty
let isSeeded = false;
async function ensureAdminExists() {
  if (isSeeded) return;
  try {
    const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!admin) {
      console.log('Admin user missing in Supabase DB, seeding default admin...');
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
    console.error('Error auto-seeding admin:', err.message);
  }
}

ensureAdminExists();

module.exports = prisma;
