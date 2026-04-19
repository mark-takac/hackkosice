import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { Copy } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { TatraGhostButton, TatraPrimaryButton } from '@/components/tatra/buttons';
import { Screen } from '@/components/tatra/Screen';
import { TatraPanelBleed } from '@/components/tatra/TatraPanelBleed';
import { MutedText } from '@/components/tatra/Typography';
import { useEventFlow } from '@/providers/EventFlowContext';

function buildInviteLink(code: string) {
  return `https://event.tatrabanka.sk/j/${encodeURIComponent(code)}`;
}

export default function InviteScreen() {
  const { eventName, inviteCode } = useEventFlow();
  const link = buildInviteLink(inviteCode || 'PREVIEW');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const copyLink = async () => {
    await Clipboard.setStringAsync(link);
    setCopyFeedback('Odkaz je v schránke.');
  };

  const skip = () => {
    router.push('/event/card-success');
  };

  return (
    <Screen scroll>
      <View className="flex-1 px-6 pt-4">
        <TatraPanelBleed className="mt-6 py-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-tatra-primary/20">
              <Text className="text-lg font-bold text-tatra-primary">{eventName.slice(0, 1) || 'E'}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-tatra-foreground" numberOfLines={1}>
                {eventName || 'Event'}
              </Text>
              <MutedText className="text-sm">Kód: {inviteCode || '—'}</MutedText>
            </View>
          </View>
        </TatraPanelBleed>

        <View className="mt-8 gap-3">
          <MutedText>
            Zložte sa na spoločný budget a nakúpte všetko, čo potrebujete — platby kartou sú prehľadné pre
            celú skupinu.
          </MutedText>
        </View>

        <View className="mt-10 gap-3">
          <TatraPrimaryButton onPress={copyLink}>
            <View className="flex-row items-center justify-center gap-2">
              <Copy color="#fff" size={22} />
              <Text className="text-center text-base font-semibold text-white">Skopíruj link</Text>
            </View>
          </TatraPrimaryButton>
          {copyFeedback ? (
            <Text accessibilityRole="alert" className="text-center text-sm text-tatra-success">
              {copyFeedback}
            </Text>
          ) : null}
        </View>

        <TatraGhostButton onPress={skip} className="mt-6">
          Možno neskôr
        </TatraGhostButton>
      </View>
    </Screen>
  );
}
