const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Evilakkerman', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'Evilakkerman@Evilakkerman' },
    update: {},
    create: {
      email: 'Evilakkerman@Evilakkerman',
      name: 'Admin',
      phoneNumber: '0000000000',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  console.log('Seed completed:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
