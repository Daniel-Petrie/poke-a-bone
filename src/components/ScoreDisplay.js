import React from 'react';
import './ScoreDisplay.css';

function ScoreDisplay({ score }) {
  return (
    <div className="score-container">
      <h2 className="score-text">{score}</h2>
      <p className="score-label">Current Score</p>
    </div>
  );
}

export default ScoreDisplay;