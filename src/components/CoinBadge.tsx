// نشانِ نمایش موجودی سکه.

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

interface CoinBadgeProps {
  coins: number;
  style?: ViewStyle;
}

export const CoinBadge: React.FC<CoinBadgeProps> = ({ coins, style }) => (
  <View style={[styles.container, style]} accessibilityLabel={`موجودی ${coins} سکه`}>
    <View style={styles.coin}>
      <Text style={styles.coinSymbol}>؟</Text>
    </View>
    <Text style={styles.amount}>{coins.toLocaleString('fa-IR')}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.surfaceStrong,
  },
  coin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.coin,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: spacing.sm,
  },
  coinSymbol: {
    color: colors.textDark,
    fontWeight: '900',
    fontSize: fontSize.sm,
  },
  amount: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '800',
  },
});
