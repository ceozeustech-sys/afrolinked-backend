import { Request, Response, NextFunction } from 'express';

export const internalAuth = (req: Request, res: Response, next: NextFunction) => {
  // In production, INTERNAL_API_KEY is required
  // In local dev, allow if not set (for testing public routes)
  const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

  if (INTERNAL_API_KEY === undefined) {
    // Only in local dev: skip auth (but log warning)
    console.warn("⚠️  INTERNAL_API_KEY not set — skipping internal auth (local dev only)");
    return next();
  }

  const key = req.headers['x-internal-api-key'];

  if (!key || typeof key !== 'string' || key !== INTERNAL_API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid or missing internal API key" });
  }

  next();
};
