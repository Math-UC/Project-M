// seedMissions.js (Node backend script using Firebase Admin SDK)

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ✅ Initialize app using default credentials (CLI or service account)
initializeApp({
    credential: applicationDefault(),
});

const db = getFirestore();

const dailyMissions = [
    { id: 'log-expense', title: 'Log a new expense', description: 'Track at least one expense today.', xp: 25 },
    { id: 'check-budget', title: 'Check your budget', description: 'Review your budget overview.', xp: 15 },
    { id: 'log-income', title: 'Log income', description: 'Add your daily earnings or deposits.', xp: 20 },
];

const weeklyMissions = [
    { id: 'review-weekly-expenses', title: 'Review weekly expenses', description: 'Look over your expense entries from this week.', xp: 40 },
    { id: 'set-weekly-goal', title: 'Set a financial goal', description: 'Create or review your financial goal for the week.', xp: 35 },
    { id: 'compare-income-expense', title: 'Compare income vs expenses', description: 'Make sure your spending didn’t exceed your income this week.', xp: 50 },
];

const monthlyMissions = [
    { id: 'set-monthly-budget', title: 'Set monthly budget', description: 'Plan your income and expenses for this month.', xp: 60 },
    { id: 'analyze-month-spending', title: 'Analyze monthly spending', description: 'View trends in your expenses from this month.', xp: 70 },
    { id: 'save-goal', title: 'Contribute to savings goal', description: 'Put money toward a long-term savings goal.', xp: 75 },
];

async function seedMissions(type, missions) {
    for (const mission of missions) {
        const ref = db.doc(`missions/${type}/tasks/${mission.id}`);
        await ref.set(mission);
        console.log(`✅ Seeded: ${type}/${mission.id}`);
    }
}

async function run() {
    await seedMissions('daily', dailyMissions);
    await seedMissions('weekly', weeklyMissions);
    await seedMissions('monthly', monthlyMissions);
    console.log('🎉 All missions seeded!');
}

run().catch(console.error);
