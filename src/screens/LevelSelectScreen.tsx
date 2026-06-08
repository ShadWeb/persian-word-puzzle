// صفحه‌ی انتخاب مرحله: شبکه‌ای از مراحل با وضعیت قفل/کامل‌شده/باز.

import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Background } from '../components/Background';
import { CoinBadge } from '../components/CoinBadge';
import { useGame } from '../context/GameContext';
import { LEVELS } from '../data/levels';
import { colors, fontSize, radius, spacing } from '../theme';
import { ScreenProps } from '../navigation/types';

export const LevelSelectScreen: React.FC<ScreenProps<'LevelSelect'>> = ({
  navigation,
}) => {
  const { save } = useGame();

  return (
    <Background>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.back}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>‹ بازگشت</Text>
        </Pressable>
        <Text style={styles.title}>انتخاب مرحله</Text>
        <CoinBadge coins={save.coins} />
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {LEVELS.map((level) => {
          const unlocked = level.id <= save.unlockedLevel;
          const completed = save.completedLevels.includes(level.id);
          return (
            <Pressable
              key={level.id}
              disabled={!unlocked}
              onPress={() =>
                navigation.navigate('Game', { levelId: level.id })
              }
              style={({ pressed }) => [
                styles.cell,
                completed && styles.cellComplete,
                !unlocked && styles.cellLocked,
                pressed && unlocked && styles.cellPressed,
              ]}
            >
              {unlocked ? (
                <>
                  <Text
                    style={[
                      styles.cellNumber,
                      completed && styles.cellNumberComplete,
                    ]}
                  >
                    {level.id.toLocaleString('fa-IR')}
                  </Text>
                  {completed && <Text style={styles.check}>✓</Text>}
                </>
              ) : (
                <Text style={styles.lock}>🔒</Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { padding: spacing.xs },
  backText: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  title: { color: colors.text, fontSize: fontSize.lg, fontWeight: '900' },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  cell: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellComplete: {
    backgroundColor: colors.success,
  },
  cellLocked: {
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  cellPressed: {
    transform: [{ scale: 0.95 }],
  },
  cellNumber: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.text,
  },
  cellNumberComplete: {
    color: colors.textDark,
  },
  check: {
    position: 'absolute',
    bottom: 6,
    color: colors.textDark,
    fontWeight: '900',
    fontSize: 12,
  },
  lock: {
    fontSize: fontSize.lg,
  },
});
