import { Request, Response } from 'express';
import { prisma } from '../shared/prisma';

// Temporary endpoint to ensure a verified user exists
export const seedVerifiedUser = async (req: Request, res: Response) => {
  const userId = '5fa3986d-fa09-459d-8898-729114893dd7';
  
  // Upsert user
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: { profileState: 'verified' },
    create: {
      id: userId,
      email: 'test@afrolinked.com',
      profileState: 'verified',
      profile: {
        create: {
          firstName: 'Test',
          lastName: 'User',
          bio: 'Verified test user for production validation',
          location: 'Cape Town',
          profession: 'Developer'
        }
      }
    },
    include: { profile: true }
  });

  res.json({ message: 'Verified user ensured', user: { id: user.id, state: user.profileState } });
};
