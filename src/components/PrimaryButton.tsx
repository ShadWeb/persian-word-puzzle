// دکمه‌ی قابل‌استفاده‌ی مجدد با سه نوع ظاهری.

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fontSize, radius, shadow, spacing } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  /** آیکون اختیاری (مثلاً یک Text با ایموجی) سمت ابتدای دکمه */
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={textColor[variant]} />
        ) : (
          <>
            {icon ? <View style={styles.icon}>{icon}</View> : null}
            <Text style={[styles.label, { color: textColor[variant] }]}>
              {label}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
};

const textColor: Record<Variant, string> = {
  primary: colors.textDark,
  secondary: colors.text,
  ghost: colors.text,
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.primary, ...shadow.card },
  secondary: { backgroundColor: colors.surfaceStrong },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.surfaceStrong,
  },
};

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row-reverse', // راست‌به‌چپ: آیکون سمت راست متن
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { marginStart: spacing.sm },
  label: {
    fontSize: fontSize.md,
    fontWeight: '800',
    textAlign: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
  disabled: { opacity: 0.45 },
});
