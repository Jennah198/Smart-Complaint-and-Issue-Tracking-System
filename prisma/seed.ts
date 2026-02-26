import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

import { PrismaService } from '../src/prisma/prisma.service';

const prisma: PrismaClient = new PrismaService();

async function main() {
  // Hash passwords (for local dev/testing)
  const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
  const hashedStaffPassword = await bcrypt.hash('Staff123!', 10);

  // Upsert Admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedAdminPassword,
      role: Role.ADMIN,
      name: 'Admin User',
    },
  });

  // Upsert Staff user
  await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      email: 'staff@example.com',
      password: hashedStaffPassword,
      role: Role.STAFF,
      name: 'Staff User',
    },
  });

  console.log('✅ Admin and Staff users seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
