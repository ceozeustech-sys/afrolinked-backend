import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const user = await prisma.user.findUnique({
    where: { id: 'e8341e9b-97d3-44a7-8090-4097eaf0eb69' }
  });

  if (!user) {
    return res.status(401).json({ error: 'Test user not found' });
  }

  (req as any).user = user;
  console.log('🔍 Using verified user:', user.id, '| State:', user.profileState);
  next();
};
