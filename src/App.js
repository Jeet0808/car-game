import React, { useState, useEffect } from 'react';
import './App.css';

const Game = () => {
  var [carPosition, setCarPosition] = useState(250); // Vertical position of the car
  var [carXPosition, setCarXPosition] = useState(200); // Horizontal position of the car
  var [obstacles, setObstacles] = useState([]); // Array of obstacles
  var [gameOver, setGameOver] = useState(false); // Game over flag
  var [score, setScore] = useState(0); // Game score
  var [obstacleBaseSpeed, setObstacleBaseSpeed] = useState(2);

  const carSpeed = 25; // Car speed

  // Array of obstacle image paths
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
    '/assets/obstacle19.gif',
    '/assets/obstacle20.gif',
  ];

  // Handle the car movement
  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && carPosition > 0) {
        setCarPosition(carPosition - carSpeed); // Move car up
      } else if (e.key === 'ArrowDown' && carPosition < 450) {
        setCarPosition(carPosition + carSpeed); // Move car down
      } else if (e.key === 'ArrowLeft' && carXPosition > 0) {
        setCarXPosition(carXPosition - carSpeed); // Move car left
      } else if (e.key === 'ArrowRight' && carXPosition < 750) {
        setCarXPosition(carXPosition + carSpeed); // Move car right
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [carPosition, carXPosition, gameOver]);

  // Game loop for obstacle creation and movement
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      if (obstacles.length < 5) {
        // Add a new obstacle
        setObstacles((prevObstacles) => [
          ...prevObstacles,
          {
            x: Math.random() * 700 + 50, // Random horizontal position
            y: -50, // Start just above the screen
            width: 50 + Math.random() * 50, // Random width
            height: 50 + Math.random() * 50, // Random height
            speed: obstacleBaseSpeed + Math.random() * 2, // Random speed
            image: obstacleImages[Math.floor(Math.random() * obstacleImages.length)], // Random image
          },
        ]);
      }

      // Update obstacles position and remove those off-screen
      setObstacles((prevObstacles) => {
        console.log(obstacleBaseSpeed);
        return prevObstacles
          .map((obstacle) => {
            if (obstacle.y >= 500) {
              return {
                ...obstacle,
                y: -50, // Reset position to top
                x: Math.random() * 500 + 50, // New random horizontal position
              };
            } else {
              return { ...obstacle, y: obstacle.y + obstacle.speed };
            }
          })
          .filter((obstacle) => obstacle.y <= 500); // Remove obstacles that go off screen
      });

      // Check for collision with obstacles
      for (let obstacle of obstacles) {
        if (
          carPosition < obstacle.y + obstacle.height &&
          carPosition + 50 > obstacle.y &&
          carXPosition < obstacle.x + obstacle.width &&
          carXPosition + 50 > obstacle.x
        ) {
          setGameOver(true);
          alert('Game Over Khatam tata by by !');
          break;
        }
      }

      // Update score and obstacle speed
      if (!gameOver) {
        setScore((prevScore) => prevScore + 1); // Use functional update for score
        setObstacleBaseSpeed((prevSpeed) => prevSpeed + 0.002); // Use functional update for obstacle speed
      }
    }, 20);

    return () => clearInterval(interval);
  }, [obstacles, carPosition, carXPosition, gameOver, score, obstacleBaseSpeed]);

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>

      {/* Car Image */}
      <img
        src="/assets/char1.gif" // Path to car image
        alt="Car"
        className="car"
        style={{
          top: `${carPosition}px`,
          left: `${carXPosition}px`,
          position: 'absolute',
          width: '50px', // Adjust car width
          height: '50px', // Adjust car height
        }}
      />

      {/* Obstacle Images */}
      {obstacles.map((obstacle, index) => (
        <img
          key={index}
          src={obstacle.image} // Dynamic obstacle image
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
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h1>Focuse bro.</h1>
      <p>If You can control your mind, then don't look at girls and make 3000 score.</p>
      <Game />
    </div>
  );
}

export default App;
