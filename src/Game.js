import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from './Card';



//const Game = () =>

function Game(params) {
    
   
    const [carPosition, setCarPosition] = useState(250);
    const [carXPosition, setCarXPosition] = useState(200);
    const [obstacles, setObstacles] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [obstacleBaseSpeed, setObstacleBaseSpeed] = useState(2);
    const [gameStarted, setGameStarted] = useState(false);
    const [collidedObstacleId, setCollidedObstacleId] = useState(null);
    // const [carImage, setCarImage] = useState('/assets/char1.gif');
    const [rotation, setRotation] = useState(0);
    const [flipped, setFlipped] = useState(false); // State to manage flipping
    const [videoUrl, setVideoUrl] = useState(null); // New state to store video URL
    const [collision, setCollision] = useState(false);
    const [userName, setUserName] = useState(""); 
    const shortIds = [
      "h7OFu82sRog", "8-OlcrB5W4I", "0cAeZIhpr4U", "EmqDnnIn4Wg", "8-OlcrB5W4I", 
     "_uVlwzOnmOU", "6il6LvUApLM", "g23Cif5PWBI", 
       "kN7f4Muf4ng", "VMuBqYCwg0A", "Hsje984x8yI", 
      "Doz9u1LBMIE", "2ZVHN7Ts7Y4", "Lg5iCrLGfHI", "Hn7GbvDigXs", "YwHtD8dqQH8", 
      "mwa2kzsOYfQ", "8pXs5-VNRo8",
      "0cAeZIhpr4U", "2dPkJ5WnopM", "XtjRwzJ4mWo", "h7OFu82sRog", "A5nXv6333lg", 
      "EmqDnnIn4Wg", "EmqDnnIn4Wg", "HKGBgQhnhHk", "Ppsq1uevyAI", 
      "Ppsq1uevyAI","9jnXteTzzN0",
      "RvPQVEaODVE", "Q-kWkaCj3TE", "JVFHmqTCB6Q","V-MFonxJFko", "04CjMg2OhZs", "ZqB3yvwuXko", "WbJRIfVXuqU", 
      "vgogO03a4pw", "GJHE-MJ4pzQ", "4BrwdIJDd8g", "9DaK1X0TRHc", "jbULuBbea40", 
      "KGTVC3Nffc0", "OBwP6omjyv0", "xTuk_Qwmg5E", "XtjRwzJ4mWo", "UOZnEYt13ss", 
      "B0JnQtNFWgw", "V-MFonxJFko", "jFz7aARvByQ","V-MFonxJFko", "t9pdFGPouHo", "eUg3ZgTDF8M", 
      "m4lBPYYiDOo", "YYrFd2dSpnM", "CHZ6_IjMJzc", "4lfJofqXDDg", "0zKHwZ4eNoA", 
      "G5gm24apmlU", "t7SWsLlJllY", "-fK2DmyBhjY", "Dv0w6kn5gHo", "eVQa3hfFLpo", 
      "oNW5Cqt96_w", "cNheUml-BfA", "D-zjVTfAR1g", "9Re0A3mfcIg","VMuBqYCwg0A",
      "W4rcXFSDDcA","rcLmTehwd7M",
      


    ]; 
  // Initialize the state with the original array
  const [shortIdsstate, setShortIds] = useState(shortIds);
  
    const carSpeed = 35;
  
    // Audio files using useRef
    const backgroundAudio = useRef(new Audio('/assets/bksong.mp3'));
  
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
  
    const moveCar = useCallback((direction) => {
      if (gameOver || !gameStarted) return;
      if (direction === 'ArrowUp') {
        setCarPosition((prevPosition) => (prevPosition > 0 ? prevPosition - carSpeed : prevPosition));
      } else if (direction === 'ArrowDown') {
        setCarPosition((prevPosition) => (prevPosition < 620 ? prevPosition + carSpeed : prevPosition));
      } else if (direction === 'ArrowLeft') {
        setRotation(0); // No rotation for flipping horizontally
        setFlipped(true); // Flip horizontally
        setCarXPosition((prevX) => (prevX > 5 ? prevX - carSpeed : prevX));
      } else if (direction === 'ArrowRight') {
        setRotation(0); // No rotation for flipping horizontally
        setFlipped(false);
        setCarXPosition((prevX) => (prevX < 735 ? prevX + carSpeed : prevX));
      }
    }, [gameOver, gameStarted]);
  
  
    
  
    // Function to embed a random short video
    const embedRandomShort = () => {
      if (shortIdsstate.length === 0) {
        console.log("No more videos to play.");
        return;
      }
      // Pick a random ID from the array
      const randomIndex = Math.floor(Math.random() * shortIds.length);
      const randomId = shortIdsstate[randomIndex];
      // Remove the used ID from the array immutably
      const updatedShortIds = shortIdsstate.filter((_, index) => index !== randomIndex);
      setShortIds(updatedShortIds);
      
  
      const videoEmbedUrl = `https://www.youtube.com/embed/${randomId}?autoplay=1`;
      setVideoUrl(videoEmbedUrl); // Set video URL to the state
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
              if (obstacle.y >= 650) {
                return { ...obstacle, y: -50, x: Math.random() * 650 + 100 };
              } else {
                return { ...obstacle, y: obstacle.y + obstacle.speed };
              }
            })
            .filter(obstacle => obstacle.y <= 650);
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
            embedRandomShort(); // Play the video when collision occurs
            setGameOver(true);
            setCollision(true);
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
  
   

    
    const startGame = () => {
      if (!userName) {
       const username = prompt("Enter your name"); // Prompt for name if not already set
        if (username) {
          setUserName(username); // Store the name in state
        }
      }
      startBackgroundAudio();
      setGameStarted(true); // Start the game
    };
  
    // Restart game
    const restartGame = () => {
        setCollision(false);
      setCarPosition(400);
      setCarXPosition(250);
      setObstacles([]);
      setGameOver(false);
      setScore(0);
      setObstacleBaseSpeed(2);
      setGameStarted(true);
      setCollidedObstacleId(null);
      const bgAudio = backgroundAudio.current;
      bgAudio.currentTime = 0;
      bgAudio.play();
      setVideoUrl(null);
    };
  
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (gameOver || !gameStarted) return;
        moveCar(e.key);
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, gameStarted, moveCar]);

    return (
        <div>
          {collision ? (
            // Show Card on collision
            <div className="card-container">
              <Card obstacles={obstacles} collidedObstacleId={collidedObstacleId} name = {userName}  restart={restartGame} />
              {gameOver && (
                <button id="restart" className="restart-button" onClick={restartGame}>
                  Restart
                </button>
              )}
            </div>
             
          ) : (
            <div className="game-container">
              {/* Main Game Elements */}
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
                  zIndex: 15,
                  transform: `scaleX(${flipped ? -1 : 1}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                }}
              />
      
              {/* Obstacles */}
              {obstacles.map((obstacle) => (
                <img
                  key={obstacle.id}
                  src={obstacle.image}
                  alt="Obstacle"
                  style={{
                    position: 'absolute',
                    top: `${obstacle.y}px`,
                    left: `${obstacle.x}px`,
                    width: `${obstacle.width}px`,
                    height: `${obstacle.height}px`,
                  }}
                />
              ))}
      
           
              {/* Game Controls */}
              {!gameStarted && (
                
                <button className="start-button" onClick={startGame}>
                  Start Game
                </button>

              )}
             
      
              {/* Score */}
              <div className="score">Score: {score}</div>
            </div>
          )}
      
          {/* Mobile Controls */}
          {!collision && (
            <div className="mobile-controls">
              <button onClick={() => moveCar('ArrowUp')} className="control up">
                Up
              </button>
              <div className="horizontal-controls">
                <button onClick={() => moveCar('ArrowLeft')} className="control left">
                  Left
                </button>
                <button
                  onClick={() => moveCar('ArrowRight')}
                  className="control right"
                >
                  Right
                </button>
              </div>
              <button onClick={() => moveCar('ArrowDown')} className="control down">
                Down
              </button>
            </div>
          )}
      
          {/* Video Container */}
          {videoUrl && (
            <div id="video-container">
              <iframe
                src={videoUrl}
                allow="autoplay"
                allowFullScreen
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  zIndex: 1,
                }}
              />
            </div>
          )}
        </div>
      );
      
    }
export default Game;  