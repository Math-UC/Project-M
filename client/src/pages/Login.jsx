import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, signInWithGoogle } from "src/firebase";

function LoginPage() {
    return (
        <button onClick={signInWithGoogle}>
            Sign in with Google
        </button>
    );
}

export default LoginPage;
