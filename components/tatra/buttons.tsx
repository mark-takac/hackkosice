import type { PropsWithChildren, ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { hapticLight } from '@/lib/haptics';

type ButtonProps = PropsWithChildren<{
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}>;

function isStringChild(children: ReactNode) {
  return typeof children === 'string' || typeof children === 'number';
}

export function TatraPrimaryButton({
  children,
  onPress,
  disabled,
  loading,
  className,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={() => {
        if (disabled || loading) return;
        hapticLight();
        onPress?.();
      }}
      className={`rounded-xl bg-tatra-primary py-4 active:opacity-90 ${disabled || loading ? 'opacity-50' : ''} ${className ?? ''}`}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : isStringChild(children) ? (
        <Text className="text-center text-base font-semibold text-tatra-primary-foreground">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function TatraSecondaryButton({
  children,
  onPress,
  disabled,
  className,
}: Omit<ButtonProps, 'loading'>) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        if (disabled) return;
        hapticLight();
        onPress?.();
      }}
      className={`rounded-xl bg-tatra-elevated py-4 active:opacity-90 ${disabled ? 'opacity-50' : ''} ${className ?? ''}`}>
      {isStringChild(children) ? (
        <Text className="text-center text-base font-semibold text-tatra-secondary-foreground">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function TatraGhostButton({
  children,
  onPress,
  className,
}: Omit<ButtonProps, 'disabled' | 'loading'>) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        hapticLight();
        onPress?.();
      }}
      className={`py-3 active:opacity-80 ${className ?? ''}`}>
      <Text className="text-center text-base font-medium text-tatra-primary">{children}</Text>
    </Pressable>
  );
}
