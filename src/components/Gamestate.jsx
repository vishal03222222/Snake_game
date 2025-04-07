import React, { useState, useEffect } from "react";
import GamePieces from "./Gamepieces";

const GameState = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("highScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [collisionType, setCollisionType] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameOver = (type) => {
    setGameOver(true);
    setGameStarted(false);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
    }

    setCollisionType(type);
  };

  const handleResetGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const handleStartGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver && e.key === "Enter") {
        handleResetGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [gameOver]);

  return (
    <div className="game-container">
      <p className="score">Score: {score}</p>
      <p className="high-score">High Score: {highScore}</p>
      
      {!gameStarted && !gameOver && (
        <div className="start-screen">
          <button className="start-button" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="game-over">
          <p>Game Over! {collisionType === "wall" ? "You Hit the wall" : "You Ate yourself"}!</p>
          <p>Score: {score}</p>
          <button className="restart-button" onClick={handleResetGame}>
            Restart Game
          </button>
        </div>
      )}
      
      {gameStarted && !gameOver && (
        <GamePieces
          score={score}
          setScore={setScore}
          onGameOver={(type) => handleGameOver(type)}
        />
      )}
    </div>
  );
};

export default GameState;