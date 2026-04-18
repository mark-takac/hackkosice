import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { TatraPrimaryButton } from '@/components/tatra/buttons';
import { Screen } from '@/components/tatra/Screen';
import { TatraPanelBleed } from '@/components/tatra/TatraPanelBleed';
import { BrandMark, MutedText, SectionTitle } from '@/components/tatra/Typography';
import { useEventFlow } from '@/providers/EventFlowContext';

/** Matches `tailwind.config.js` — `tatra.primary` */
const TATRA_PRIMARY = '#009fe3';

const CARD_READY_DELAY_MS = 1200;

const CARD_W = 320;
const CARD_H = 200;

function CardReadyIcon({ ready }: { ready: boolean }) {
  const checkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!ready) {
      checkOpacity.setValue(0);
      return;
    }
    Animated.timing(checkOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [ready, checkOpacity]);

  return (
    <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-tatra-border bg-tatra-card">
      {!ready ? (
        <ActivityIndicator size="large" color={TATRA_PRIMARY} />
      ) : (
        <Animated.View style={{ opacity: checkOpacity }}>
          <Check color={TATRA_PRIMARY} size={36} strokeWidth={2.5} />
        </Animated.View>
      )}
    </View>
  );
}

function VirtualCardSkeleton() {
  return (
    <View className="items-center shadow-2xl">
      <View
        className="overflow-hidden rounded-2xl border border-tatra-border bg-tatra-elevated p-5"
        style={{ width: CARD_W, height: CARD_H }}>
        <View className="flex-1 justify-between">
          <View className="flex-row items-start justify-between">
            <View className="gap-2">
              <View className="h-2.5 w-24 rounded bg-tatra-border" />
              <View className="h-5 w-36 rounded-md bg-tatra-border/80" />
            </View>
            <View className="h-2.5 w-16 rounded bg-tatra-border/70" />
          </View>
          <View className="h-6 w-full max-w-[220px] rounded-md bg-tatra-border/70" />
        </View>
      </View>
    </View>
  );
}

function VirtualCardVisual() {
  return (
    <View className="items-center shadow-2xl">
      <View className="overflow-hidden rounded-2xl" style={{ width: CARD_W, height: CARD_H }}>
        <Svg width={CARD_W} height={CARD_H}>
          <Defs>
            <LinearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#f5e6a8" />
              <Stop offset="0.35" stopColor="#d4af37" />
              <Stop offset="0.7" stopColor="#8a7020" />
              <Stop offset="1" stopColor="#c9a227" />
            </LinearGradient>
          </Defs>
          <Rect width={CARD_W} height={CARD_H} fill="url(#gold)" rx={16} />
        </Svg>
        <View className="absolute inset-0 justify-between p-5">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-xs font-semibold uppercase tracking-widest text-black/70">Virtuálna karta</Text>
              <Text className="mt-1 text-lg font-bold text-black">FAMILY CARD</Text>
            </View>
            <Text className="text-[10px] font-semibold uppercase tracking-widest text-black/55">Tatra banka</Text>
          </View>
          <Text className="font-mono text-lg tracking-widest text-black">•••• •••• •••• 4567</Text>
        </View>
      </View>
    </View>
  );
}

function VirtualCardArea({ ready }: { ready: boolean }) {
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!ready) {
      cardOpacity.setValue(0);
      return;
    }
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [ready, cardOpacity]);

  if (!ready) {
    return <VirtualCardSkeleton />;
  }

  return (
    <Animated.View style={{ opacity: cardOpacity }}>
      <VirtualCardVisual />
    </Animated.View>
  );
}

export default function CardSuccessScreen() {
  const { eventName } = useEventFlow();
  const title = eventName || 'Tvoj event';
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), CARD_READY_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <Screen scroll>
      <View className="w-full flex-1 px-6 pt-8">
        <View className="items-center">
          <BrandMark />
          <View className="mt-8">
            <CardReadyIcon ready={ready} />
          </View>
          <View className="mt-8 items-center gap-3">
            <SectionTitle className="text-center">
              {ready ? 'Karta je pripravená' : 'Pripravujeme kartu'}
            </SectionTitle>
            <MutedText className="text-center">
              {ready ? (
                <>
                  Virtuálna karta pre event <Text className="font-semibold text-tatra-foreground">„{title}“</Text> bola
                  úspešne vytvorená.
                </>
              ) : (
                <>
                  Virtuálna karta pre event <Text className="font-semibold text-tatra-foreground">„{title}“</Text> sa
                  vytvára…
                </>
              )}
            </MutedText>
          </View>
        </View>

        <View className="mt-10 items-center">
          <VirtualCardArea ready={ready} />
        </View>

        <TatraPanelBleed accent className="mt-8 py-5">
          <View className="flex-row gap-3">
            <View className="h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tatra-primary/20">
              <Text className="text-sm font-bold text-tatra-primary">i</Text>
            </View>
            <MutedText className="flex-1 text-sm leading-5">
              Karta je naviazaná na spoločný budget eventu. Výdavky uvidíte v prehľade v aplikácii Tatra banka.
            </MutedText>
          </View>
        </TatraPanelBleed>

        <View className="mt-10">
          <TatraPrimaryButton disabled={!ready} onPress={() => router.push('/event/wallet')}>
            Pokračovať
          </TatraPrimaryButton>
        </View>
      </View>
    </Screen>
  );
}
