import React, { useState } from 'react';
import SkeletonGame from './components/SkeletonGame';
import './App.css';

function App() {
  const [finalScore, setFinalScore] = useState(0);

  const handleGameEnd = (score) => {
    setFinalScore(score);
    // You can add additional logic here for when the game ends
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Poke a Bone!</h1>
      <SkeletonGame updateScore={handleGameEnd} />
      {finalScore > 0 && <div className="final-score">Final Score: {finalScore}</div>}
    </div>
  );
}

export default App;