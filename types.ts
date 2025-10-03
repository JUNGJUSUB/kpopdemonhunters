
export enum GameState {
  START_SCREEN,
  CHARACTER_CREATION,
  PLAYING,
  GAME_OVER,
}

export interface Character {
  name: string;
  hp: number;
  style: number; // Represents 'Style' or 'Charisma'
  demonEnergy: number;
}

export interface Scene {
  sceneDescription: string;
  choices: string[];
}

export interface GameLogEntry {
    type: 'scene' | 'choice';
    text: string;
}
   