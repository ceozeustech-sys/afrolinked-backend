import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find the user by phone
  const user = await prisma.user.findUnique({
    where: { phone: '+27796288382' }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  // Update to verified
  await prisma.user.update({
    where: { id: user.id },
    data: { profileState: 'verified' }
  });

  console.log('✅ User approved to verified:', user.id);
}

main().catch(console.error);
