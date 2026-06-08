// صفحه‌ی پیروزی: پس از تکمیل یک مرحله نمایش داده می‌شود.
// مقدار سکه‌ی پاداش، رفتن به مرحله‌ی بعد، بازی دوباره و بازگشت به خانه.

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Background } from '../components/Background';
import { PrimaryButton } from '../components/PrimaryButton';
import { CoinBadge } from '../components/CoinBadge';
import { useGame } from '../context/GameContext';
import { colors, fontSize, radius, spacing } from '../theme';
import { ScreenProps } from '../navigation/types';
import { TOTAL_LEVELS } from '../data/levels';

export const VictoryScreen: React.FC<ScreenProps<'Victory'>> = ({
  navigation,
  route,
}) => {
  const { levelId, reward } = route.params;
  const { save, setCurrentLevel } = useGame();

  const hasNext = levelId < TOTAL_LEVELS;
  const nextLevel = levelId + 1;

  // انیمیشن ورود: بزرگ‌شدن مدالِ پیروزی و محوشدنِ تدریجی.
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const coinPop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(250),
      Animated.spring(coinPop, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [coinPop, opacity, scale]);

  const goNext = () => {
    setCurrentLevel(nextLevel);
    navigation.replace('Game', { levelId: nextLevel });
  };

  const replay = () => {
    navigation.replace('Game', { levelId });
  };

  const goHome = () => {
    navigation.popToTop();
  };

  return (
    <Background>
      <View style={styles.topBar}>
        <CoinBadge coins={save.coins} />
      </View>

      <View style={styles.center}>
        <Animated.View
          style={[styles.medal, { opacity, transform: [{ scale }] }]}
        >
          <Text style={styles.medalEmoji}>🏆</Text>
        </Animated.View>

        <Animated.Text style={[styles.congrats, { opacity }]}>
          آفرین!
        </Animated.Text>
        <Animated.Text style={[styles.levelDone, { opacity }]}>
          مرحله‌ی {levelId.toLocaleString('fa-IR')} کامل شد
        </Animated.Text>

        <Animated.View
          style={[
            styles.rewardCard,
            {
              opacity: coinPop,
              transform: [
                {
                  scale: coinPop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.rewardLabel}>سکه‌ی پاداش</Text>
          <Text style={styles.rewardValue}>
            + {reward.toLocaleString('fa-IR')}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        {hasNext ? (
          <PrimaryButton
            label={`مرحله‌ی بعد (${nextLevel.toLocaleString('fa-IR')})`}
            icon={<Text style={styles.btnIcon}>▶</Text>}
            onPress={goNext}
          />
        ) : (
          <View style={styles.finishedBox}>
            <Text style={styles.finishedText}>
              🎉 همه‌ی مرحله‌ها را تمام کردی!
            </Text>
          </View>
        )}
        <PrimaryButton label="بازی دوباره" variant="secondary" onPress={replay} />
        <PrimaryButton label="خانه" variant="ghost" onPress={goHome} />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medal: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  medalEmoji: {
    fontSize: 72,
  },
  congrats: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.primary,
  },
  levelDone: {
    fontSize: fontSize.lg,
    color: colors.text,
    marginTop: spacing.xs,
  },
  rewardCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceStrong,
  },
  rewardLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  rewardValue: {
    color: colors.coin,
    fontSize: fontSize.xl,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  btnIcon: {
    fontSize: fontSize.md,
    color: colors.textDark,
  },
  finishedBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.success,
  },
  finishedText: {
    color: colors.success,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
