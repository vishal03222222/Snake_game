// GamePieces.js
import React, { useState, useEffect, useRef } from "react";

const GamePieces = ({ score, setScore, onGameOver }) => {
  const canvasRef = useRef();
  const SNAKE_SPEED = 15;
  const GRID_SIZE = 15;
  const [apple, setApple] = useState({ x: 180, y: 100 });
  const [snake, setSnake] = useState([
    { x: 150, y: 150 },
    { x: 135, y: 150 },
    { x: 120, y: 150 },
  ]);
  const [direction, setDirection] = useState("right");
  const [nextDirection, setNextDirection] = useState("right");
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  const initGame = () => {
    setSnake([
      { x: 150, y: 150 },
      { x: 135, y: 150 },
      { x: 120, y: 150 },
    ]);
    setDirection("right");
    setNextDirection("right");
    setApple(generateRandomApple());
    setScore(0);
    setGameStarted(true);
  };

  // Generate random apple position
  const generateRandomApple = () => {
    const canvas = canvasRef.current;
    const maxX = Math.floor(canvas.width / GRID_SIZE) - 1;
    const maxY = Math.floor(canvas.height / GRID_SIZE) - 1;
    
    return {
      x: Math.floor(Math.random() * maxX) * GRID_SIZE,
      y: Math.floor(Math.random() * maxY) * GRID_SIZE,
    };
  };

  // Check collision with walls
  const checkWallCollision = (head) => {
    const canvas = canvasRef.current;
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= canvas.width ||
      head.y >= canvas.height
    );
  };

  // Check collision with self
  const checkSelfCollision = (head, snake) => {
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  };

  // Check if apple is eaten
  const checkAppleCollision = (head) => {
    return head.x === apple.x && head.y === apple.y;
  };

  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (!gameStarted) {
      if (e.key === " ") {
        initGame();
      }
      return;
    }

    switch (e.key) {
      case "ArrowRight":
        if (direction !== "left") setNextDirection("right");
        break;
      case "ArrowLeft":
        if (direction !== "right") setNextDirection("left");
        break;
      case "ArrowUp":
        if (direction !== "down") setNextDirection("up");
        break;
      case "ArrowDown":
        if (direction !== "up") setNextDirection("down");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, gameStarted]);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const gameLoop = setInterval(() => {
      // Update direction
      setDirection(nextDirection);

      // Move snake
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        // Calculate new head position
        switch (direction) {
          case "right":
            head.x += GRID_SIZE;
            break;
          case "left":
            head.x -= GRID_SIZE;
            break;
          case "up":
            head.y -= GRID_SIZE;
            break;
          case "down":
            head.y += GRID_SIZE;
            break;
          default:
            break;
        }

        // Check collisions
        if (checkWallCollision(head)) {
          onGameOver("wall");
          clearInterval(gameLoop);
          return prevSnake;
        }

        if (checkSelfCollision(head, newSnake)) {
          onGameOver("self");
          clearInterval(gameLoop);
          return prevSnake;
        }

        // Add new head
        newSnake.unshift(head);

        // Check if apple is eaten
        if (checkAppleCollision(head)) {
          setScore(prevScore => prevScore + 1);
          setApple(generateRandomApple());
        } else {
          // Remove tail if no apple eaten
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [direction, nextDirection, gameStarted]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#4CAF50" : "#8BC34A";
      ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    });

    // Draw apple
    ctx.fillStyle = "#FF5252";
    ctx.beginPath();
    ctx.arc(
      apple.x + GRID_SIZE / 2,
      apple.y + GRID_SIZE / 2,
      GRID_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [snake, apple]);

  return (
    <div className="game-area">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ border: "1px solid black" }}
      />
      {!gameStarted && (
        <div className="start-screen">
          <p>Press SPACE to start the game</p>
          <p>Use arrow keys to control the snake</p>
        </div>
      )}
    </div>
  );
};

export default GamePieces;