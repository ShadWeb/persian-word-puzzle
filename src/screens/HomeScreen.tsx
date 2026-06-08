// صفحه‌ی خانه: شروع بازی، ادامه، تنظیمات، نمایش سکه و عنوانِ زیبا.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Background } from '../components/Background';
import { PrimaryButton } from '../components/PrimaryButton';
import { CoinBadge } from '../components/CoinBadge';
import { useGame } from '../context/GameContext';
import { colors, fontSize, spacing } from '../theme';
import { ScreenProps } from '../navigation/types';
import { TOTAL_LEVELS } from '../data/levels';

export const HomeScreen: React.FC<ScreenProps<'Home'>> = ({ navigation }) => {
  const { save, ready } = useGame();

  const hasProgress = save.completedLevels.length > 0 || save.currentLevel > 1;
  const continueLevel = Math.min(save.currentLevel, TOTAL_LEVELS);

  return (
    <Background>
      <View style={styles.topBar}>
        <CoinBadge coins={save.coins} />
      </View>

      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>آ</Text>
        </View>
        <Text style={styles.title}>آمیرزا</Text>
        <Text style={styles.subtitle}>بازیِ واژه‌سازیِ فارسی</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="شروع بازی"
          icon={<Text style={styles.btnIcon}>▶</Text>}
          onPress={() => navigation.navigate('Game', { levelId: 1 })}
        />
        {hasProgress && (
          <PrimaryButton
            label={`ادامه (مرحله ${continueLevel.toLocaleString('fa-IR')})`}
            variant="secondary"
            onPress={() =>
              navigation.navigate('Game', { levelId: continueLevel })
            }
          />
        )}
        <PrimaryButton
          label="انتخاب مرحله"
          variant="secondary"
          onPress={() => navigation.navigate('LevelSelect')}
        />
        <PrimaryButton
          label="تنظیمات"
          variant="ghost"
          icon={<Text style={styles.btnIcon}>⚙︎</Text>}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {ready
            ? `${save.completedLevels.length.toLocaleString(
                'fa-IR',
              )} از ${TOTAL_LEVELS.toLocaleString('fa-IR')} مرحله کامل شده`
            : 'در حال بارگذاری…'}
        </Text>
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
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  logoText: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.textDark,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  btnIcon: {
    fontSize: fontSize.md,
    color: colors.textDark,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
