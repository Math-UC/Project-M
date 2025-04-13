const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onXpChange = onDocumentUpdated('dinosaurs/{dinoId}', async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    // Only trigger if XP changed
    if (before.xp === after.xp) return;

    const { xp, maxXp, level, maxHp, maxHunger } = after;

    if (xp >= maxXp) {
        const newLevel = level + 1;
        const newXp = xp - maxXp;

        const newMaxHp = Math.floor((maxHp || 100) * 1.2); // Default to 100 if undefined
        const newMaxHunger = Math.floor((maxHunger || 100) * 1.1);

        await event.data.after.ref.update({
            level: newLevel,
            xp: newXp,
            maxXp: Math.floor(maxXp * 1.2),
            maxHp: newMaxHp,
            hp: newMaxHp, // Fully heal
            maxHunger: newMaxHunger,
            hunger: newMaxHunger, // Fully refill
        });
    }
});
