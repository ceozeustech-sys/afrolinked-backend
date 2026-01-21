import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

export const requireVerifiedProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || user.profileState !== 'verified') {
    return res.status(403).json({ error: 'Access denied: profile must be verified' });
  }

  next();
};

export const blockSuspendedOrUnderReview = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || user.profileState === 'suspended' || user.profileState === 'under_review') {
    return res.status(403).json({ error: 'Access denied: profile is suspended or under review' });
  }

  next();
};

export const allowProfileEdit = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || (user.profileState !== 'draft' && user.profileState !== 'pending')) {
    return res.status(403).json({ error: 'Profile edits only allowed in draft or pending state' });
  }

  next();
};
