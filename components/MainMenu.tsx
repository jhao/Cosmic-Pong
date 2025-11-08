import React from 'react';

interface MainMenuProps {
  onStartGame: () => void;
  onContinueGame: () => void;
  onSettings: () => void;
  canContinue: boolean;
}

const MenuButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-64 py-4 px-8 text-xl text-cyan-300 bg-stone-900 border-2 border-cyan-500 rounded-lg shadow-[0_0_15px_rgba(7,89,133,0.8)] hover:bg-cyan-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-stone-900 disabled:shadow-none"
    >
        {children}
    </button>
);


const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onContinueGame, onSettings, canContinue }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full animate-fadeIn">
      <div className="flex flex-col items-center space-y-8">
          <h1 className="text-7xl font-bold text-cyan-400" style={{ textShadow: '0 0 10px #06b6d4, 0 0 20px #0891b2' }}>
              Cosmic Pong
          </h1>
          <div className="flex flex-col space-y-6 pt-8">
              <MenuButton onClick={onStartGame}>New Game</MenuButton>
              <MenuButton onClick={onContinueGame} disabled={!canContinue}>Continue</MenuButton>
              <MenuButton onClick={onSettings}>Settings</MenuButton>
          </div>
      </div>
      <div className="absolute bottom-4 text-stone-500 text-sm">
        <a href="http://haoj.in" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
          http://haoj.in
        </a>
      </div>
    </div>
  );
};

export default MainMenu;
