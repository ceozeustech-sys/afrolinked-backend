"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const prisma_1 = require("../prisma");
const authenticate = async (req, res, next) => {
    try {
        const user = await prisma_1.prisma.user.findFirst();
        console.log('🔍 Auth middleware - Found user:', user ? user.id : 'NONE');
        if (!user) {
            return res.status(401).json({ error: 'No test user found' });
        }
        req.user = { id: user.id };
        next();
    }
    catch (error) {
        console.error('❌ Auth middleware error:', error);
        return res.status(500).json({ error: 'Auth system error' });
    }
};
exports.authenticate = authenticate;
