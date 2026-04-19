import { useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { formatEurCurrency } from '@/lib/formatMoney';

export type BarDatum = { label: string; value: number };

type ExpenseBarChartProps = {
  data: BarDatum[];
  /** Total height including labels */
  height?: number;
  accessibilityLabel?: string;
};

const BAR_MAX_H = 112;
const PAD_X = 4;

/** Simple column chart for comparing amounts (e.g. by day). */
export function ExpenseBarChart({ data, height = 168, accessibilityLabel }: ExpenseBarChartProps) {
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.value)), [data]);

  if (data.length === 0) {
    return null;
  }

  const innerW = 280;
  const barW = Math.max(16, (innerW - PAD_X * 2) / data.length - 8);

  const a11y =
    accessibilityLabel ??
    data.map((d) => `${d.label}: ${formatEurCurrency(d.value)}`).join(', ');

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={a11y}
      className="w-full items-center px-2">
      <Svg width={innerW} height={height}>
        <Defs>
          <LinearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#009fe3" stopOpacity={1} />
            <Stop offset="1" stopColor="#009fe3" stopOpacity={0.45} />
          </LinearGradient>
        </Defs>
        {data.map((d, i) => {
          const h = Math.max(6, (d.value / max) * BAR_MAX_H);
          const x = PAD_X + i * ((innerW - PAD_X * 2) / data.length) + ((innerW - PAD_X * 2) / data.length - barW) / 2;
          const y = BAR_MAX_H - h + 8;
          return (
            <Rect
              key={`${d.label}-${i}`}
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={8}
              ry={8}
              fill="url(#barFill)"
            />
          );
        })}
      </Svg>
      <View className="-mt-1 w-full max-w-[280px] flex-row justify-between px-1">
        {data.map((d) => (
          <View key={d.label} className="min-w-0 flex-1 items-center px-0.5">
            <Text className="text-center font-sans text-[11px] font-semibold tabular-nums text-tatra-foreground" numberOfLines={1}>
              {formatEurCurrency(d.value)}
            </Text>
            <Text className="mt-0.5 text-center font-sans text-[10px] text-tatra-muted" numberOfLines={1}>
              {d.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
