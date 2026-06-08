// لایه‌ی ذخیره‌سازی محلی روی AsyncStorage.
// همه‌چیز تایپ‌دار است و در صورت خطا مقدار پیش‌فرض برمی‌گردد.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSave, Settings } from '../types';
import {
  DEFAULT_SAVE,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
} from '../constants';

/** خواندنِ وضعیت ذخیره‌شده (در صورت نبود یا خرابی، پیش‌فرض) */
export async function loadSave(): Promise<GameSave> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.save);
    if (!raw) {
      return { ...DEFAULT_SAVE };
    }
    const parsed = JSON.parse(raw) as Partial<GameSave>;
    // ادغام با پیش‌فرض تا فیلدهای جدید همیشه وجود داشته باشند.
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      completedLevels: parsed.completedLevels ?? [],
      foundWords: parsed.foundWords ?? {},
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

/** نوشتنِ کاملِ وضعیت */
export async function persistSave(save: GameSave): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.save, JSON.stringify(save));
  } catch {
    // اگر نوشتن شکست بخورد بازی نباید کرش کند.
  }
}

/** خواندن تنظیمات */
export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** نوشتن تنظیمات */
export async function persistSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify(settings),
    );
  } catch {
    // بی‌خطر
  }
}

/** پاک‌کردن کاملِ پیشرفت (برای دکمه‌ی ریست در تنظیمات) */
export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.save,
      STORAGE_KEYS.settings,
    ]);
  } catch {
    // بی‌خطر
  }
}
