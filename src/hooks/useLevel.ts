// هوک منطقِ یک مرحله: مدیریت انتخاب حروف، بررسی حدس، راهنما و وضعیت تکمیل.
// این هوک منطق را از UI جدا می‌کند تا صفحه‌ی بازی تمیز بماند.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GuessResult, Level } from '../types';
import { normalizePersian } from '../utils/persian';
import { shuffle } from '../utils/array';

export interface WheelTile {
  /** اندیس یکتا در آرایه‌ی حروف (برای کلیدِ React و انتخاب) */
  index: number;
  letter: string;
}

interface UseLevelArgs {
  level: Level;
  /** واژه‌هایی که از قبل (در ذخیره) یافت شده‌اند */
  initialFound: string[];
  onWordFound: (word: string) => void;
}

interface UseLevelApi {
  tiles: WheelTile[];
  /** اندیس کاشی‌های انتخاب‌شده، به‌ترتیب */
  selected: number[];
  /** رشته‌ی فعلیِ ساخته‌شده */
  guess: string;
  foundWords: string[];
  /** آیا همه‌ی واژه‌ها یافت شده؟ */
  complete: boolean;
  /** حروفی که با راهنما برای هر واژه آشکار شده‌اند */
  revealed: Record<string, number>;
  selectTile: (index: number) => void;
  removeLast: () => void;
  clearSelection: () => void;
  shuffleTiles: () => void;
  /** بررسی حدس فعلی؛ نتیجه را برمی‌گرداند و انتخاب را پاک می‌کند */
  submitGuess: () => GuessResult;
  /** آشکارکردن یک حرفِ یک واژه‌ی هنوز پیدانشده */
  useHint: () => boolean;
  /** آیا واژه (نمایشی) قبلاً یافت شده؟ */
  isFound: (word: string) => boolean;
}

export function useLevel(args: UseLevelArgs): UseLevelApi {
  const { level, initialFound, onWordFound } = args;

  const [order, setOrder] = useState<number[]>(() =>
    shuffle(level.letters.map((_, i) => i)),
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>(initialFound);
  // برای هر واژه، تعداد حروفی که با راهنما آشکار شده‌اند.
  const [revealed, setRevealed] = useState<Record<string, number>>({});

  // اگر مرحله عوض شد، حالت را بازنشانی کن.
  useEffect(() => {
    setOrder(shuffle(level.letters.map((_, i) => i)));
    setSelected([]);
    setFoundWords(initialFound);
    setRevealed({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id]);

  const tiles = useMemo<WheelTile[]>(
    () =>
      order.map((idx) => ({
        index: idx,
        letter: level.letters[idx] as string,
      })),
    [order, level.letters],
  );

  const guess = useMemo(
    () => selected.map((i) => level.letters[i] as string).join(''),
    [selected, level.letters],
  );

  const complete = useMemo(
    () => level.words.every((w) => foundWords.includes(w)),
    [level.words, foundWords],
  );

  const selectTile = useCallback(
    (index: number) => {
      setSelected((prev) =>
        prev.includes(index) ? prev : [...prev, index],
      );
    },
    [],
  );

  const removeLast = useCallback(() => {
    setSelected((prev) => prev.slice(0, -1));
  }, []);

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  const shuffleTiles = useCallback(() => {
    setOrder((prev) => shuffle(prev));
    setSelected([]);
  }, []);

  const isFound = useCallback(
    (word: string) => foundWords.includes(word),
    [foundWords],
  );

  const submitGuess = useCallback((): GuessResult => {
    if (selected.length === 0) {
      return { status: 'empty' };
    }
    const normalizedGuess = normalizePersian(guess);
    // واژه‌ی متناظر را (با نرمال‌سازی) بیاب.
    const match = level.words.find(
      (w) => normalizePersian(w) === normalizedGuess,
    );
    setSelected([]);
    if (!match) {
      return { status: 'wrong' };
    }
    const alreadyFound = foundWords.includes(match);
    if (!alreadyFound) {
      setFoundWords((prev) => [...prev, match]);
      onWordFound(match);
    }
    return { status: 'correct', word: match, alreadyFound };
  }, [selected.length, guess, level.words, foundWords, onWordFound]);

  const useHint = useCallback((): boolean => {
    // کوتاه‌ترین واژه‌ی پیدانشده را انتخاب کن و یک حرفِ بعدی‌اش را آشکار کن.
    const target = level.words
      .filter((w) => !foundWords.includes(w))
      .sort((a, b) => a.length - b.length)[0];
    if (!target) {
      return false;
    }
    const current = revealed[target] ?? 0;
    if (current >= target.length) {
      return false;
    }
    setRevealed((prev) => ({ ...prev, [target]: current + 1 }));
    return true;
  }, [level.words, foundWords, revealed]);

  return {
    tiles,
    selected,
    guess,
    foundWords,
    complete,
    revealed,
    selectTile,
    removeLast,
    clearSelection,
    shuffleTiles,
    submitGuess,
    useHint,
    isFound,
  };
}
