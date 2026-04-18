import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

type TatraPanelBleedProps = PropsWithChildren<{
  className?: string;
  /** Thin primary left stripe (e.g. info / demo) */
  accent?: boolean;
}> &
  Partial<Pick<ViewProps, 'accessible' | 'accessibilityLabel' | 'accessibilityRole'>>;

/**
 * Full-width gray sheet. Place inside a screen whose main column uses horizontal padding (`px-6`);
 * this cancels that padding so the panel spans edge to edge like in the Tatra banka app.
 */
export function TatraPanelBleed({
  children,
  className,
  accent,
  accessible,
  accessibilityLabel,
  accessibilityRole,
}: TatraPanelBleedProps) {
  return (
    <View
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      className={`-mx-6 border-y border-tatra-border bg-tatra-card px-6 py-5 ${accent ? 'border-l-[3px] border-l-tatra-primary' : ''} ${className ?? ''}`}>
      {children}
    </View>
  );
}
