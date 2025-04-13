import React, { useEffect, useState } from 'react';
import { auth, db } from 'src/firebase'; // adjust path as needed
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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

                const dinoRef = userData?.dinosaur; // <- reference field from Firestore

                if (dinoRef) {
                    const dinoSnap = await getDoc(dinoRef); // dereference the doc
                    const dinoData = dinoSnap.data();

                    // 🔁 Ensure hunger is treated as a number (in case it's a string)
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
        // You could update the dinosaur document here to adjust hunger
        console.log('Feed action triggered');
    };

    if (loading) return <p>Loading...</p>;
    if (!user || !dino) return <p>No dinosaur found.</p>;

    return (
        <div>
            <h1>Welcome, {user.displayName}</h1>
            <h2>Your Dinosaur: {dino.name}</h2>
            <p>Type: {dino.type}</p>
            <p>Level: {dino.level}</p>
            <p>Health: {dino.health}</p>
            <p>Hunger: {dino.hunger}</p>

            <div>
                <button onClick={handleFeed}>Feed</button>
                <button onClick={() => console.log('Train clicked')}>Train</button>
                <button onClick={() => console.log('Play clicked')}>Play</button>
            </div>
        </div>
    );
}

export default MyDinosaurPage;