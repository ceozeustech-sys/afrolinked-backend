import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.create({
    data: {
      phone: '+27000000000',
      verificationTier: 'basic',
      profileState: 'draft'
    }
  });
  await prisma.profile.create({
     {
      userId: user.id
    }
  });
  console.log('✅ Test user created:', user.id);
}
main().finally(() => prisma.$disconnect());
