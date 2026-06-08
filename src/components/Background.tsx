// پس‌زمینه‌ی گرادیانیِ مشترک تمام صفحه‌ها.

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface BackgroundProps {
  children: React.ReactNode;
  /** آیا محتوا درون SafeArea قرار گیرد؟ (پیش‌فرض: بله) */
  safe?: boolean;
  style?: ViewStyle;
}

export const Background: React.FC<BackgroundProps> = ({
  children,
  safe = true,
  style,
}) => {
  const content = safe ? (
    <SafeAreaView style={[styles.fill, style]}>{children}</SafeAreaView>
  ) : (
    <View style={[styles.fill, style]}>{children}</View>
  );

  return (
    <LinearGradient
      colors={[colors.bgTop, colors.bgMid, colors.bgBottom]}
      style={styles.fill}
    >
      {content}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
