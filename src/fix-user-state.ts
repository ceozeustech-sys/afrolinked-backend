import { prisma } from './shared/prisma';

async function fixUser() {
  const userId = 'e8341e9b-97d3-44a7-8090-4097eaf0eb69';

  await prisma.user.update({
    where: { id: userId },
    data: { profileState: 'verified' }
  });

  console.log('User state successfully forced to VERIFIED');
  process.exit(0);
}

fixUser().catch(function (e) {
  console.error(e);
  process.exit(1);
});
