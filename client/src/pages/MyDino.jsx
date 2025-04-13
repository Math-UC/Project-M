import React, { useEffect, useState } from 'react';
import { auth, db } from 'src/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { LinearProgress, Box, Typography, Button } from '@mui/material';

function MyDinosaurPage() {
    const [user, setUser] = useState(null);
    const [dino, setDino] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                const userDocSnap = await getDoc(doc(db, 'users', currentUser.uid));
                const userData = userDocSnap.data();

                const dinoRef = userData?.dinosaur;

                if (dinoRef) {
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

    if (loading) return <p>Loading...</p>;
    if (!user || !dino) return <p>No dinosaur found.</p>;

    const maxHealth = dino.level * 100;
    const maxXP = dino.level * 100;

    const healthPercent = (dino.health / maxHealth) * 100;
    const xpPercent = (dino.xp / maxXP) * 100;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>Welcome, {user.displayName}</Typography>
            <Typography variant="h5" gutterBottom>Your Dinosaur: {dino.name}</Typography>
            <Typography variant="body1">Type: {dino.type}</Typography>
            <Typography variant="body1">Level: {dino.level}</Typography>

            {/* Health Bar */}
            <Box my={2}>
                <Typography variant="body2">Health: {dino.health}/{maxHealth}</Typography>
                <LinearProgress
                    variant="determinate"
                    value={healthPercent}
                    color="error"
                    sx={{ height: 10, borderRadius: 5 }}
                />
            </Box>

            {/* XP Bar */}
            <Box my={2}>
                <Typography variant="body2">XP: {dino.xp}/{maxXP}</Typography>
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
                <Button variant="outlined" onClick={() => console.log('Train clicked')}>Train</Button>
            </Box>
        </Box>
    );
}

export default MyDinosaurPage;
