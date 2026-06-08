// کانتکست مرکزیِ بازی: نگه‌داری وضعیت، ذخیره‌سازی خودکار، سکه‌ها،
// راهنماها و تکمیل مرحله. تمام صفحه‌ها از این کانتکست استفاده می‌کنند.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { GameSave, Settings } from '../types';
import { LEVELS, TOTAL_LEVELS } from '../data/levels';
import {
  clearAll,
  loadSave,
  loadSettings,
  persistSave,
  persistSettings,
} from '../utils/storage';
import { DEFAULT_SAVE, DEFAULT_SETTINGS, HINT_COST } from '../constants';
import { useSound } from '../hooks/useSound';
import { SoundName } from '../types';

interface GameContextValue {
  /** آیا داده‌ها از حافظه بارگذاری شده‌اند؟ */
  ready: boolean;
  save: GameSave;
  settings: Settings;

  // — عملیات سکه —
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;

  // — عملیات مرحله —
  /** ثبت یک واژه‌ی یافت‌شده در یک مرحله */
  recordFoundWord: (levelId: number, word: string) => void;
  /** آیا تمام واژه‌های مرحله یافت شده‌اند؟ */
  isLevelComplete: (levelId: number) => boolean;
  /** تکمیل مرحله: پاداش‌دهی و بازکردن مرحله‌ی بعد (یک‌بار) */
  completeLevel: (levelId: number) => { reward: number; firstTime: boolean };
  /** تنظیم مرحله‌ی جاری (برای دکمه‌ی ادامه) */
  setCurrentLevel: (levelId: number) => void;
  getFoundWords: (levelId: number) => string[];

  // — راهنما —
  hintCost: number;
  canAffordHint: boolean;
  buyHint: () => boolean;

  // — تنظیمات —
  toggleSound: () => void;
  toggleHaptics: () => void;

  // — صدا/لرزش (برای استفاده‌ی صفحه‌ها) —
  playSound: (name: SoundName) => void;
  haptic: (type?: 'light' | 'success' | 'error') => void;

  // — ریست کامل —
  resetProgress: () => Promise<void>;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ready, setReady] = useState(false);
  const [save, setSave] = useState<GameSave>(DEFAULT_SAVE);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const { play, haptic } = useSound({
    soundEnabled: settings.soundEnabled,
    hapticsEnabled: settings.hapticsEnabled,
  });

  // — بارگذاری اولیه از حافظه —
  useEffect(() => {
    let active = true;
    (async () => {
      const [loadedSave, loadedSettings] = await Promise.all([
        loadSave(),
        loadSettings(),
      ]);
      if (active) {
        setSave(loadedSave);
        setSettings(loadedSettings);
        setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // — ذخیره‌ی خودکار با هر تغییر (پس از آماده‌شدن) —
  const firstSaveSkip = useRef(true);
  useEffect(() => {
    if (!ready) {
      return;
    }
    if (firstSaveSkip.current) {
      firstSaveSkip.current = false;
      return;
    }
    persistSave(save);
  }, [save, ready]);

  useEffect(() => {
    if (ready) {
      persistSettings(settings);
    }
  }, [settings, ready]);

  // — سکه‌ها —
  const addCoins = useCallback((amount: number) => {
    setSave((prev) => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    let ok = false;
    setSave((prev) => {
      if (prev.coins >= amount) {
        ok = true;
        return { ...prev, coins: prev.coins - amount };
      }
      return prev;
    });
    return ok;
  }, []);

  // — واژه‌های یافت‌شده —
  const getFoundWords = useCallback(
    (levelId: number): string[] => save.foundWords[levelId] ?? [],
    [save.foundWords],
  );

  const recordFoundWord = useCallback((levelId: number, word: string) => {
    setSave((prev) => {
      const current = prev.foundWords[levelId] ?? [];
      if (current.includes(word)) {
        return prev;
      }
      return {
        ...prev,
        foundWords: {
          ...prev.foundWords,
          [levelId]: [...current, word],
        },
      };
    });
  }, []);

  const isLevelComplete = useCallback(
    (levelId: number): boolean => {
      const level = LEVELS.find((l) => l.id === levelId);
      if (!level) {
        return false;
      }
      const found = save.foundWords[levelId] ?? [];
      return level.words.every((w) => found.includes(w));
    },
    [save.foundWords],
  );

  const completeLevel = useCallback(
    (levelId: number): { reward: number; firstTime: boolean } => {
      const level = LEVELS.find((l) => l.id === levelId);
      if (!level) {
        return { reward: 0, firstTime: false };
      }
      const firstTime = !save.completedLevels.includes(levelId);
      setSave((prev) => {
        const alreadyDone = prev.completedLevels.includes(levelId);
        const nextUnlocked = Math.min(
          Math.max(prev.unlockedLevel, levelId + 1),
          TOTAL_LEVELS,
        );
        return {
          ...prev,
          coins: alreadyDone ? prev.coins : prev.coins + level.reward,
          completedLevels: alreadyDone
            ? prev.completedLevels
            : [...prev.completedLevels, levelId],
          unlockedLevel: nextUnlocked,
        };
      });
      return { reward: firstTime ? level.reward : 0, firstTime };
    },
    [save.completedLevels],
  );

  const setCurrentLevel = useCallback((levelId: number) => {
    setSave((prev) => ({ ...prev, currentLevel: levelId }));
  }, []);

  // — راهنما —
  const canAffordHint = save.coins >= HINT_COST;
  const buyHint = useCallback((): boolean => spendCoins(HINT_COST), [
    spendCoins,
  ]);

  // — تنظیمات —
  const toggleSound = useCallback(() => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleHaptics = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      hapticsEnabled: !prev.hapticsEnabled,
    }));
  }, []);

  // — ریست —
  const resetProgress = useCallback(async () => {
    await clearAll();
    setSave({ ...DEFAULT_SAVE });
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      ready,
      save,
      settings,
      addCoins,
      spendCoins,
      recordFoundWord,
      isLevelComplete,
      completeLevel,
      setCurrentLevel,
      getFoundWords,
      hintCost: HINT_COST,
      canAffordHint,
      buyHint,
      toggleSound,
      toggleHaptics,
      playSound: play,
      haptic,
      resetProgress,
    }),
    [
      ready,
      save,
      settings,
      addCoins,
      spendCoins,
      recordFoundWord,
      isLevelComplete,
      completeLevel,
      setCurrentLevel,
      getFoundWords,
      canAffordHint,
      buyHint,
      toggleSound,
      toggleHaptics,
      play,
      haptic,
      resetProgress,
    ],
  );

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
};

/** هوک دسترسی به کانتکست بازی */
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame باید درون <GameProvider> استفاده شود.');
  }
  return ctx;
}
