import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from 'pages/Login.jsx';
import Dashboard from 'pages/Dashboard.jsx';
import Choose from 'pages/ChooseDino.jsx';
import MyDinosaurPage from 'pages/MyDino';
import Finances from 'pages/Finances';

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
  }, []);

  if (checkingAuth) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/choose" element={user ? <Choose /> : <Navigate to="/login" />} />
        <Route path="/my-dino" element={user ? <MyDinosaurPage /> : <Navigate to="/login" />} />
        <Route path="/finances" element={user ? <Finances /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;