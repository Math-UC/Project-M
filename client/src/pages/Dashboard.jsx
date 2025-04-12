import { useEffect, useState } from 'react';
import { auth } from 'src/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Hi, {user.displayName || "User"} 👋</h1>
            <p style={styles.email}>Email: {user.email}</p>
            <button onClick={handleSignOut} style={styles.button}>Sign Out</button>
        </div>
    );
}

const styles = {
    container: {
        padding: '2rem',
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
    button: {
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default Dashboard;
