import { Router } from 'express';
import { authenticate } from '../shared/middleware/auth.middleware';
import { submitProfileForVerification } from './profile.service';
import { blockSuspendedOrUnderReview, allowProfileEdit } from '../shared/middleware/profileAccess.middleware';
import { prisma } from '../shared/prisma';

const router = Router();

router.get('/me', authenticate, blockSuspendedOrUnderReview, async (req, res) => {
  const userId = (req as any).user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  });
  res.json(user);
});

router.put('/edit', authenticate, allowProfileEdit, async (req, res) => {
  res.json({ message: 'Profile edit allowed' });
});

router.post('/submit', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    await submitProfileForVerification(userId);
    res.json({ message: 'Profile submitted for verification' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
