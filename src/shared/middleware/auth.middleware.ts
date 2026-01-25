import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

// In real production, this would extract user ID from JWT/session
// For now, we simulate a verified user ONLY for search endpoint during 
final validation
// This will be replaced when frontend sends real auth tokens

export const authenticate = async (req: Request, res: Response, next: 
NextFunction) => {
  // TEMPORARY: Only for final validation of access control
  if (req.path === '/api/search/users') {
    const user = await prisma.user.findFirst({
      where: { profileState: 'verified' },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: "No verified user available" 
});
    }

    (req as any).user = user;
    return next();
  }

  // For all other routes, reject (since no real auth exists yet)
  return res.status(401).json({ error: "Authentication required" });
};
