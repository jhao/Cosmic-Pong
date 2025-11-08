
export enum Screen {
  MainMenu,
  LevelSelect,
  Game,
  Settings,
  EndGame,
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export enum ObstacleType {
  Rectangle = 'rect',
  Circle = 'circle',
}

export interface Obstacle {
  id: number;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Level {
  id: number;
  sceneDifficulty: number; // 1-5
  obstacles: Obstacle[];
}

export interface Settings {
  aiDifficulty: number; // 1-5
}

export interface ScoreRecord {
  levelId: number;
  playerScore: number;
  aiScore: number;
  timeSeconds: number;
}
