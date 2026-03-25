const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Admin User
  const admin = await prisma.user.upsert({
    where: { studentId: 'admin' },
    update: {},
    create: {
      studentId: 'admin',
      name: 'Super Admin',
      email: 'admin@votewise.edu',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Student User
  const student = await prisma.user.upsert({
    where: { studentId: '20230001' },
    update: {},
    create: {
      studentId: '20230001',
      name: 'John Doe',
      email: 'john@student.edu',
      password: hashedPassword, // Same password for testing
      role: 'voter',
    },
  });

  // Election
  const election = await prisma.election.create({
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

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
