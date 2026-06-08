// نمایشِ واژه‌های مرحله به‌صورت «خانه‌های حروف».
// واژه‌ی یافت‌شده کامل نمایش داده می‌شود؛ در غیر این صورت فقط حروفِ
// آشکارشده با راهنما دیده می‌شوند و بقیه خالی می‌مانند.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

interface WordSlotsProps {
  words: string[];
  foundWords: string[];
  /** برای هر واژه، تعداد حروفِ آشکارشده با راهنما */
  revealed: Record<string, number>;
}

const SlotRow: React.FC<{
  word: string;
  found: boolean;
  revealedCount: number;
}> = ({ word, found, revealedCount }) => {
  const chars = Array.from(word);
  return (
    <View style={styles.wordRow}>
      {chars.map((ch, i) => {
        const show = found || i < revealedCount;
        return (
          <View
            key={`${word}-${i}`}
            style={[
              styles.slot,
              found && styles.slotFound,
              !found && show && styles.slotHint,
            ]}
          >
            <Text style={[styles.slotText, found && styles.slotTextFound]}>
              {show ? ch : ''}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export const WordSlots: React.FC<WordSlotsProps> = ({
  words,
  foundWords,
  revealed,
}) => {
  // مرتب‌سازی بر اساس طول برای ظاهری منظم
  const sorted = [...words].sort((a, b) => a.length - b.length);
  return (
    <View style={styles.container}>
      {sorted.map((word) => (
        <SlotRow
          key={word}
          word={word}
          found={foundWords.includes(word)}
          revealedCount={revealed[word] ?? 0}
        />
      ))}
    </View>
  );
};

const SLOT = 38;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  wordRow: {
    flexDirection: 'row-reverse',
    gap: 4,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.xs,
  },
  slot: {
    width: SLOT,
    height: SLOT,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFound: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  slotHint: {
    borderColor: colors.primary,
  },
  slotText: {
    fontSize: fontSize.md,
    fontWeight: '900',
    color: colors.text,
  },
  slotTextFound: {
    color: colors.textDark,
  },
});
