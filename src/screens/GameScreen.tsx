// صفحه‌ی بازی: قلبِ گیم‌پلی. چرخِ حروف، نمایش حدس، کنترل‌ها (پاک‌کردن،
// حذف، بُر زدن، تأیید)، راهنما، انیمیشن‌های موفقیت/خطا و تشخیص تکمیل مرحله.

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Background } from '../components/Background';
import { CoinBadge } from '../components/CoinBadge';
import { LetterWheel } from '../components/LetterWheel';
import { GuessDisplay, GuessState } from '../components/GuessDisplay';
import { WordSlots } from '../components/WordSlots';
import { PrimaryButton } from '../components/PrimaryButton';
import { useGame } from '../context/GameContext';
import { useLevel } from '../hooks/useLevel';
import { LEVELS } from '../data/levels';
import { colors, fontSize, radius, spacing } from '../theme';
import { ScreenProps } from '../navigation/types';

export const GameScreen: React.FC<ScreenProps<'Game'>> = ({
  route,
  navigation,
}) => {
  const { levelId } = route.params;
  const level = useMemo(
    () => LEVELS.find((l) => l.id === levelId) ?? LEVELS[0]!,
    [levelId],
  );

  const {
    save,
    getFoundWords,
    recordFoundWord,
    completeLevel,
    setCurrentLevel,
    canAffordHint,
    hintCost,
    buyHint,
    playSound,
    haptic,
  } = useGame();

  const {
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
  } = useLevel({
    level,
    initialFound: getFoundWords(levelId),
    onWordFound: (word) => recordFoundWord(levelId, word),
  });

  const [guessState, setGuessState] = useState<GuessState>('idle');
  const shake = useRef(new Animated.Value(0)).current;
  const wheelScale = useRef(new Animated.Value(1)).current;
  const completionHandled = useRef(false);

  // ثبت مرحله‌ی جاری برای دکمه‌ی «ادامه»
  useEffect(() => {
    setCurrentLevel(levelId);
    completionHandled.current = false;
  }, [levelId, setCurrentLevel]);

  // اندازه‌ی چرخ بر اساس عرض صفحه (طراحی واکنش‌گرا)
  const wheelSize = useMemo(() => {
    const w = Dimensions.get('window').width;
    return Math.min(w - spacing.xl * 2, 340);
  }, []);

  // — انیمیشن لرزش برای پاسخ غلط —
  const runShake = useCallback(() => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shake]);

  // — انیمیشن تپشِ موفقیت —
  const runPulse = useCallback(() => {
    Animated.sequence([
      Animated.spring(wheelScale, {
        toValue: 1.06,
        useNativeDriver: true,
        speed: 40,
      }),
      Animated.spring(wheelScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start();
  }, [wheelScale]);

  const resetGuessState = useCallback(() => {
    setTimeout(() => setGuessState('idle'), 700);
  }, []);

  const onSubmit = useCallback(() => {
    const result = submitGuess();
    if (result.status === 'empty') {
      return;
    }
    if (result.status === 'correct') {
      if (result.alreadyFound) {
        // قبلاً پیدا شده — فقط بازخورد ملایم
        setGuessState('idle');
        haptic('light');
        return;
      }
      setGuessState('correct');
      playSound('correct');
      haptic('success');
      runPulse();
      resetGuessState();
    } else {
      setGuessState('wrong');
      playSound('wrong');
      haptic('error');
      runShake();
      resetGuessState();
    }
  }, [submitGuess, haptic, playSound, runPulse, runShake, resetGuessState]);

  const onSelectTile = useCallback(
    (index: number) => {
      selectTile(index);
      playSound('tap');
      haptic('light');
    },
    [selectTile, playSound, haptic],
  );

  const onHint = useCallback(() => {
    if (!canAffordHint) {
      return;
    }
    // ابتدا تلاش برای آشکارسازی؛ اگر چیزی برای آشکارسازی نبود، سکه کم نشود.
    const ok = useHint();
    if (ok) {
      buyHint();
      playSound('coin');
      haptic('light');
    }
  }, [canAffordHint, useHint, buyHint, playSound, haptic]);

  // — هنگام تکمیلِ همه‌ی واژه‌ها: پاداش و رفتن به صفحه‌ی پیروزی —
  useEffect(() => {
    if (complete && !completionHandled.current) {
      completionHandled.current = true;
      const { reward } = completeLevel(levelId);
      playSound('win');
      haptic('success');
      const t = setTimeout(() => {
        navigation.replace('Victory', { levelId, reward });
      }, 900);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [complete, completeLevel, levelId, navigation, playSound, haptic]);

  return (
    <Background>
      {/* نوار بالا */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.back}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.levelTitle}>
          مرحله {levelId.toLocaleString('fa-IR')}
        </Text>
        <CoinBadge coins={save.coins} />
      </View>

      {/* خانه‌های واژه‌ها */}
      <View style={styles.slotsArea}>
        <WordSlots
          words={level.words}
          foundWords={foundWords}
          revealed={revealed}
        />
        <Text style={styles.progress}>
          {foundWords.length.toLocaleString('fa-IR')} از{' '}
          {level.words.length.toLocaleString('fa-IR')} واژه
        </Text>
      </View>

      {/* نمایش حدس */}
      <View style={styles.guessArea}>
        <GuessDisplay guess={guess} state={guessState} shake={shake} />
      </View>

      {/* چرخِ حروف */}
      <Animated.View
        style={[styles.wheelArea, { transform: [{ scale: wheelScale }] }]}
      >
        <LetterWheel
          tiles={tiles}
          selected={selected}
          size={wheelSize}
          onSelect={onSelectTile}
        />
      </Animated.View>

      {/* کنترل‌های ردیف ابزار */}
      <View style={styles.toolRow}>
        <ToolButton label="بُر" icon="🔀" onPress={shuffleTiles} />
        <ToolButton
          label="حذف"
          icon="⌫"
          onPress={removeLast}
          disabled={selected.length === 0}
        />
        <ToolButton
          label="پاک‌کردن"
          icon="✕"
          onPress={clearSelection}
          disabled={selected.length === 0}
        />
        <ToolButton
          label={`راهنما (${hintCost.toLocaleString('fa-IR')})`}
          icon="💡"
          onPress={onHint}
          disabled={!canAffordHint}
        />
      </View>

      {/* دکمه‌ی تأیید */}
      <View style={styles.submitArea}>
        <PrimaryButton
          label="بررسی واژه"
          onPress={onSubmit}
          disabled={selected.length === 0}
        />
      </View>
    </Background>
  );
};

// — دکمه‌ی کوچکِ ابزار —
const ToolButton: React.FC<{
  label: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
}> = ({ label, icon, onPress, disabled }) => (
  <Pressable
    onPress={disabled ? undefined : onPress}
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    style={({ pressed }) => [
      styles.tool,
      pressed && !disabled && styles.toolPressed,
      disabled && styles.toolDisabled,
    ]}
  >
    <Text style={styles.toolIcon}>{icon}</Text>
    <Text style={styles.toolLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: colors.text, fontSize: 34, fontWeight: '900' },
  levelTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '900' },
  slotsArea: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
  progress: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
  guessArea: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  wheelArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  tool: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    minWidth: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  toolPressed: { transform: [{ scale: 0.94 }], opacity: 0.85 },
  toolDisabled: { opacity: 0.4 },
  toolIcon: { fontSize: 20, marginBottom: 2 },
  toolLabel: { color: colors.text, fontSize: 12, fontWeight: '700' },
  submitArea: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
