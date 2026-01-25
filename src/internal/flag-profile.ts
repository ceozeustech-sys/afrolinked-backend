import { Request, Response } from 'express';
import { prisma } from '../shared/prisma';

export const flagProfile = async (req: Request, res: Response) => {
  const { userId, reason } = req.body;

  if (!userId || !reason) {
    return res.status(400).json({ error: "userId and reason are required" 
});
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow verified → under_review
    if (user.profileState !== 'verified') {
      return res.status(400).json({ error: "Only verified profiles can be 
flagged" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileState: 'under_review' }
    });

    await prisma.profileStateLog.create({
      data: {
        userId: userId,
        previousState: 'verified',
        newState: 'under_review',
        changedBy: 'system',
        reason: reason
      }
    });

    return res.json({ message: "Profile flagged for review", user: 
updatedUser });
  } catch (error) {
    console.error('Flag profile error:', error);
    return res.status(500).json({ error: "Failed to flag profile" });
  }
};
