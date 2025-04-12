import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, signInWithGoogle } from "./firebase";

function App() {
  return (
    <button onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
}

export default App;
