import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { spacing, typography, useTheme } from '../../theme';
import type { CategorySpendingSlice } from '../../utils/categorySpending';
import { formatCurrency } from '../../utils/currency';

type CategorySpendingChartProps = {
  slices: CategorySpendingSlice[];
};

const CHART_SIZE = 168;
const CHART_RADIUS = CHART_SIZE / 2;
const INNER_RADIUS = 52;

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    centerX,
    centerY,
    'L',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'Z',
  ].join(' ');
}

export function CategorySpendingChart({ slices }: CategorySpendingChartProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.md,
          marginBottom: spacing.lg,
        },
        emptyText: {
          ...typography.body,
          color: colors.textMuted,
          textAlign: 'center',
          paddingVertical: spacing.lg,
        },
        content: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        legend: {
          flex: 1,
          marginLeft: spacing.md,
        },
        legendRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.xs,
        },
        swatch: {
          width: 10,
          height: 10,
          borderRadius: 5,
          marginRight: spacing.sm,
        },
        legendLabel: {
          ...typography.caption,
          color: colors.text,
          flex: 1,
        },
        legendAmount: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '600',
        },
      }),
    [colors],
  );

  if (slices.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No expense data this month.</Text>
      </View>
    );
  }

  let currentAngle = 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <G>
            {slices.map((slice) => {
              const sweep = (slice.percentage / 100) * 360;
              const path = describeArc(
                CHART_RADIUS,
                CHART_RADIUS,
                CHART_RADIUS,
                currentAngle,
                currentAngle + sweep,
              );
              currentAngle += sweep;

              return (
                <Path
                  key={slice.categoryId}
                  d={path}
                  fill={slice.color}
                  opacity={0.92}
                />
              );
            })}
            <Path
              d={`M ${CHART_RADIUS} ${CHART_RADIUS - INNER_RADIUS} A ${INNER_RADIUS} ${INNER_RADIUS} 0 1 1 ${CHART_RADIUS - 0.01} ${CHART_RADIUS - INNER_RADIUS} Z`}
              fill={colors.surface}
            />
          </G>
        </Svg>

        <View style={styles.legend}>
          {slices.map((slice) => (
            <View key={slice.categoryId} style={styles.legendRow}>
              <View style={[styles.swatch, { backgroundColor: slice.color }]} />
              <Text style={styles.legendLabel} numberOfLines={1}>
                {slice.name}
              </Text>
              <Text style={styles.legendAmount}>{formatCurrency(slice.amount)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
