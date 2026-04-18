import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

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

type DonutChartProps = {
  size: number;
  strokeWidth: number;
  slices: Slice[];
};

/** Ring chart: each slice is an arc segment (values are relative weights). */
export function DonutChart({ size, strokeWidth, slices }: DonutChartProps) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;

  let angle = 0;
  const paths: { d: string; color: string }[] = [];
  for (const sl of slices) {
    const sweep = (sl.value / total) * 360;
    if (sweep > 0.05) {
      const d = arcPath(cx, cy, r, angle, angle + sweep);
      paths.push({ d, color: sl.color });
    }
    angle += sweep;
  }

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G>
          {paths.map((p, i) => (
            <Path
              key={i}
              d={p.d}
              stroke={p.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="butt"
            />
          ))}
        </G>
      </Svg>
    </View>
  );
}
