// چرخِ حروف به‌سبک آمیرزا: کاشی‌های حروف روی محیط یک دایره چیده می‌شوند،
// با لمسِ هر کاشی به انتخاب اضافه می‌شود و خطی بین کاشی‌های انتخاب‌شده رسم می‌شود.

import React, { useMemo } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { circlePositions, Point } from '../utils/array';
import { colors, fontSize } from '../theme';
import { WheelTile } from '../hooks/useLevel';

interface LetterWheelProps {
  tiles: WheelTile[];
  selected: number[];
  size: number; // قطر ناحیه‌ی چرخ (px)
  onSelect: (index: number) => void;
}

export const LetterWheel: React.FC<LetterWheelProps> = ({
  tiles,
  selected,
  size,
  onSelect,
}) => {
  const center: Point = { x: size / 2, y: size / 2 };

  // اندازه‌ی کاشی و شعاع چیدمان نسبت به اندازه‌ی چرخ
  const tileSize = Math.max(48, Math.min(72, size * 0.2));
  // وقتی فقط دو حرف داریم، شعاع کوچک‌تر تا به‌هم نچسبند ولی دور هم بمانند
  const radiusLayout = size / 2 - tileSize / 2 - 6;
  const ringRadius = tiles.length <= 2 ? radiusLayout * 0.55 : radiusLayout;

  const positions = useMemo(
    () => circlePositions(tiles.length, ringRadius, center),
    [tiles.length, ringRadius, center.x, center.y],
  );

  // نقاطِ خطِ اتصال بین کاشی‌های انتخاب‌شده (به‌ترتیب انتخاب)
  const linePoints = useMemo(() => {
    return selected
      .map((tileIndex) => {
        const pos = tiles.findIndex((t) => t.index === tileIndex);
        return pos >= 0 ? positions[pos] : undefined;
      })
      .filter((p): p is Point => p !== undefined);
  }, [selected, tiles, positions]);

  const polyline = linePoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* لایه‌ی SVG برای دایره‌ی پس‌زمینه و خطوط اتصال */}
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={center.x}
          cy={center.y}
          r={ringRadius + tileSize / 2 + 4}
          fill={colors.surface}
          stroke={colors.surfaceStrong}
          strokeWidth={2}
        />
        {linePoints.length >= 2 && (
          <Polyline
            points={polyline}
            fill="none"
            stroke={colors.primary}
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {/* نقطه‌ی مرکزِ هر کاشیِ انتخاب‌شده برای جلوه‌ی بهتر */}
        {linePoints.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={6} fill={colors.primary} />
        ))}
      </Svg>

      {/* کاشی‌های قابل‌لمس */}
      {tiles.map((tile, i) => {
        const pos = positions[i];
        if (!pos) {
          return null;
        }
        const isSelected = selected.includes(tile.index);
        const order = selected.indexOf(tile.index);
        return (
          <Pressable
            key={tile.index}
            accessibilityRole="button"
            accessibilityLabel={`حرف ${tile.letter}`}
            onPress={() => onSelect(tile.index)}
            style={({ pressed }) => [
              styles.tile,
              {
                width: tileSize,
                height: tileSize,
                borderRadius: tileSize / 2,
                left: pos.x - tileSize / 2,
                top: pos.y - tileSize / 2,
              },
              isSelected && styles.tileSelected,
              pressed && styles.tilePressed,
            ]}
          >
            <Text
              style={[
                styles.tileText,
                { fontSize: tileSize * 0.42 },
                isSelected && styles.tileTextSelected,
              ]}
            >
              {tile.letter}
            </Text>
            {isSelected && (
              <View style={styles.orderBadge}>
                <Text style={styles.orderText}>
                  {(order + 1).toLocaleString('fa-IR')}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  tile: {
    position: 'absolute',
    backgroundColor: colors.tile,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  tileSelected: {
    backgroundColor: colors.tileSelected,
    transform: [{ scale: 1.06 }],
  },
  tilePressed: {
    opacity: 0.85,
  },
  tileText: {
    fontWeight: '900',
    color: colors.tileText,
  },
  tileTextSelected: {
    color: colors.textDark,
  },
  orderBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '800',
  },
});
