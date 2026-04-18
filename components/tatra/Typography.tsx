import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

export function SectionTitle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <Text className={`text-2xl font-bold text-tatra-foreground ${className ?? ''}`}>{children}</Text>
  );
}

export function MutedText({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <Text className={`text-base text-tatra-muted ${className ?? ''}`}>{children}</Text>;
}

export function BrandMark() {
  return (
    <View className="items-center">
      <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-tatra-muted-foreground">tatra</Text>
      <Text className="-mt-0.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-tatra-muted">
        banka
      </Text>
    </View>
  );
}
