// صفحه‌ی تنظیمات: روشن/خاموش‌کردن صدا و لرزش، بازنشانیِ پیشرفت و نمایش اطلاعات.

import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Background } from '../components/Background';
import { PrimaryButton } from '../components/PrimaryButton';
import { CoinBadge } from '../components/CoinBadge';
import { useGame } from '../context/GameContext';
import { colors, fontSize, radius, spacing } from '../theme';
import { ScreenProps } from '../navigation/types';
import { TOTAL_LEVELS } from '../data/levels';

const APP_VERSION = '۱٫۰٫۰';

export const SettingsScreen: React.FC<ScreenProps<'Settings'>> = ({
  navigation,
}) => {
  const {
    settings,
    save,
    toggleSound,
    toggleHaptics,
    resetProgress,
    haptic,
  } = useGame();

  const confirmReset = () => {
    Alert.alert(
      'بازنشانی پیشرفت',
      'تمام مرحله‌ها، سکه‌ها و پیشرفت شما پاک می‌شود. مطمئن هستید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'پاک کن',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            haptic('success');
            navigation.popToTop();
          },
        },
      ],
    );
  };

  return (
    <Background>
      <View style={styles.header}>
        <PrimaryButton
          label="بازگشت"
          variant="ghost"
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>تنظیمات</Text>
        <CoinBadge coins={save.coins} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <SettingRow
            label="جلوه‌های صوتی"
            value={settings.soundEnabled}
            onToggle={toggleSound}
          />
          <View style={styles.divider} />
          <SettingRow
            label="لرزش (هپتیک)"
            value={settings.hapticsEnabled}
            onToggle={toggleHaptics}
          />
        </View>

        <View style={styles.card}>
          <InfoRow
            label="مرحله‌های کامل‌شده"
            value={`${save.completedLevels.length.toLocaleString(
              'fa-IR',
            )} از ${TOTAL_LEVELS.toLocaleString('fa-IR')}`}
          />
          <View style={styles.divider} />
          <InfoRow
            label="موجودی سکه"
            value={save.coins.toLocaleString('fa-IR')}
          />
          <View style={styles.divider} />
          <InfoRow label="نسخه" value={APP_VERSION} />
        </View>

        <PrimaryButton
          label="بازنشانی پیشرفت"
          variant="secondary"
          onPress={confirmReset}
          style={styles.resetBtn}
        />
        <Text style={styles.note}>
          ساخته‌شده با React Native و Expo
        </Text>
      </ScrollView>
    </Background>
  );
};

const SettingRow: React.FC<{
  label: string;
  value: boolean;
  onToggle: () => void;
}> = ({ label, value, onToggle }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: colors.surfaceStrong, true: colors.primaryDark }}
      thumbColor={
        Platform.OS === 'android'
          ? value
            ? colors.primary
            : '#f4f3f4'
          : undefined
      }
      ios_backgroundColor={colors.surfaceStrong}
    />
  </View>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backBtn: {
    paddingHorizontal: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceStrong,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  rowLabel: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  rowValue: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.surfaceStrong,
  },
  resetBtn: {
    marginTop: spacing.sm,
  },
  note: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.md,
  },
});
