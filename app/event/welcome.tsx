import { Link, router } from 'expo-router';
import { Link2, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { TatraPrimaryButton } from '@/components/tatra/buttons';
import { Screen } from '@/components/tatra/Screen';
import { BrandMark, MutedText, SectionTitle } from '@/components/tatra/Typography';
import { hapticLight } from '@/lib/haptics';
import { useEventFlow } from '@/providers/EventFlowContext';

export default function WelcomeScreen() {
  const { userFirstName, seedJoinedFromCode } = useEventFlow();
  const [code, setCode] = useState('');
  const [codeFocused, setCodeFocused] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  const onCodeChange = (text: string) => {
    setCode(text);
    if (codeError) setCodeError(null);
  };

  const onJoin = () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setCodeError('Zadaj kód eventu, ktorý si dostal od organizátora.');
      return;
    }
    setCodeError(null);
    seedJoinedFromCode(trimmed);
    router.replace('/event/dashboard');
  };

  const codeBorderClass = codeError
    ? 'border-tatra-destructive'
    : codeFocused
      ? 'border-tatra-primary'
      : 'border-tatra-border';

  return (
    <Screen scroll keyboard>
      <View className="flex-1 px-6 pb-8 pt-2">
        <View className="items-center pt-2">
          <BrandMark />
        </View>

        <View className="mt-8 gap-3">
          <SectionTitle>
            Ahoj {userFirstName}, čo máš v pláne?{' '}
          </SectionTitle>
          <MutedText className="text-[15px] leading-6">
            Vytvor spoločný budget alebo sa pripoj k existujúcemu eventu.
          </MutedText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Vytvoriť nový event so zdieľaným budgetom"
          onPress={() => {
            hapticLight();
            router.push('/event/setup');
          }}
          className="-mx-6 mt-10 bg-tatra-cta px-6 py-5 active:opacity-95">
          <View className="flex-row items-center gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-black/20">
              <Plus color="#fff" size={32} strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-tatra-cta-foreground">Vytvoriť event</Text>
              <Text className="mt-1 text-base leading-5 text-white/95">
                Zdieľaný budget a virtuálna karta pre celú skupinu.
              </Text>
            </View>
          </View>
        </Pressable>

        <View className="mt-12 w-full">
          <Text className="text-base font-semibold text-tatra-foreground">Pripojiť sa k eventu</Text>
          <MutedText className="mt-1 text-sm leading-5">
            Zadaj kód, ktorý ti poslal organizátor (mail alebo správa).
          </MutedText>

          <Text className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-tatra-muted">
            Kód eventu
          </Text>
          <View className={`w-full rounded-sm border bg-tatra-elevated ${codeBorderClass}`}>
            <View className="flex-row items-stretch">
              <View className="justify-center border-r border-tatra-border bg-tatra-card/60 px-3.5">
                <Link2 color={codeFocused ? '#009fe3' : '#71717a'} size={20} />
              </View>
              <TextInput
                value={code}
                onChangeText={onCodeChange}
                onFocus={() => setCodeFocused(true)}
                onBlur={() => setCodeFocused(false)}
                placeholder="Napr. TB-A1B2"
                placeholderTextColor="#71717a"
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={onJoin}
                accessibilityLabel="Kód eventu z pozvánky"
                selectionColor="#009fe3"
                underlineColorAndroid="transparent"
                className="min-h-[52px] flex-1 px-4 py-3 text-base text-tatra-foreground"
              />
            </View>
          </View>
          {codeError ? (
            <Text accessibilityRole="alert" className="mt-2 text-sm text-tatra-destructive">
              {codeError}
            </Text>
          ) : null}

          <View className="mt-4 w-full">
            <TatraPrimaryButton onPress={onJoin}>Pripojiť sa</TatraPrimaryButton>
          </View>
        </View>

        <View className="mt-12 border-t border-tatra-border/80 pt-8">
          <MutedText className="text-center text-sm leading-6">
            Organizátor ti môže poslať odkaz v správe — otvor ho v prehliadači alebo skopíruj kód sem.
          </MutedText>
          <Link href="/(tabs)" asChild>
            <Pressable accessibilityRole="link" className="mt-5 py-2 active:opacity-80">
              <Text className="text-center text-xs text-tatra-muted-foreground">Pre vývojárov: Expo šablóna</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
