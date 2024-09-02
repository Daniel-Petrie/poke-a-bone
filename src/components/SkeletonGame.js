import React, { useState, useEffect, useRef } from 'react';
import './SkeletonGame.css';
import skeletonImage from '../assets/skeleton.png';

const bones = [
  { name: 'Skull', coords: '39,0,61,13' },
  { name: 'Clavicle', coords: '23,17,76,19' },
  { name: 'Scapula', coords: '24,19,35,22,65,19,75,22' }, 
  { name: 'Ribs', coords: '36,20,64,32' },
  { name: 'Sternum', coords: '47,20,53,32' },
  { name: 'Humerus', coords: '18,22,27,35,70,22,80,35' },
  { name: 'Ulna', coords: '17,35,23,48,75,35,83,48' },
  { name: 'Radius', coords: '10,35,16,48,83,35,90,48' },
  { name: 'Carpals', coords: '2,48,20,50,82,48,98,50' },
  { name: 'Metacarpals', coords: '2,50,20,52,82,50,98,52' },
  { name: 'Phalanges (Hand)', coords: '2,52,20,54,82,52,98,54' },
  { name: 'Pelvis', coords: '29,37,70,47' },
  { name: 'Femur', coords: '30,48,47,66,53,48,68,66' },
  { name: 'Patella', coords: '30,67,47,72,53,67,68,72' },
  { name: 'Tibia', coords: '37,73,45,90,53,73,60,90' },
  { name: 'Fibula', coords: '30,73,35,90,62,73,66,90' },
  { name: 'Tarsals', coords: '28,91,45,93,53,91,69,93' },
  { name: 'Metatarsals', coords: '24,93,45,95,53,93,72,95' },
  { name: 'Phalanges (Foot)', coords: '20,95,45,99,53,95,74,99' }
];

function SkeletonGame({ updateScore }) {
  const [currentBone, setCurrentBone] = useState(null);
  const [timeLeft, setTimeLeft] = useState(100);
  const [gameActive, setGameActive] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imagePosition, setImagePosition] = useState({ left: 0, top: 0 });
  const [cooldown, setCooldown] = useState(false); // Add cooldown state
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    selectNewBone();
    updateImageMetrics();
    window.addEventListener('resize', updateImageMetrics);
    return () => window.removeEventListener('resize', updateImageMetrics);
  }, []);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 100); // Countdown every 100ms
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive]);

  const updateImageMetrics = () => {
    if (imageRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      setImageSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight
      });
      setImagePosition({
        left: imageRect.left - containerRect.left,
        top: imageRect.top - containerRect.top
      });
    }
  };

  const selectNewBone = () => {
    const randomBone = bones[Math.floor(Math.random() * bones.length)];
    setCurrentBone(randomBone);
    setTimeLeft(100);
    setCooldown(false); // Reset cooldown when a new bone is selected
    setFeedback({});
  };

  const handleClick = (boneName) => {
    if (!gameActive || cooldown) return; // Ignore clicks if in cooldown or game is inactive

    if (boneName === currentBone.name) {
      setScore(prevScore => prevScore + timeLeft);
      setFeedback({ [boneName]: 'correct' });
      setCooldown(true); // Set cooldown to true to prevent further clicks
      setTimeout(() => {
        selectNewBone();
      }, 1000);
    } else {
      setTimeLeft(prev => Math.max(prev - 10, 0)); // Penalty for incorrect guess
      setFeedback({ [boneName]: 'incorrect' });
      setTimeout(() => {
        setFeedback({});
      }, 1000);
    }
  };

  const endGame = () => {
    setGameActive(false);
    updateScore(score);
  };

  const restartGame = () => {
    setScore(0);
    setGameActive(true);
    selectNewBone();
  };

  const getScaledCoords = (coords) => {
    const coordsArray = coords.split(',').map(Number);
    const scaleX = imageSize.width / 100;
    const scaleY = imageSize.height / 100;
    return coordsArray.map((coord, index) => {
      if (index % 2 === 0) {
        // X coordinate
        return coord * scaleX + imagePosition.left;
      } else {
        // Y coordinate
        return coord * scaleY + imagePosition.top;
      }
    });
  };

  return (
    <div className="game-container">
      <div className="skeleton-container" ref={containerRef}>
        <img 
          ref={imageRef}
          src={skeletonImage} 
          alt="Human Skeleton" 
          className="skeleton-image" 
          onLoad={updateImageMetrics}
        />
        {bones.map((bone) => {
          const coords = getScaledCoords(bone.coords);
          return coords.length === 4 ? (
            <div
              key={bone.name}
              className={`clickable-area ${feedback[bone.name] || ''}`}
              style={{
                left: `${coords[0]}px`,
                top: `${coords[1]}px`,
                width: `${coords[2] - coords[0]}px`,
                height: `${coords[3] - coords[1]}px`,
              }}
              onClick={() => handleClick(bone.name)}
            />
          ) : (
            <>
              <div
                key={`${bone.name}-left`}
                className={`clickable-area ${feedback[bone.name] || ''}`}
                style={{
                  left: `${coords[0]}px`,
                  top: `${coords[1]}px`,
                  width: `${coords[2] - coords[0]}px`,
                  height: `${coords[3] - coords[1]}px`,
                }}
                onClick={() => handleClick(bone.name)}
              />
              <div
                key={`${bone.name}-right`}
                className={`clickable-area ${feedback[bone.name] || ''}`}
                style={{
                  left: `${coords[4]}px`,
                  top: `${coords[5]}px`,
                  width: `${coords[6] - coords[4]}px`,
                  height: `${coords[7] - coords[5]}px`,
                }}
                onClick={() => handleClick(bone.name)}
              />
            </>
          );
        })}
      </div>
      <div className="game-info">
        <div className="info-item find-bone">
          <span>Find the:</span>
          <strong>{currentBone?.name}</strong>
        </div>
        <div className="info-item timer">
          <span>Time left:</span>
          <strong>{timeLeft}</strong>
        </div>
        <div className="info-item score-display">
          <span>Score:</span>
          <strong>{score}</strong>
        </div>
        {!gameActive && (
          <button onClick={restartGame} className="restart-button">
            Restart Game
          </button>
        )}
      </div>
    </div>
  );
}

export default SkeletonGame;
