import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { TatraPrimaryButton, TatraSecondaryButton } from '@/components/tatra/buttons';
import { Screen } from '@/components/tatra/Screen';
import { TatraPanelBleed } from '@/components/tatra/TatraPanelBleed';
import { BrandMark, MutedText, SectionTitle } from '@/components/tatra/Typography';

export default function WalletScreen() {
  const goDash = () => {
    router.replace('/event/dashboard');
  };

  const [showDemoNote, setShowDemoNote] = useState(false);

  const onYes = () => {
    setShowDemoNote(true);
  };

  return (
    <Screen scroll>
      <View className="flex-1 justify-center px-6 py-12">
        <BrandMark />
        <TatraPanelBleed className="mt-10 py-8">
          <SectionTitle>Google Peňaženka</SectionTitle>
          <MutedText className="mt-3">Chceš pridať kartu do Google Peňaženky a platiť telefonom?</MutedText>
        </TatraPanelBleed>
        {showDemoNote ? (
          <MutedText className="mt-6 text-center text-sm leading-5">
            V demo verzii len simulujeme pridanie karty. V reálnej aplikácii by nasledovalo prepojenie na Google
            Wallet.
          </MutedText>
        ) : null}
        <View className="mt-10 gap-3">
          {showDemoNote ? (
            <TatraPrimaryButton onPress={goDash}>Pokračovať</TatraPrimaryButton>
          ) : (
            <TatraPrimaryButton onPress={onYes}>Áno</TatraPrimaryButton>
          )}
          <TatraSecondaryButton onPress={goDash}>Možno neskôr</TatraSecondaryButton>
        </View>
      </View>
    </Screen>
  );
}
