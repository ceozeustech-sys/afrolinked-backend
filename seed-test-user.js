"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Create test user
    const user = await prisma.user.create({
        data: {
            phone: '+27000000000',
            verificationTier: 'basic',
            profileState: 'draft'
        }
    });
    console.log('✅ Test user created:', user.id);
    // Create associated profile
    const profile = await prisma.profile.create({
        data: {
            userId: user.id
        }
    });
    console.log('✅ Profile created:', profile.id);
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
