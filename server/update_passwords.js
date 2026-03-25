const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const prisma = new PrismaClient();

async function updatePasswords() {
  const csvPath = path.join(__dirname, 'voters_list_50.csv');
  const results = [];

  console.log('Reading CSV...');
  
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Found ${results.length} voters. Updating passwords...`);
      let count = 0;
      
      for (const row of results) {
        const sid = row.studentId;
        if (!sid) continue;

        try {
          const hashedPassword = await bcrypt.hash(String(sid), 10);
          await prisma.user.upsert({
            where: { studentId: String(sid) },
            update: { password: hashedPassword },
            create: {
              studentId: String(sid),
              name: row.name || 'Unknown',
              email: row.email || `${sid}@student.edu`,
              password: hashedPassword,
              role: 'voter'
            }
          });
          count++;
        } catch (err) {
          console.error(`Failed to update ${sid}: ${err.message}`);
        }
      }
      
      console.log(`Successfully updated ${count} voters!`);
      await prisma.$disconnect();
    });
}

updatePasswords();
