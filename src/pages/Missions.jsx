import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Stack,
} from '@mui/material';
import { db, auth } from '../firebase';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from 'src/Layout';

function Missions() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [missions, setMissions] = useState({ daily: [], weekly: [], monthly: [] });
    const [userProgress, setUserProgress] = useState({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchMissions = async () => {
            const missionTypes = ['daily', 'weekly', 'monthly'];
            const fetched = {};

            for (const type of missionTypes) {
                const snapshot = await getDocs(collection(db, 'missions', type, 'tasks'));
                fetched[type] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
            setMissions(fetched);
        };

        const fetchUserProgress = async () => {
            if (!user) return;
            const progressRef = doc(db, 'users', user.uid);
            const userSnapshot = await getDocs(collection(progressRef, 'completedMissions'));

            const progress = {};
            userSnapshot.forEach(doc => {
                progress[doc.id] = doc.data().completed;
            });

            setUserProgress(progress);
        };

        if (user) {
            Promise.all([fetchMissions(), fetchUserProgress()]).then(() => setLoading(false));
        }
    }, [user]);

    const toggleMission = async (missionId) => {
        if (!user) return;
        const userMissionRef = doc(db, 'users', user.uid, 'completedMissions', missionId);
        const completed = !userProgress[missionId];

        await setDoc(userMissionRef, { completed }, { merge: true });
        setUserProgress(prev => ({ ...prev, [missionId]: completed }));

        // Add XP reward here if desired
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;

    return (
        <Layout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>📜 Mission Hub</Typography>
                <Grid container spacing={2}>
                    {['daily', 'weekly', 'monthly'].map((type) => (
                        <Grid key={type} xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {type.charAt(0).toUpperCase() + type.slice(1)} Missions
                                    </Typography>
                                    {missions[type].map((mission) => (
                                        <Box key={mission.id} sx={{ mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={!!userProgress[mission.id]}
                                                        onChange={() => toggleMission(mission.id)}
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography variant="subtitle1">{mission.title}</Typography>
                                                        {mission.description && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                {mission.description}
                                                            </Typography>
                                                        )}
                                                        <Stack direction="row" spacing={1} mt={0.5}>
                                                            {mission.xp !== undefined && (
                                                                <Typography variant="caption">⭐ {mission.xp} XP</Typography>
                                                            )}
                                                            {mission.gold !== undefined && (
                                                                <Typography variant="caption">💰 {mission.gold} Gold</Typography>
                                                            )}
                                                        </Stack>
                                                    </Box>
                                                }
                                            />
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Layout>
    );
}

export default Missions;
