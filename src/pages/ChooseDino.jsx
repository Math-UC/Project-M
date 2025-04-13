import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dinoImages = {
  red: {
    neutral: 'src/assets/images/dino1.png',
    happy: 'src/assets/images/dino1.png'
  },
  blue: {
    neutral: 'src/assets/images/dino2.png',
    happy: 'src/assets/images/dino2.png'
  },
  green: {
    neutral: 'src/assets/images/dino3.png',
    happy: 'src/assets/images/dino3.png'
  }
};

const ChooseDino = () => {
  const [hoveredDino, setHoveredDino] = useState(null);
  const [selectedDino, setSelectedDino] = useState(null);
  const [dinoName, setDinoName] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);

  const navigate = useNavigate();

  const handleSelectDino = (color) => {
    const defaultName = capitalize(color);
    const wantsRename = window.confirm(`Do you want to rename your ${defaultName} dino?`);
    let name = defaultName;

    if (wantsRename) {
      const newName = window.prompt("Enter your dino's name:");
      if (newName) {
        name = newName;
      }
    }

    setSelectedDino(color);
    setDinoName(name);
    setNameConfirmed(true);

    const dinoData = {
      color,
      name,
      mood: 'neutral',
      level: 1,
      gold: 0
    };

    localStorage.setItem('userDino', JSON.stringify(dinoData));
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Choose Your Dino!</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        {['red', 'blue', 'green'].map((color) => (
          <img
            key={color}
            src={
              hoveredDino === color || selectedDino === color
                ? dinoImages[color].happy
                : dinoImages[color].neutral
            }
            alt={`${color} dino`}
            onMouseEnter={() => setHoveredDino(color)}
            onMouseLeave={() => setHoveredDino(null)}
            onClick={() => handleSelectDino(color)}
            style={{ width: '150px', cursor: 'pointer' }}
          />
        ))}
      </div>

      {nameConfirmed && (
        <>
          <p style={{ marginTop: '2rem' }}>
            You chose <strong>{dinoName}</strong> the <strong>{capitalize(selectedDino)}</strong> Dino!
          </p>
          <button onClick={handleContinue} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Continue
          </button>
        </>
      )}
    </div>
  );
};

export default ChooseDino;
