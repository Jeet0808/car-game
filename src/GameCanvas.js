import React, { useEffect, useRef } from 'react';

const GameCanvas = () => {
  const canvasRef = useRef(null); // Correctly initialize canvasRef
  const backgroundImage = useRef(new Image()); // Correctly initialize backgroundImage

  useEffect(() => {
    // Set up the background image source
    backgroundImage.current.src = '/assets/background.jpg';  // Adjust the path as needed

    // Once the image is loaded, draw it on the canvas
    backgroundImage.current.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.drawImage(backgroundImage.current, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}  // Attach canvasRef to the canvas element
      width={800}       // Set the canvas width
      height={600}      // Set the canvas height
      style={{ border: '1px solid black' }}
    />
  );
};

export default GameCanvas;
