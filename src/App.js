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

  const carSpeed = 28;

  // Audio files using useRef
  const backgroundAudio = useRef(new Audio('/assets/back.mp3'));

  // Start background audio
  const startBackgroundAudio = () => {
    const bgAudio = backgroundAudio.current;
    bgAudio.loop = true;
    bgAudio.play();
  };

  // Stop all audio
  const stopAllAudio = () => {
    const bgAudio = backgroundAudio.current;

    bgAudio.pause();
    bgAudio.currentTime = 0;
  };

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || !gameStarted) return;
      if (e.key === 'ArrowUp') {
        setCarPosition((prevPosition) => (prevPosition > 0 ? prevPosition - carSpeed : prevPosition));
      } else if (e.key === 'ArrowDown') {
        setCarPosition((prevPosition) => (prevPosition < 430 ? prevPosition + carSpeed : prevPosition));
      } else if (e.key === 'ArrowLeft') {
        setCarXPosition((prevX) => (prevX > 5 ? prevX - carSpeed : prevX));
      } else if (e.key === 'ArrowRight') {
        setCarXPosition((prevX) => (prevX < 733 ? prevX + carSpeed : prevX));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, gameStarted]);

  // Game loop
  useEffect(() => {
    const obstacleImages = [
      '/assets/obstacle10.gif',
      '/assets/obstacle11.gif',
      '/assets/obstacle12.gif',
      '/assets/obstacle13.gif',
      '/assets/obstacle14.gif',
      '/assets/obstacle15.gif',
      '/assets/obstacle16.gif',
      '/assets/obstacle17.gif',
      '/assets/obstacle18.gif',
      '/assets/obstacle20.gif',
    ];

    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      // Generate new obstacles
      if (obstacles.length < 5) {
        setObstacles((prevObstacles) => [
          ...prevObstacles,
          {
            id: Date.now(), // Unique ID based on the current timestamp
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
      setObstacles((prevObstacles) => {
        return prevObstacles
          .map((obstacle) => {
            if (obstacle.y >= 500) {
              return {
                ...obstacle,
                y: -50,
                x: Math.random() * 500 + 50,
              };
            } else {
              return { ...obstacle, y: obstacle.y + obstacle.speed };
            }
          })
          .filter((obstacle) => obstacle.y <= 500);
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
          setCollidedObstacleId(obstacle.id); // Store the ID of the collided obstacle
          setGameOver(true);
          stopAllAudio();
          clearInterval(interval);  // Stop the interval to halt further game updates
          return;
        }
      }

      // Increase score and adjust obstacle speed if game is ongoing
      if (!gameOver) {
        setScore((prevScore) => prevScore + 1);
        setObstacleBaseSpeed((prevSpeed) => prevSpeed + 0.002);
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
    setCollidedObstacleId(null); // Reset collided obstacle ID
    const bgAudio = backgroundAudio.current;
    bgAudio.currentTime = 0;
    bgAudio.play();
  };

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

      {obstacles.map((obstacle, index) => (
        <img
          key={obstacle.id} // Use obstacle's ID as the key
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
        <div>
          <button className="restart-button" onClick={restartGame}>
            Restart Game
          </button>
        </div>
      )}
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
