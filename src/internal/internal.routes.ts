import { Router } from 'express';
import { internalAuth } from '../shared/middleware/internalAuth.middleware';
import { approveProfile, flagProfile, suspendProfile } from './trustEngine.service';
import { seedVerifiedUser } from './seed-verified-user';

const router = Router();

router.post('/approve-profile', internalAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    await approveProfile(userId);
    res.json({ message: 'Profile approved' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/flag-profile', internalAuth, async (req, res) => {
  try {
    const { userId, reason } = req.body;
    if (!userId || !reason) return res.status(400).json({ error: 'userId and reason required' });
    await flagProfile(userId, reason);
    res.json({ message: 'Profile flagged for review' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/suspend-profile', internalAuth, async (req, res) => {
  try {
    const { userId, reason } = req.body;
    if (!userId || !reason) return res.status(400).json({ error: 'userId and reason required' });
    await suspendProfile(userId, reason);
    res.json({ message: 'Profile suspended' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Temporary: ensure verified user exists
router.post('/seed-verified-user', internalAuth, seedVerifiedUser);

export default router;
