import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

export function SectionTitle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <Text className={`font-sans text-2xl font-bold text-tatra-foreground ${className ?? ''}`}>{children}</Text>
  );
}

export function MutedText({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <Text className={`font-sans text-base text-tatra-muted ${className ?? ''}`}>{children}</Text>;
}

type BrandMarkProps = {
  className?: string;
  /** Slightly smaller type for the app bar. */
  compact?: boolean;
};

export function BrandMark({ className, compact }: BrandMarkProps) {
  const line = compact ? 'text-[9px] tracking-[0.16em]' : 'text-[11px] tracking-[0.2em]';
  const line2 = compact ? 'text-[9px] tracking-[0.2em]' : 'text-[11px] tracking-[0.25em]';
  return (
    <View className={`items-center ${className ?? ''}`}>
      <Text className={`font-sans font-semibold uppercase text-tatra-muted-foreground ${line}`}>tatra</Text>
      <Text className={`-mt-0.5 font-sans font-semibold uppercase text-tatra-muted ${line2}`}>banka</Text>
    </View>
  );
}
