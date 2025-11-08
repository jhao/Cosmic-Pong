
import React, { useState } from 'react';
import { Settings } from '../types';

interface SettingsScreenProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onSave, onBack }) => {
  const [aiDifficulty, setAiDifficulty] = useState(settings.aiDifficulty);

  const handleSave = () => {
    onSave({ aiDifficulty });
    onBack();
  };
  
  const difficultyLabels = ["Rookie", "Amateur", "Pro", "Veteran", "Legend"];

  return (
    <div className="w-full max-w-md p-8 bg-stone-900 rounded-lg shadow-lg border border-cyan-700">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Settings</h2>
      
      <div className="mb-8">
        <label htmlFor="aiDifficulty" className="block text-lg text-cyan-300 mb-2">
          Opponent Difficulty: <span className="font-bold text-white">{difficultyLabels[aiDifficulty-1]}</span>
        </label>
        <input
          id="aiDifficulty"
          type="range"
          min="1"
          max="5"
          step="1"
          value={aiDifficulty}
          onChange={(e) => setAiDifficulty(parseInt(e.target.value))}
          className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-xs text-stone-400 mt-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-2 bg-stone-800 text-cyan-300 border border-cyan-500 rounded hover:bg-cyan-900 transition-colors">
          Back
        </button>
        <button onClick={handleSave} className="px-6 py-2 bg-cyan-600 text-white border border-cyan-400 rounded hover:bg-cyan-500 transition-colors">
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
