"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitProfileForVerification = submitProfileForVerification;
const prisma_1 = require("../shared/prisma");
async function submitProfileForVerification(userId) {
    const user = await prisma_1.prisma.user.findUnique({
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
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { profileState: "pending" }
    });
    await prisma_1.prisma.profileStateLog.create({
        data: { userId: userId, fromState: "draft", toState: "pending", trigger: "USER_SUBMIT" }
    });
}
