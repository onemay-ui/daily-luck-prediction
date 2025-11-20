import { Type } from "@google/genai";

export interface JiaziStick {
  id: number;
  name: string; // e.g., "甲子"
}

export interface FortuneResponse {
  animalGuardian: string;
  animalTrait: string;
  poem: string; // 4 lines
  luckyColor: string;
  advice: {
    general: string;
    career: string;
    love: string;
  };
  auspiciousness: 'Great Fortune' | 'Good Fortune' | 'Neutral' | 'Caution';
}

export enum AppState {
  IDLE = 'IDLE',
  SHAKING = 'SHAKING',
  DRAWN = 'DRAWN',
  INTERPRETING = 'INTERPRETING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
