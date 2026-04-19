import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

type Slice = { color: string; value: number };

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export type DonutChartProps = {
  size: number;
  strokeWidth: number;
  slices: Slice[];
  /** Muted track behind the ring */
  showTrack?: boolean;
  /** Degrees of gap between segments (only when multiple positive slices) */
  segmentGapDeg?: number;
  /** Small title above center value (e.g. „Spolu“) */
  centerTitle?: string;
  centerValue?: string;
  /** Or pass custom center content (overrides title/value) */
  center?: ReactNode;
  accessibilityLabel?: string;
};

/** Ring chart: each slice is an arc segment (values are relative weights). */
export function DonutChart({
  size,
  strokeWidth,
  slices,
  showTrack = true,
  segmentGapDeg = 2.25,
  centerTitle,
  centerValue,
  center,
  accessibilityLabel,
}: DonutChartProps) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;

  const positiveCount = slices.filter((s) => s.value > 0).length;
  const gapEach = positiveCount > 1 ? segmentGapDeg : 0;
  const totalGap = positiveCount * gapEach;
  const sweepBudget = 360 - totalGap;

  let angle = 0;
  const paths: { d: string; color: string }[] = [];
  for (const sl of slices) {
    if (sl.value <= 0) continue;
    let sweep = (sl.value / total) * sweepBudget;
    if (positiveCount === 1 && sweep >= 359) sweep = 359.99;
    if (sweep > 0.08) {
      const d = arcPath(cx, cy, r, angle, angle + sweep);
      paths.push({ d, color: sl.color });
    }
    angle += sweep + gapEach;
  }

  const trackColor = '#1e2a3a';
  const innerPad = strokeWidth / 2 + 10;
  const hasCenter = Boolean(center) || Boolean(centerValue) || Boolean(centerTitle);

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={
        accessibilityLabel ??
        (centerValue ? `Graf, stredová hodnota ${centerValue}` : 'Kruhový graf výdavkov')
      }>
      <Svg width={size} height={size}>
        {showTrack ? (
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
        ) : null}
        <G>
          {paths.map((p, i) => (
            <Path
              key={i}
              d={p.d}
              stroke={p.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </G>
      </Svg>
      {hasCenter ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: size,
            height: size,
            paddingHorizontal: innerPad,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {center ? (
            center
          ) : (
            <View className="items-center">
              {centerTitle ? (
                <Text className="text-center text-[11px] font-semibold uppercase tracking-wider text-tatra-muted">
                  {centerTitle}
                </Text>
              ) : null}
              {centerValue ? (
                <Text
                  className="mt-0.5 text-center text-lg font-bold tabular-nums tracking-tight text-tatra-foreground"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}>
                  {centerValue}
                </Text>
              ) : null}
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}
