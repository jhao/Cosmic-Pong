
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Level, Settings, Paddle, Ball, Obstacle, ObstacleType, ScoreRecord } from '../types';
import { PADDLE_WIDTH_RATIO, PADDLE_HEIGHT, BALL_PADDLE_RATIO, WINNING_SCORE, SCENE_DIFFICULTY_MAP, AI_DIFFICULTY_MAP } from '../constants';

interface GameProps {
  level: Level;
  settings: Settings;
  onGameWin: (scoreRecord: ScoreRecord) => void;
  onQuit: () => void;
}

const Game: React.FC<GameProps> = ({ level, settings, onGameWin, onQuit }) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  
  const [playerPaddle, setPlayerPaddle] = useState<Paddle>({ x: 0, y: 0, width: 0, height: PADDLE_HEIGHT });
  const [aiPaddle, setAiPaddle] = useState<Paddle>({ x: 0, y: 0, width: 0, height: PADDLE_HEIGHT });
  const [ball, setBall] = useState<Ball>({ x: 0, y: 0, vx: 0, vy: 0, radius: 0 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const [gameState, setGameState] = useState<'serving' | 'playing' | 'countdown' | 'paused'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [servingPlayer, setServingPlayer] = useState<'player' | 'ai'>(Math.random() < 0.5 ? 'player' : 'ai');
  const [startTime, setStartTime] = useState<number | null>(null);

  const animationFrameId = useRef<number>();

  const resetPositions = useCallback(() => {
    if (!gameAreaRef.current) return;
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    const paddleWidth = width * PADDLE_WIDTH_RATIO;
    const ballRadius = (paddleWidth * BALL_PADDLE_RATIO) / 2;

    setPlayerPaddle({ x: width / 2 - paddleWidth / 2, y: height - PADDLE_HEIGHT * 2, width: paddleWidth, height: PADDLE_HEIGHT });
    setAiPaddle({ x: width / 2 - paddleWidth / 2, y: PADDLE_HEIGHT, width: paddleWidth, height: PADDLE_HEIGHT });
    
    let ballY = servingPlayer === 'player' ? height - PADDLE_HEIGHT * 2 - ballRadius - 5 : PADDLE_HEIGHT * 2 + ballRadius + 5;
    let ballX = servingPlayer === 'player' ? width / 2 : width / 2;
    setBall({ x: ballX, y: ballY, vx: 0, vy: 0, radius: ballRadius });
    
    setObstacles(level.obstacles.map(obs => ({
        ...obs,
        x: (obs.x / 100) * width,
        y: (obs.y / 100) * height,
    })));

  }, [servingPlayer, level.obstacles]);

  useEffect(() => {
    resetPositions();
    const countdownInterval = setInterval(() => {
        setCountdown(c => {
            if (c <= 1) {
                clearInterval(countdownInterval);
                setGameState('serving');
                setStartTime(Date.now());
                return 0;
            }
            return c - 1;
        });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [resetPositions]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return;
    }

    setBall(prevBall => {
      if (!gameAreaRef.current) return prevBall;
      const { width, height } = gameAreaRef.current.getBoundingClientRect();
      const [speedMult, elasticity] = SCENE_DIFFICULTY_MAP[level.sceneDifficulty];
      
      let newVx = prevBall.vx;
      let newVy = prevBall.vy;
      let newX = prevBall.x + newVx;
      let newY = prevBall.y + newVy;

      // Wall collisions
      if (newX - prevBall.radius < 0 || newX + prevBall.radius > width) newVx = -newVx;

      // Paddle collisions
      // Player
      if (newY + prevBall.radius > playerPaddle.y && newY - prevBall.radius < playerPaddle.y + playerPaddle.height && newX > playerPaddle.x && newX < playerPaddle.x + playerPaddle.width) {
        newVy = -Math.abs(newVy) * elasticity;
        const hitPos = (newX - (playerPaddle.x + playerPaddle.width / 2)) / (playerPaddle.width / 2);
        newVx += hitPos * 2;
      }
      // AI
      if (newY - prevBall.radius < aiPaddle.y + aiPaddle.height && newY + prevBall.radius > aiPaddle.y && newX > aiPaddle.x && newX < aiPaddle.x + aiPaddle.width) {
        newVy = Math.abs(newVy) * elasticity;
      }
      
      // Obstacle collisions
      obstacles.forEach(obs => {
          if (obs.type === ObstacleType.Rectangle) {
              const dx = newX - Math.max(obs.x, Math.min(newX, obs.x + obs.width));
              const dy = newY - Math.max(obs.y, Math.min(newY, obs.y + obs.height));
              if ((dx * dx + dy * dy) < (prevBall.radius * prevBall.radius)) {
                  // Simple collision response: reflect based on which side is closer
                  const distX = Math.abs(newX - (obs.x + obs.width / 2));
                  const distY = Math.abs(newY - (obs.y + obs.height / 2));
                  if (distX > distY) newVx = -newVx;
                  else newVy = -newVy;
              }
          } else { // Circle
              const dist = Math.hypot(newX - (obs.x + obs.width / 2), newY - (obs.y + obs.height/2));
              if (dist < prevBall.radius + obs.width / 2) {
                  newVy = -newVy; // Simplified reflection
              }
          }
      });


      // Scoring
      if (newY - prevBall.radius < 0) { // Player scores
        setPlayerScore(s => s + 1);
        setServingPlayer('ai');
        setGameState('serving');
        return prevBall;
      }
      if (newY + prevBall.radius > height) { // AI scores
        setAiScore(s => s + 1);
        setServingPlayer('player');
        setGameState('serving');
        return prevBall;
      }
      
      return { ...prevBall, x: newX, y: newY, vx: newVx, vy: newVy };
    });

    // AI movement
    setAiPaddle(prevAiPaddle => {
      const aiSpeed = AI_DIFFICULTY_MAP[settings.aiDifficulty];
      const targetX = ball.x - prevAiPaddle.width / 2;
      const newX = prevAiPaddle.x + (targetX - prevAiPaddle.x) * aiSpeed;
      if (gameAreaRef.current) {
        const { width } = gameAreaRef.current.getBoundingClientRect();
        return { ...prevAiPaddle, x: Math.max(0, Math.min(width - prevAiPaddle.width, newX)) };
      }
      return prevAiPaddle;
    });

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameState, playerPaddle, aiPaddle, ball.x, obstacles, level.sceneDifficulty, settings.aiDifficulty]);

  useEffect(() => {
    if ((playerScore >= WINNING_SCORE || aiScore >= WINNING_SCORE) && Math.abs(playerScore - aiScore) >= 2) {
      if (playerScore > aiScore) {
          const endTime = Date.now();
          const timeSeconds = startTime ? Math.round((endTime - startTime) / 1000) : 0;
          onGameWin({
              levelId: level.id,
              playerScore,
              aiScore,
              timeSeconds
          });
      } else {
        // AI wins, just go back to level select for now. Could implement a "Retry" screen.
        onQuit();
      }
    } else {
        if (gameState === 'serving') {
            resetPositions();
        }
    }
  }, [playerScore, aiScore, onGameWin, onQuit, resetPositions, gameState, level.id, startTime]);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameLoop]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || gameState === 'paused') return;
    const { left, width } = gameAreaRef.current.getBoundingClientRect();
    const newX = e.clientX - left - playerPaddle.width / 2;
    setPlayerPaddle(p => ({ ...p, x: Math.max(0, Math.min(width - p.width, newX)) }));
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || gameState === 'paused') return;
    const { left, width } = gameAreaRef.current.getBoundingClientRect();
    const newX = e.touches[0].clientX - left - playerPaddle.width / 2;
    setPlayerPaddle(p => ({ ...p, x: Math.max(0, Math.min(width - p.width, newX)) }));
  };

  const handleServe = () => {
      if (gameState === 'serving') {
          const [speedMult] = SCENE_DIFFICULTY_MAP[level.sceneDifficulty];
          const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
          const speed = 7 * speedMult;
          setBall(b => ({
              ...b,
              vx: Math.sin(angle) * speed,
              vy: (servingPlayer === 'player' ? -1 : 1) * Math.cos(angle) * speed,
          }));
          setGameState('playing');
      }
  };

  return (
    <div className="w-full h-full max-w-lg max-h-[90vh] aspect-[9/16] bg-stone-900 border-4 border-cyan-700 relative shadow-2xl shadow-cyan-900/50" ref={gameAreaRef} onMouseMove={handleMouseMove} onTouchMove={handleTouchMove} onClick={handleServe}>
      {/* Score Watermark */}
      <div className="absolute inset-0 flex items-center justify-center text-[20vh] font-black text-cyan-900/30 select-none">
        {aiScore} - {playerScore}
      </div>

      {/* Paddles */}
      <div style={{ position: 'absolute', left: aiPaddle.x, top: aiPaddle.y, width: aiPaddle.width, height: aiPaddle.height }} className="bg-red-500 rounded-sm" />
      <div style={{ position: 'absolute', left: playerPaddle.x, top: playerPaddle.y, width: playerPaddle.width, height: playerPaddle.height }} className="bg-blue-500 rounded-sm" />
      
      {/* Ball */}
      <div style={{ position: 'absolute', left: ball.x - ball.radius, top: ball.y - ball.radius, width: ball.radius * 2, height: ball.radius * 2 }} className="bg-white rounded-full shadow-[0_0_10px_white]" />
      
      {/* Obstacles */}
      {obstacles.map(obs => (
          <div key={obs.id} style={{
              position: 'absolute',
              left: obs.x,
              top: obs.y,
              width: obs.width,
              height: obs.height,
              borderRadius: obs.type === ObstacleType.Circle ? '9999px' : '0px'
          }} className="bg-yellow-600/70 border-2 border-yellow-400" />
      ))}
      
      {/* Game State Overlay */}
      {gameState === 'countdown' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-8xl font-bold text-white">
          {countdown > 0 ? countdown : 'Go!'}
        </div>
      )}
      {gameState === 'serving' && (
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-2xl font-bold text-white animate-pulse">
            <p>{servingPlayer === 'player' ? 'Your Serve' : 'Opponent Serves'}</p>
            <p className="text-lg mt-2">Tap to Start</p>
        </div>
      )}
      <button onClick={onQuit} className="absolute top-2 right-2 px-3 py-1 text-xs bg-red-800/80 text-white rounded">Quit</button>
    </div>
  );
};

export default Game;
