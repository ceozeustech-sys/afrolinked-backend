import { Request, Response } from 'express';
import { prisma } from '../shared/prisma';

export const approveProfile = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Fetch current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow pending → verified
    if (user.profileState !== 'pending') {
      return res.status(400).json({ error: "Only pending profiles can be 
approved" });
    }

    // Update state and log
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileState: 'verified' }
    });

    await prisma.profileStateLog.create({
      data: {
        userId: userId,
        previousState: 'pending',
        newState: 'verified',
        changedBy: 'system', // or internal service ID
        reason: 'Manual approval via internal API'
      }
    });

    return res.json({ message: "Profile approved", user: updatedUser });
  } catch (error) {
    console.error('Approve profile error:', error);
    return res.status(500).json({ error: "Failed to approve profile" });
  }
};
