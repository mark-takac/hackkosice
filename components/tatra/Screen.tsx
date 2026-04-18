import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  keyboard?: boolean;
}>;

export function Screen({ children, scroll, keyboard }: ScreenProps) {
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
      {wrapped}
    </SafeAreaView>
  );
}
