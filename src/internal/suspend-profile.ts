import { Request, Response } from 'express';
import { prisma } from '../shared/prisma';

export const suspendProfile = async (req: Request, res: Response) => {
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

    // Allow suspension from any state except already suspended
    if (user.profileState === 'suspended') {
      return res.status(400).json({ error: "User is already suspended" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
       { profileState: 'suspended' }
    });

    await prisma.profileStateLog.create({
       {
        userId: userId,
        previousState: user.profileState,
        newState: 'suspended',
        changedBy: 'system',
        reason: reason
      }
    });

    return res.json({ message: "Profile suspended", user: updatedUser });
  } catch (error) {
    console.error('Suspend profile error:', error);
    return res.status(500).json({ error: "Failed to suspend profile" });
  }
};
