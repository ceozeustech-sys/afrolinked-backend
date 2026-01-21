"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowEditOnlyDraftOrPending = exports.requireVerifiedProfile = exports.blockIfSuspendedOrUnderReview = void 0;
const prisma_1 = require("../shared/prisma");
/**
 * Block access if profile is suspended or under_review.
 */
const blockIfSuspendedOrUnderReview = async (req, res, next) => {
    const userId = req.user.id;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { profileState: true }
    });
    if (!user || ['suspended', 'under_review'].includes(user.profileState)) {
        return res.status(403).json({
            error: 'Profile inactive or under review'
        });
    }
    next();
};
exports.blockIfSuspendedOrUnderReview = blockIfSuspendedOrUnderReview;
/**
 * Require verified state for discovery-sensitive actions.
 */
const requireVerifiedProfile = async (req, res, next) => {
    const userId = req.user.id;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { profileState: true }
    });
    if (!user || user.profileState !== 'verified') {
        return res.status(403).json({
            error: 'Profile must be verified'
        });
    }
    next();
};
exports.requireVerifiedProfile = requireVerifiedProfile;
/**
 * Allow profile edits only in draft or pending states.
 */
const allowEditOnlyDraftOrPending = async (req, res, next) => {
    const userId = req.user.id;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { profileState: true }
    });
    if (!user || !['draft', 'pending'].includes(user.profileState)) {
        return res.status(403).json({
            error: 'Profile edits only allowed in draft or pending state'
        });
    }
    next();
};
exports.allowEditOnlyDraftOrPending = allowEditOnlyDraftOrPending;
