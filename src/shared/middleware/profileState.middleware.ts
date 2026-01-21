import { Request, Response, NextFunction } from 'express';
import { prisma } from '../shared/prisma';
import { ProfileState } from '@prisma/client';

/**
 * Block access if profile is suspended or under_review.
 */
export const blockIfSuspendedOrUnderReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profileState: true }
  });

  if (!user || ['suspended', 'under_review'].includes(user.profileState)) {
    return res.status(403).json({ 
      error: 'Profile inactive or under review' 
    });
  }

  next();
};

/**
 * Require verified state for discovery-sensitive actions.
 */
export const requireVerifiedProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profileState: true }
  });

  if (!user || user.profileState !== 'verified') {
    return res.status(403).json({ 
      error: 'Profile must be verified' 
    });
  }

  next();
};

/**
 * Allow profile edits only in draft or pending states.
 */
export const allowEditOnlyDraftOrPending = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profileState: true }
  });

  if (!user || !['draft', 'pending'].includes(user.profileState)) {
    return res.status(403).json({ 
      error: 'Profile edits only allowed in draft or pending state' 
    });
  }

  next();
};
