import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, addDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbLfFstKDXgoiaQHJcFF-JR8-LRwP5d8M",
    authDomain: "project-m-c4c25.firebaseapp.com",
    projectId: "project-m-c4c25",
    storageBucket: "project-m-c4c25.firebasestorage.app",
    messagingSenderId: "1005768502448",
    appId: "1:1005768502448:web:bbdb447af203273e989f75",
    measurementId: "G-CCJ2V771CV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user doc exists
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // 1. Create new dinosaur document
            const dinoRef = await addDoc(collection(db, 'dinos'), {
                name: null,
                type: null,
                level: 1,
                health: 100,
                hunger: 100,
                xp: 0,
            });

            // 2. Create the user document with the reference to the dino
            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                createdAt: new Date(),
                money: 0, // initialize money
                dinosaur: dinoRef, // reference to the dino document
                preferences: {
                    theme: "dark",
                    notifications: true,
                },
            });
            console.log("New user added to Firestore");
        } else {
            console.log("User already exists");
        }
    } catch (error) {
        console.error("Google sign-in error:", error);
    }
};

export { auth, db, signInWithGoogle };
