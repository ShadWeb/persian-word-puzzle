// نمایش رشته‌ی در حالِ ساختِ بازیکن (حروف انتخاب‌شده).
// با تغییرِ نوع وضعیت، رنگ پس‌زمینه عوض می‌شود.

import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

export type GuessState = 'idle' | 'correct' | 'wrong';

interface GuessDisplayProps {
  guess: string;
  state: GuessState;
  /** انیمیشن لرزش افقی (از صفحه‌ی بازی پاس داده می‌شود) */
  shake: Animated.Value;
}

export const GuessDisplay: React.FC<GuessDisplayProps> = ({
  guess,
  state,
  shake,
}) => {
  const bg =
    state === 'correct'
      ? colors.success
      : state === 'wrong'
        ? colors.danger
        : colors.surfaceStrong;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bg, transform: [{ translateX: shake }] },
      ]}
    >
      {guess.length === 0 ? (
        <Text style={styles.placeholder}>حروف را لمس کنید…</Text>
      ) : (
        <View style={styles.lettersRow}>
          {Array.from(guess).map((ch, i) => (
            <Text key={`${ch}-${i}`} style={styles.letter}>
              {ch}
            </Text>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lettersRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  letter: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '900',
    marginHorizontal: 3,
  },
  placeholder: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});
