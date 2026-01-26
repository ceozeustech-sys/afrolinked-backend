import { Router } from 'express';
import { requireVerifiedProfile } from '../shared/middleware/profileAccess.middleware';

const router = Router();

router.get('/users', requireVerifiedProfile, (req, res) => {
  res.json({ message: 'Search results for verified users only' });
});

export default router;
