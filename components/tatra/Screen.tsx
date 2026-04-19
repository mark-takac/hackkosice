import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppRouteHeader } from '@/components/tatra/AppRouteHeader';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  keyboard?: boolean;
  /** Overrides the route-derived title in the header and on web `document.title`. */
  headerTitle?: string;
  /** Hide the global route header for this screen. */
  hideRouteHeader?: boolean;
  /** When true, the header never shows back (e.g. welcome). */
  headerHideBack?: boolean;
}>;

export function Screen({
  children,
  scroll,
  keyboard,
  headerTitle,
  hideRouteHeader,
  headerHideBack,
}: ScreenProps) {
  const body = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1">{children}</View>
  );

  const wrapped =
    keyboard ? (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        {body}
      </KeyboardAvoidingView>
    ) : (
      body
    );

  return (
    <SafeAreaView className="flex-1 bg-tatra-background" edges={['top', 'left', 'right']}>
      {hideRouteHeader ? null : (
        <AppRouteHeader titleOverride={headerTitle} headerHideBack={headerHideBack} />
      )}
      {wrapped}
    </SafeAreaView>
  );
}
