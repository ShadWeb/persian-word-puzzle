// ثابت‌های سراسری برنامه.

import { GameSave, Settings } from '../types';

/** کلیدهای AsyncStorage */
export const STORAGE_KEYS = {
  save: '@amirza/save',
  settings: '@amirza/settings',
} as const;

/** هزینه‌ی گرفتن یک راهنما (نمایش یک حرف) */
export const HINT_COST = 30;

/** سکه‌ی اولیه‌ی بازیکن جدید */
export const INITIAL_COINS = 100;

/** مقدار پیش‌فرضِ ذخیره برای بازیکن جدید */
export const DEFAULT_SAVE: GameSave = {
  unlockedLevel: 1,
  currentLevel: 1,
  coins: INITIAL_COINS,
  completedLevels: [],
  foundWords: {},
};

/** تنظیمات پیش‌فرض */
export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  hapticsEnabled: true,
};
