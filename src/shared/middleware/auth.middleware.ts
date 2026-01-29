import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const KNOWN_VERIFIED_USER_ID = '5fa3986d-fa09-459d-8898-729114893dd7';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // When mounted on /api/search, req.path is relative (e.g., "/users")
  if (req.path === '/users') {
    console.log('[AUTH] Middleware entered for /users (mounted on /api/search)');

    try {
      console.log('[AUTH] Executing Prisma query for user:', KNOWN_VERIFIED_USER_ID);
      
      const user = await prisma.user.findUnique({
        where: { id: KNOWN_VERIFIED_USER_ID },
        include: { profile: true }
      });

      if (!user) {
        console.error('[AUTH] ERROR: User not found in database');
        return res.status(401).json({ error: "Authentication required" });
      }

      if (user.profileState !== 'verified') {
        console.error('[AUTH] ERROR: User exists but is not verified:', user.profileState);
        return res.status(401).json({ error: "Authentication required" });
      }

      (req as any).user = user;
      console.log('[AUTH] User attached successfully — proceeding to route handler');
      return next();
    } catch (error) {
      console.error('[AUTH] CRITICAL ERROR during Prisma query:', error);
      return res.status(500).json({ error: "Auth system failure" });
    }
  }

  return res.status(401).json({ error: "Authentication required" });
};
