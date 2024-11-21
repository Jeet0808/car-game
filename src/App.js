import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Game = () => {
  const [carPosition, setCarPosition] = useState(250);
  const [carXPosition, setCarXPosition] = useState(200);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [obstacleBaseSpeed, setObstacleBaseSpeed] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const [collidedObstacleId, setCollidedObstacleId] = useState(null);

  const carSpeed = 35;

  // Audio files using useRef
  const backgroundAudio = useRef(new Audio('/assets/back.mp3'));

  const startBackgroundAudio = () => {
    const bgAudio = backgroundAudio.current;
    bgAudio.loop = true;
    bgAudio.play();
  };

  const stopAllAudio = () => {
    const bgAudio = backgroundAudio.current;
    bgAudio.pause();
    bgAudio.currentTime = 0;
  };

  // Handle key presses for car movement
  const moveCar = (direction) => {
    if (gameOver || !gameStarted) return;
    switch (direction) {
      case 'ArrowUp':
        setCarPosition(prevPosition => (prevPosition > 0 ? prevPosition - carSpeed : prevPosition));
        break;
      case 'ArrowDown':
        setCarPosition(prevPosition => (prevPosition < 430 ? prevPosition + carSpeed : prevPosition));
        break;
      case 'ArrowLeft':
        setCarXPosition(prevX => (prevX > 5 ? prevX - carSpeed : prevX));
        break;
      case 'ArrowRight':
        setCarXPosition(prevX => (prevX < 733 ? prevX + carSpeed : prevX));
        break;
      default:
        break;
    }
  };

  // Game loop - generate and move obstacles, detect collisions
  useEffect(() => {
    const obstacleImages = [
      '/assets/obstacle10.gif', '/assets/obstacle11.gif', '/assets/obstacle12.gif',
      '/assets/obstacle13.gif', '/assets/obstacle14.gif', '/assets/obstacle15.gif',
      '/assets/obstacle16.gif', '/assets/obstacle17.gif', '/assets/obstacle18.gif',
      '/assets/obstacle19.gif', '/assets/obstacle20.gif'
    ];

    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      // Generate new obstacles
      if (obstacles.length < 5) {
        setObstacles(prevObstacles => [
          ...prevObstacles,
          {
            id: Date.now(),
            x: Math.random() * 700 + 5,
            y: -50,
            width: 50 + Math.random() * 50,
            height: 50 + Math.random() * 50,
            speed: obstacleBaseSpeed + Math.random() * 2,
            image: obstacleImages[Math.floor(Math.random() * obstacleImages.length)],
          },
        ]);
      }

      // Move obstacles and check collisions
      setObstacles(prevObstacles => {
        return prevObstacles
          .map(obstacle => {
            if (obstacle.y >= 500) {
              return { ...obstacle, y: -50, x: Math.random() * 500 + 50 };
            } else {
              return { ...obstacle, y: obstacle.y + obstacle.speed };
            }
          })
          .filter(obstacle => obstacle.y <= 500);
      });

      // Handle collision detection
      for (let obstacle of obstacles) {
        if (
          carPosition < obstacle.y + obstacle.height &&
          carPosition + 50 > obstacle.y &&
          carXPosition < obstacle.x + obstacle.width &&
          carXPosition + 50 > obstacle.x
        ) {
          // Handle game over if collision is detected
          setCollidedObstacleId(obstacle.id);
          setGameOver(true);
          stopAllAudio();
          clearInterval(interval);
          return;
        }
      }

      // Increase score and adjust obstacle speed if game is ongoing
      if (!gameOver) {
        setScore(prevScore => prevScore + 1);
        setObstacleBaseSpeed(prevSpeed => prevSpeed + 0.005);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [obstacles, carPosition, carXPosition, gameOver, score, obstacleBaseSpeed, gameStarted]);

  // Start game
  const startGame = () => {
    startBackgroundAudio();
    setGameStarted(true);
  };

  // Restart game
  const restartGame = () => {
    setCarPosition(250);
    setCarXPosition(200);
    setObstacles([]);
    setGameOver(false);
    setScore(0);
    setObstacleBaseSpeed(2);
    setGameStarted(true);
    setCollidedObstacleId(null);
    const bgAudio = backgroundAudio.current;
    bgAudio.currentTime = 0;
    bgAudio.play();
  };

  // Keydown event listener for car movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || !gameStarted) return;
      moveCar(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, gameStarted]);

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>

      <img
        src="/assets/char1.gif"
        alt="Car"
        className="car"
        style={{
          top: `${carPosition}px`,
          left: `${carXPosition}px`,
          position: 'absolute',
          width: '50px',
          height: '50px',
        }}
      />

      {obstacles.map((obstacle) => (
        <img
          key={obstacle.id}
          src={obstacle.image}
          alt="Obstacle"
          className="obstacle"
          style={{
            top: `${obstacle.y}px`,
            left: `${obstacle.x}px`,
            position: 'absolute',
            width: `${obstacle.width}px`,
            height: `${obstacle.height}px`,
          }}
        />
      ))}

      {collidedObstacleId && (
        <div className="collided-obstacle">
          {obstacles.find(obstacle => obstacle.id === collidedObstacleId) && (
            <img
              src={obstacles.find(obstacle => obstacle.id === collidedObstacleId).image}
              alt="Collided Obstacle"
            />
          )}
        </div>
      )}

      {!gameStarted && (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      )}
      {gameOver && (
        <div style={{ zIndex: 1 }}>
          <button className="restart-button" onClick={restartGame} style={{ zIndex: 1 }}>
            Restart Game
          </button>
        </div>
      )}

      <div className="mobile-controls">
        <button onClick={() => moveCar('ArrowUp')} className="control up">Up</button>
        <div className="horizontal-controls">
          <button onClick={() => moveCar('ArrowLeft')} className="control left">Left</button>
          <button onClick={() => moveCar('ArrowRight')} className="control right">Right</button>
        </div>
        <button onClick={() => moveCar('ArrowDown')} className="control down">Down</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h1>Focus, Bro!</h1>
      <p>If you can control your mind, don't look at girls and make a 3000 score.</p>
      <Game />
    </div>
  );
}

export default App;
