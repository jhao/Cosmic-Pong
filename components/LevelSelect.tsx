
import React, { useRef, useEffect } from 'react';
import { Level } from '../types';

interface LevelSelectProps {
  levels: Level[];
  unlockedLevel: number;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ levels, unlockedLevel, onSelectLevel, onBack }) => {
  const unlockedLevelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (unlockedLevelRef.current) {
      unlockedLevelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [unlockedLevel]);

  return (
    <div className="w-full h-full max-w-md mx-auto flex flex-col bg-stone-900/50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-cyan-400">Select Level</h2>
        <button onClick={onBack} className="px-4 py-2 bg-stone-800 text-cyan-300 border border-cyan-500 rounded hover:bg-cyan-900">
          Back
        </button>
      </div>
      <div className="flex-grow overflow-y-auto pr-4 relative">
        {/* Tree Trunk */}
        <div className="absolute top-0 left-1/2 w-2 bg-yellow-900/50 h-full -translate-x-1/2" />
        <div className="flex flex-col items-center space-y-4">
          {levels.map((level, index) => {
            const isUnlocked = level.id <= unlockedLevel;
            const isLeft = index % 2 === 0;

            return (
              <div key={level.id} className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                <div className={`relative w-1/2 ${isLeft ? 'pl-8' : 'pr-8'}`}>
                  {/* Branch */}
                  <div className={`absolute top-1/2 h-1 ${isLeft ? 'left-0 w-8' : 'right-0 w-8'} bg-yellow-900/50 -translate-y-1/2`} />
                  <button
                    ref={level.id === unlockedLevel ? unlockedLevelRef : null}
                    onClick={() => isUnlocked && onSelectLevel(level)}
                    disabled={!isUnlocked}
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 transform
                      ${isUnlocked 
                        ? 'bg-cyan-600 text-white border-2 border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.7)] hover:scale-110' 
                        : 'bg-stone-700 text-stone-500 border-2 border-stone-600 cursor-not-allowed'
                      }
                      ${isLeft ? 'ml-auto' : 'mr-auto'}
                    `}
                  >
                    {level.id}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
