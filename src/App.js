import React, { useState, useEffect } from 'react';
import './App.css';

const Game = () => {
  const [carPosition, setCarPosition] = useState(250); // Vertical position of the car
  const [carXPosition, setCarXPosition] = useState(200); // Horizontal position of the car
  const [obstacles, setObstacles] = useState([]); // Array of obstacles
  const [gameOver, setGameOver] = useState(false); // Game over flag
  const [score, setScore] = useState(0); // Game score

  const carSpeed = 30; // Car speed
  const obstacleBaseSpeed = 2; // Base speed for obstacles

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
      } else if (e.key === 'ArrowRight' && carXPosition < 450) {
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
        setObstacles((prevObstacles) => [
          ...prevObstacles,
          {
            x: Math.random() * 500 + 50, // Random horizontal position
            y: -50, // Start just above the screen
            width: 50 + Math.random() * 50, // Random width
            height: 50 + Math.random() * 50, // Random height
            speed: obstacleBaseSpeed + Math.random() * 2, // Random speed
          },
        ]);
      }

      setObstacles((prevObstacles) => {
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

      if (!gameOver) setScore(score + 1);

    }, 20);

    return () => clearInterval(interval);
  }, [obstacles, carPosition, carXPosition, gameOver, score]);

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>

      {/* Car Image */}
      <img
        src="/assets/character.jpg" // Path to car image
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
          src="/assets/girls.jpg" // Path to obstacle image
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
      <h1>Focuse bro .</h1>
      <Game />

      <a href='https://jlss.netlify.app/'>Powered by JLSS</a>

    </div>

  );
}

export default App;
