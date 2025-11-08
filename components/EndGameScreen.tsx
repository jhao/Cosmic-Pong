
import React from 'react';
import { ScoreRecord } from '../types';

interface EndGameScreenProps {
  records: ScoreRecord[];
  onRestart: () => void;
}

const EndGameScreen: React.FC<EndGameScreenProps> = ({ records, onRestart }) => {
  const totalScore = records.reduce((acc, r) => acc + (r.playerScore - r.aiScore), 0);
  const totalTime = records.reduce((acc, r) => acc + r.timeSeconds, 0);
  const finalRating = Math.max(1, Math.round((totalScore * 10000) / (totalTime + 1)));

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  };

  return (
    <div className="w-full max-w-lg p-8 bg-stone-900 rounded-lg shadow-lg border-2 border-cyan-500 text-center">
      <h2 className="text-5xl font-bold text-cyan-400 mb-4" style={{ textShadow: '0 0 10px #06b6d4' }}>
        Campaign Complete!
      </h2>
      <p className="text-lg text-stone-300 mb-6">Congratulations on conquering all 100 levels!</p>
      
      <div className="bg-stone-800/50 p-6 rounded-lg mb-8">
        <h3 className="text-2xl text-cyan-300 mb-4">Final Score</h3>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="text-stone-400">Total Score Difference:</div>
          <div className="text-white font-bold">{totalScore}</div>
          <div className="text-stone-400">Total Time:</div>
          <div className="text-white font-bold">{formatTime(totalTime)}</div>
          <div className="text-stone-400">Final Rating:</div>
          <div className="text-2xl text-yellow-400 font-bold">{finalRating}</div>
        </div>
      </div>
      
      <button 
        onClick={onRestart}
        className="w-full py-3 px-8 text-xl text-cyan-300 bg-stone-900 border-2 border-cyan-500 rounded-lg shadow-[0_0_15px_rgba(7,89,133,0.8)] hover:bg-cyan-900 hover:text-white transition-all duration-300"
      >
        Restart Campaign for a Higher Score
      </button>
    </div>
  );
};

export default EndGameScreen;
