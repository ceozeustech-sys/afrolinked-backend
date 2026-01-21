import { prisma } from "../shared/prisma";

export async function submitProfileForVerification(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.profileState !== "draft") {
    throw new Error("Profile is not in draft state");
  }

  if (!user.profile) {
    throw new Error("Profile does not exist");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { profileState: "pending" }
  });

  await prisma.profileStateLog.create({
    data: { userId: userId, fromState: "draft", toState: "pending", trigger: "USER_SUBMIT" }
  });
}
