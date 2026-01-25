import { Router } from 'express';
import { approveProfile } from './approve-profile';
import { flagProfile } from './flag-profile';
import { suspendProfile } from './suspend-profile';
import { internalAuth } from 
'../shared/middleware/internal-auth.middleware';

const router = Router();

// Apply internalAuth to all routes in this group
router.use(internalAuth);

router.post('/approve-profile', approveProfile);
router.post('/flag-profile', flagProfile);
router.post('/suspend-profile', suspendProfile);

export default router;
