import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from 'src/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import dino from 'assets/test-dino.jpg';
import Layout from "src/Layout";

function Dashboard() {
    const navigate = useNavigate();
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
        <Layout>
            <div className="flex flex-col items-center justify-center w-full min-h-screen overflow-x-hidden text-center">
                <div style={styles.container}>
                    <h1 style={styles.header}>Hi, {user.displayName || "User"} 👋</h1>
                    <p style={styles.email}>Email: {user.email}</p>
                    <button onClick={handleSignOut} style={styles.button}>Sign Out</button>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4 w-full mx-auto">
                    <img
                        className="mx-auto block rounded-full sm:mx-0 sm:shrink-0"
                        src={dino}
                        alt=""
                        style={{ height: '50px', width: '50px' }} // Custom size only, keeping the rest to Tailwind for centering
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
    button: {
        marginTop: '1rem',
        padding: '0',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default Dashboard;
