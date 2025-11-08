
import { Level, ObstacleType } from '../types';

export const generateLevels = (): Level[] => {
  const levels: Level[] = [];
  for (let i = 1; i <= 100; i++) {
    const level: Level = {
      id: i,
      sceneDifficulty: (i % 5) + 1,
      obstacles: [],
    };

    const obstacleCount = Math.floor(i / 10) + 1;

    for (let j = 0; j < obstacleCount; j++) {
      const type = Math.random() < 0.5 ? ObstacleType.Circle : ObstacleType.Rectangle;
      const size = Math.random() * 30 + 20; // width/height or diameter
      
      level.obstacles.push({
        id: j,
        type: type,
        x: Math.random() * 80 + 10, // in %
        y: Math.random() * 40 + 30, // in %
        width: size,
        height: type === ObstacleType.Circle ? size : Math.random() * 30 + 20,
      });
    }
    levels.push(level);
  }
  return levels;
};

export const allLevels = generateLevels();
