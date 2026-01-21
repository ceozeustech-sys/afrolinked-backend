"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../shared/middleware/auth.middleware");
const profile_service_1 = require("./profile.service");
const router = (0, express_1.Router)();
/**
 * POST /api/profiles/submit
 * Allows user to submit their draft profile for verification.
 * Moves state: draft → pending (if valid)
 */
router.post('/submit', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        await (0, profile_service_1.submitProfileForVerification)(userId);
        res.status(200).json({ message: 'Profile submitted for verification' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
