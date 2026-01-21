import { Request, Response, NextFunction } from 'express';

/**
 * INTERNAL ONLY — Simulates a trusted service account.
 * DO NOT expose to public endpoints.
 */
export const internalAuth = (req: Request, res: Response, next: NextFunction) => {
  (req as any).internal = { role: "TRUST_ENGINE" };
  next();
};
