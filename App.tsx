
import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Settings, Level, ScoreRecord } from './types';
import MainMenu from './components/MainMenu';
import LevelSelect from './components/LevelSelect';
import Game from './components/Game';
import SettingsScreen from './components/SettingsScreen';
import EndGameScreen from './components/EndGameScreen';
import { allLevels } from './utils/levelData';
import { TOTAL_LEVELS } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.MainMenu);
  const [settings, setSettings] = useState<Settings>({ aiDifficulty: 3 });
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [scoreRecords, setScoreRecords] = useState<ScoreRecord[]>([]);

  useEffect(() => {
    const savedUnlockedLevel = localStorage.getItem('unlockedLevel');
    const savedSettings = localStorage.getItem('settings');
    const savedScoreRecords = localStorage.getItem('scoreRecords');
    if (savedUnlockedLevel) {
      setUnlockedLevel(parseInt(savedUnlockedLevel, 10));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    if (savedScoreRecords) {
        setScoreRecords(JSON.parse(savedScoreRecords));
    }
  }, []);

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const handleStartGame = () => {
    setScreen(Screen.LevelSelect);
  };

  const handleContinueGame = () => {
    if (unlockedLevel > 0) {
      setScreen(Screen.LevelSelect);
    }
  };

  const handleSettings = () => {
    setScreen(Screen.Settings);
  };

  const handleBackToMenu = () => {
    setScreen(Screen.MainMenu);
  };
  
  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
    setScreen(Screen.Game);
  };

  const handleGameWin = useCallback((scoreRecord: ScoreRecord) => {
    const nextLevel = selectedLevel!.id + 1;
    if (nextLevel > unlockedLevel && nextLevel <= TOTAL_LEVELS) {
        setUnlockedLevel(nextLevel);
        localStorage.setItem('unlockedLevel', nextLevel.toString());
    }

    const existingRecordIndex = scoreRecords.findIndex(r => r.levelId === scoreRecord.levelId);
    let updatedRecords;
    if (existingRecordIndex > -1) {
        updatedRecords = [...scoreRecords];
        updatedRecords[existingRecordIndex] = scoreRecord;
    } else {
        updatedRecords = [...scoreRecords, scoreRecord];
    }
    setScoreRecords(updatedRecords);
    localStorage.setItem('scoreRecords', JSON.stringify(updatedRecords));
    
    if (unlockedLevel >= TOTAL_LEVELS && allLevels.length === updatedRecords.length) {
        setScreen(Screen.EndGame);
    } else {
        setScreen(Screen.LevelSelect);
    }
    setSelectedLevel(null);
  }, [selectedLevel, unlockedLevel, scoreRecords]);
  
  const handleRestartCampaign = () => {
    setUnlockedLevel(1);
    localStorage.setItem('unlockedLevel', '1');
    setScoreRecords([]);
    localStorage.removeItem('scoreRecords');
    setScreen(Screen.LevelSelect);
  }

  const renderScreen = () => {
    switch (screen) {
      case Screen.LevelSelect:
        return <LevelSelect levels={allLevels} unlockedLevel={unlockedLevel} onSelectLevel={handleSelectLevel} onBack={handleBackToMenu} />;
      case Screen.Game:
        return selectedLevel && <Game level={selectedLevel} settings={settings} onGameWin={handleGameWin} onQuit={handleBackToMenu} />;
      case Screen.Settings:
        return <SettingsScreen settings={settings} onSave={saveSettings} onBack={handleBackToMenu} />;
      case Screen.EndGame:
        return <EndGameScreen records={scoreRecords} onRestart={handleRestartCampaign} />;
      case Screen.MainMenu:
      default:
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onContinueGame={handleContinueGame}
            onSettings={handleSettings}
            canContinue={unlockedLevel > 1}
          />
        );
    }
  };

  return (
    <div className="w-full h-full bg-stone-950 text-white flex items-center justify-center font-mono">
      {renderScreen()}
    </div>
  );
};

export default App;
