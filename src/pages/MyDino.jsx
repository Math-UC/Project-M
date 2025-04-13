import React, { useEffect, useState } from 'react';
import { auth, db } from 'src/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { LinearProgress, Box, Typography, Button } from '@mui/material';
import Layout from "src/Layout";

function MyDinosaurPage() {
    const [user, setUser] = useState(null);
    const [dino, setDino] = useState(null);
    const [dinoRef, setDinoRef] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                const userDocSnap = await getDoc(doc(db, 'users', currentUser.uid));
                const userData = userDocSnap.data();

                const dinoRef = userData?.dinosaur;

                if (dinoRef) {
                    setDinoRef(dinoRef);
                    const dinoSnap = await getDoc(dinoRef);
                    const dinoData = dinoSnap.data();

                    if (typeof dinoData.hunger === 'string') {
                        dinoData.hunger = parseInt(dinoData.hunger);
                    }

                    setDino(dinoData);
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleFeed = () => {
        console.log('Feed action triggered');
    };

    const handleTrain = async () => {
        const xpGain = 50;
        const moneyCost = 100;

        if (!user || !dino || !dinoRef) return;

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.data();

            if (!userData || userData.money < moneyCost) {
                alert('Not enough money to train!');
                return;
            }

            // Calculate new dino stats
            const newHealth = Math.max(0, dino.health - 0.1 * dino.max_health);
            const newHunger = Math.max(0, dino.hunger - 0.2 * dino.max_hunger);
            const newXP = dino.xp + xpGain;
            const newMoney = userData.money - moneyCost;

            // Update both user money and dino stats
            await Promise.all([
                updateDoc(dinoRef, {
                    health: newHealth,
                    hunger: newHunger,
                    xp: newXP
                }),
                updateDoc(userDocRef, {
                    money: newMoney
                })
            ]);

            // Update local state
            setDino(prev => ({
                ...prev,
                health: newHealth,
                hunger: newHunger,
                xp: newXP
            }));

            console.log('Training complete!');
        } catch (error) {
            console.error('Error during training:', error);
            alert('Training failed.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user || !dino) return <p>No dinosaur found.</p>;

    const healthPercent = (dino.health / dino.max_health) * 100;
    const hungerPercent = (dino.hunger / dino.max_hunger) * 100;
    const xpPercent = (dino.xp / dino.max_xp) * 100;

    return (
        <Layout>
            <Box p={4}>
                <Typography variant="h4" gutterBottom>Welcome, {user.displayName}</Typography>
                <Typography variant="h5" gutterBottom>Your Dinosaur: {dino.name}</Typography>
                <Typography variant="body1">Type: {dino.type}</Typography>
                <Typography variant="body1">Level: {dino.level}</Typography>

                {/* Health Bar */}
                <Box my={2}>
                    <Typography variant="body2">Health: {dino.health}/{dino.max_health}</Typography>
                    <LinearProgress
                        variant="determinate"
                        value={healthPercent}
                        color="error"
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                </Box>

                {/* Hunger Bar */}
                <Box my={2}>
                    <Typography variant="body2">Hunger: {dino.hunger}/{dino.max_hunger}</Typography>
                    <LinearProgress
                        variant="determinate"
                        value={hungerPercent}
                        color="warning"
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                </Box>

                {/* XP Bar */}
                <Box my={2}>
                    <Typography variant="body2">XP: {dino.xp}/{dino.max_xp}</Typography>
                    <LinearProgress
                        variant="determinate"
                        value={xpPercent}
                        color="primary"
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                </Box>

                {/* Action Buttons */}
                <Box mt={3} display="flex" gap={2}>
                    <Button variant="contained" color="success" onClick={handleFeed}>Feed</Button>
                    <Button variant="outlined" onClick={handleTrain}>Train</Button>
                </Box>
            </Box>
        </Layout>

    );
}

export default MyDinosaurPage;
