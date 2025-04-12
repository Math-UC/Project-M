import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [dinos, setDinos] = useState([]);

  useEffect(() => {
    const fetchDinos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "dinos"));
        const dinosList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDinos(dinosList);
      } catch (error) {
        console.error("Error fetching dinos:", error);
      }
    };

    fetchDinos();
  }, []);

  return (
    <div>
      <h1>Dino List</h1>
      <ul>
        {dinos.map(dino => (
          <li key={dino.id}>
            ID: {dino.id}, Name: {dino.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
