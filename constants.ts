
export const PADDLE_WIDTH_RATIO = 0.1;
export const PADDLE_HEIGHT = 15;
export const BALL_PADDLE_RATIO = 0.2;
export const WINNING_SCORE = 11;
export const TOTAL_LEVELS = 100;

// Scene difficulty maps to ball speed and elasticity
// [speed multiplier, elasticity (0-1)]
export const SCENE_DIFFICULTY_MAP: { [key: number]: [number, number] } = {
  1: [1.0, 0.98],
  2: [1.1, 0.99],
  3: [1.2, 1.0],
  4: [1.3, 1.01],
  5: [1.4, 1.02],
};

// AI difficulty maps to paddle speed
export const AI_DIFFICULTY_MAP: { [key: number]: number } = {
  1: 0.05, // Slower reaction
  2: 0.07,
  3: 0.1, // Tracks ball perfectly
  4: 0.12,
  5: 0.15, // Faster than ball
};
