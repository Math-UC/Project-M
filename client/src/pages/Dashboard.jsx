import { useEffect, useState } from 'react';
import { auth, db } from 'src/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import dino from 'assets/test-dino.jpg';
import Layout from "src/Layout";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [money, setMoney] = useState(null); // 💰 new state to store money

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setMoney(userData.money); // 👈 set the money from the database
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
    };

    if (!user) return <p>Loading...</p>;

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center w-full min-h-screen overflow-x-hidden text-center">
                <div style={styles.container}>
                    <h1 style={styles.header}>Hi, {user.displayName || "User"} 👋</h1>
                    <p style={styles.email}>Email: {user.email}</p>
                    <p style={styles.money}>Money: {money !== null ? `$${money}` : 'Loading...'}</p> {/* 💸 Display money */}
                    <button onClick={handleSignOut} style={styles.button}>Sign Out</button>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4 w-full mx-auto">
                    <img
                        className="mx-auto block rounded-full sm:mx-0 sm:shrink-0"
                        src={dino}
                        alt=""
                        style={{ height: '50px', width: '50px' }}
                    />
                    <div className="space-y-2 text-center">
                        <div className="space-y-0.5">
                            <p className="text-lg font-semibold text-black">Your dinosaur</p>
                            <p className="font-medium text-gray-500">He is awesome</p>
                        </div>
                        <button className="border-purple-200 text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700">
                            Feed him money
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    container: {
        padding: '0',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        fontSize: '2rem',
    },
    email: {
        marginTop: '0.5rem',
        color: '#555',
    },
    money: {
        marginTop: '0.5rem',
        fontSize: '1.2rem',
        color: '#111',
    },
    button: {
        marginTop: '1rem',
        padding: '0',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default Dashboard;
