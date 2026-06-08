// نقطه‌ی ریشه‌ی برنامه: راه‌اندازی RTL، فراهم‌کردن کانتکست‌ها و نمایش ناوبری.

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider, useGame } from './src/context/GameContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { setupRTL } from './src/utils/persian';
import { colors, fontSize, spacing } from './src/theme';

// راست‌چین‌سازی باید پیش از رندر انجام شود.
setupRTL();

/**
 * تا زمانی که داده‌ها از حافظه بارگذاری نشده‌اند یک صفحه‌ی بارگذاری نشان می‌دهیم.
 * این کار از پرش (flash) محتوای پیش‌فرض جلوگیری می‌کند.
 */
const Gate: React.FC = () => {
  const { ready } = useGame();

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>در حال بارگذاری…</Text>
      </View>
    );
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <GameProvider>
        <Gate />
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgMid,
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});
