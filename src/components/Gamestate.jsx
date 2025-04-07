// GameState.js
import React, { useState, useEffect } from "react";
import GamePieces from "./Gamepieces";

const GameState = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("highScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [collisionType, setCollisionType] = useState(null);

  const handleGameOver = (type) => {
    setGameOver(true);
    setCollisionType(type);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
    }
  };

  const handleResetGame = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="score-board">
        <p className="score">Score: {score}</p>
        <p className="high-score">High Score: {highScore}</p>
      </div>

      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>
            {collisionType === "wall"
              ? "You hit the wall!"
              : "You collided with yourself!"}
          </p>
          <p>Your score: {score}</p>
          <button className="restart-button" onClick={handleResetGame}>
            Play Again
          </button>
        </div>
      ) : (
        <GamePieces
          score={score}
          setScore={setScore}
          onGameOver={handleGameOver}
        />
      )}
    </div>
  );
};

export default GameState;