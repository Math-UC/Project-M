import { useEffect, useState } from 'react';
import { auth, db } from './firebase'; // make sure you import db
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from 'pages/Login.jsx';
import Dashboard from 'pages/Dashboard.jsx';
import ChooseDino from 'pages/ChooseDino.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // If user doc doesn't exist then new user
          setIsNewUser(true);
        }
      } else {
        setUser(null);
        setIsNewUser(false);
      }
      setCheckingAuth(false);
    });
  }, []);

  if (checkingAuth) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user
              ? isNewUser
                ? <Navigate to="/choose-dino" />
                : <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/choose-dino" element={user ? <ChooseDino /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
