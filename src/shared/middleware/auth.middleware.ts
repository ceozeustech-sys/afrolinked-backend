import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

// TEMPORARY: Hardcode the verified test user ID created in production
const TEMP_SEEDED_USER_ID = '5fa3986d-fa09-459d-8898-729114893dd7';

export const authenticate = async (req: Request, res: Response, next: 
NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: TEMP_SEEDED_USER_ID },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: "Test user not found" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};
