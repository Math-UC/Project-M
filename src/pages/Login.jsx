import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "src/firebase";
import { onAuthStateChanged } from "firebase/auth";

function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/dashboard");
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4 animate-spin"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-500">
            <div className="bg-white p-10 rounded-2xl shadow-lg text-center w-full max-w-md">
                <img
                    src="src/assets/logo.png"
                    alt="App Logo"
                    className="mx-auto w-24 h-24 mb-6 rounded-full shadow-md"
                />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Dino Money 🐾</h1>
                <p className="text-gray-600 mb-8">Sign in to get started with your finance buddy!</p>
                <button
                    onClick={signInWithGoogle}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

export default LoginPage;

