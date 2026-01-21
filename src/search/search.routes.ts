import { Router } from 'express';
import { authenticate } from '../shared/middleware/auth.middleware';
import { requireVerifiedProfile } from '../shared/middleware/profileAccess.middleware';

const router = Router();

router.get('/users', authenticate, requireVerifiedProfile, (req, res) => {
  res.json({ message: 'Search results for verified users only' });
});

export default router;
