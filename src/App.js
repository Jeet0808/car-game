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

  const carSpeed = 25;

  // Audio files using useRef
  const backgroundAudio = useRef(new Audio('/assets/back.mp3'));
  const gameOverAudio = useRef(new Audio('/assets/go.mp3'));

  // Start background audio
  const startBackgroundAudio = () => {
    const bgAudio = backgroundAudio.current;
    bgAudio.loop = true;
    bgAudio.play();
  };

  // Stop all audio
  const stopAllAudio = () => {
    const bgAudio = backgroundAudio.current;
    const goAudio = gameOverAudio.current;
    bgAudio.pause();
    bgAudio.currentTime = 0;
    goAudio.pause();
    goAudio.currentTime = 0;
  };
  async function playGameOverAudio() {
    // Ensure the background audio is correctly referenced before calling pause()
    const bgAudio = backgroundAudio.current;
  
    if (bgAudio && !bgAudio.paused) {
      bgAudio.pause();
      bgAudio.currentTime = 0; // Reset background audio
    }
  
    try {
      // Wait for gameOverAudio to finish before setting gameOver state
      await gameOverAudio.current.play();
    } catch (error) {
      console.error("Error playing game over audio:", error);
    }
  
    // Set the gameOver state after the audio starts
    setGameOver(true);
  }
  
  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || !gameStarted) return;
      if (e.key === 'ArrowUp') {
        setCarPosition((prevPosition) => (prevPosition > 0 ? prevPosition - carSpeed : prevPosition));
      } else if (e.key === 'ArrowDown') {
        setCarPosition((prevPosition) => (prevPosition < 450 ? prevPosition + carSpeed : prevPosition));
      } else if (e.key === 'ArrowLeft') {
        setCarXPosition((prevX) => (prevX > 0 ? prevX - carSpeed : prevX));
      } else if (e.key === 'ArrowRight') {
        setCarXPosition((prevX) => (prevX < 700 ? prevX + carSpeed : prevX));
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
            x: Math.random() * 700 + 50,
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
             // Set the gameOver state after the audio starts
           setGameOver(true);
          stopAllAudio();
          // playGameOverAudio();
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
          key={index}
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

      {!gameStarted && (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      )}

      {gameOver && (
        <button className="restart-button" onClick={restartGame}>
          Restart Game
        </button>
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
