import { router } from 'expo-router';
import { Upload } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { TatraPrimaryButton } from '@/components/tatra/buttons';
import { Screen } from '@/components/tatra/Screen';
import { TatraPanelBleed } from '@/components/tatra/TatraPanelBleed';
import { MutedText } from '@/components/tatra/Typography';
import { useEventFlow } from '@/providers/EventFlowContext';

export default function SetupScreen() {
  const { startEventDraft } = useEventFlow();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const onNameChange = (text: string) => {
    setName(text);
    if (nameError) setNameError(null);
  };

  const onContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Zadaj názov eventu.');
      return;
    }
    setNameError(null);
    startEventDraft(trimmed);
    router.push('/event/invite');
  };

  return (
    <Screen scroll keyboard>
      <View className="flex-1 px-6 pt-4">
        <View className="mt-8 gap-2">
          <MutedText>Doplň základné údaje. Ikona je voliteľná.</MutedText>
        </View>

        <TatraPanelBleed className="mt-8 gap-8 py-6">
          <View>
            <Text className="mb-3 text-sm font-medium text-tatra-muted">Ikona eventu (nepovinné)</Text>
            <Pressable
              accessibilityRole="button"
              className="h-36 items-center justify-center border-2 border-dashed border-tatra-border bg-tatra-elevated active:opacity-90">
              <Upload color="#71717a" size={40} />
              <MutedText className="mt-2 text-sm">Nahrať obrázok</MutedText>
            </Pressable>
          </View>
          <View className="border-t border-tatra-border pt-6">
            <Text className="mb-3 text-sm font-medium text-tatra-muted">Názov eventu</Text>
            <TextInput
              value={name}
              onChangeText={onNameChange}
              placeholder="napr. Výlet do Tatier"
              placeholderTextColor="#71717a"
              className={`border-b py-3 text-lg text-tatra-foreground ${
                nameError ? 'border-tatra-destructive' : 'border-tatra-border'
              }`}
            />
            {nameError ? (
              <Text accessibilityRole="alert" className="mt-2 text-sm text-tatra-destructive">
                {nameError}
              </Text>
            ) : null}
          </View>
        </TatraPanelBleed>

        <View className="mt-16 gap-3 pb-4">
          <TatraPrimaryButton onPress={onContinue}>Pokračovať</TatraPrimaryButton>
        </View>
      </View>
    </Screen>
  );
}
