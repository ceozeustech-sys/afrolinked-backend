import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

export const authenticate = async (req: Request, res: Response, next: 
NextFunction) => {
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

  return res.status(401).json({ error: "Authentication required" });
};
