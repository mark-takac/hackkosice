import { router } from 'expo-router';
import { Ban, ChevronRight, Trash2, UserPlus } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { TatraSecondaryButton } from '@/components/tatra/buttons';
import { EventBottomTabs } from '@/components/tatra/EventBottomTabs';
import { Screen } from '@/components/tatra/Screen';
import { TatraPanelBleed } from '@/components/tatra/TatraPanelBleed';
import { BrandMark, MutedText, SectionTitle } from '@/components/tatra/Typography';
import { formatEurCurrency } from '@/lib/formatMoney';
import { hapticLight } from '@/lib/haptics';
import type { ContributorMock } from '@/providers/EventFlowContext';
import { useEventFlow } from '@/providers/EventFlowContext';

const CARD_WIDTH = 300;
const CARD_HEIGHT = 196;
const CARD_GAP = 12;
const CARD_STRIDE = CARD_WIDTH + CARD_GAP;
const CAROUSEL_PADDING_H = 24;

const CHIP_GOLD = '#d4af37';

function MemberVirtualCard({
  item,
  eventName,
  paymentsDisabled,
  isViewer,
}: {
  item: ContributorMock;
  eventName: string;
  paymentsDisabled: boolean;
  isViewer: boolean;
}) {
  const displayEvent = eventName.trim() || 'Skupinový budget';
  const gradId = `member-card-grad-${item.id}`;
  const borderClass = isViewer ? 'border-2 border-tatra-primary' : 'border border-tatra-border';

  const openSettings = () => {
    hapticLight();
    router.push({ pathname: '/event/member-card-settings', params: { id: item.id } });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Nastavenia karty ${item.name}`}
      onPress={openSettings}
      delayPressIn={80}
      style={{ width: CARD_WIDTH, marginRight: CARD_GAP }}
      className="shadow-2xl active:opacity-95">
      <View className={`overflow-hidden rounded-2xl ${borderClass}`} style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        <Svg width={CARD_WIDTH} height={CARD_HEIGHT} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <Stop
                offset="0"
                stopColor={isViewer ? CHIP_GOLD : item.color}
                stopOpacity={isViewer ? 0.42 : 0.55}
              />
              <Stop offset="0.5" stopColor={item.color} stopOpacity={isViewer ? 0.35 : 0.45} />
              <Stop offset="1" stopColor="#061018" stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect width={CARD_WIDTH} height={CARD_HEIGHT} fill={`url(#${gradId})`} rx={16} />
        </Svg>

        <View className="flex-1 justify-between p-4" style={{ height: CARD_HEIGHT }}>
          <View className="relative min-h-0 flex-1 gap-2">
            {isViewer ? (
              <View className="self-start rounded-full bg-tatra-primary px-2.5 py-1">
                <Text className="text-[10px] font-bold uppercase tracking-wide text-white">Tvoja karta</Text>
              </View>
            ) : null}
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-row items-center gap-3">
                <View
                  className="h-9 w-[46px] rounded-md"
                  style={{
                    backgroundColor: `${CHIP_GOLD}cc`,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.25)',
                  }}
                />
                <View className="min-w-0 flex-1 pr-2">
                  <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                    Virtuálna karta
                  </Text>
                  <Text className="mt-0.5 text-sm font-semibold text-white/90" numberOfLines={1}>
                    {displayEvent}
                  </Text>
                </View>
              </View>
              <View
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  isViewer ? 'ring-2 ring-white/35' : ''
                }`}
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <Text className="text-sm font-bold text-white">{item.initials}</Text>
              </View>
            </View>

            <View className="mt-1">
              <Text className="text-xl font-bold tracking-tight text-white" numberOfLines={1}>
                {item.name}
                {isViewer ? ' · ty' : ''}
              </Text>
              <Text className="mt-1 text-xs font-medium text-white/60">Príspevok do budgetu</Text>
              <Text className="mt-0.5 text-lg font-bold tabular-nums tracking-tight text-white">
                {formatEurCurrency(item.amountEur)}
              </Text>
            </View>

            <View className="mt-auto flex-row items-center justify-end gap-1 pb-0.5">
              <Text className="text-xs font-medium text-white/70">Nastavenia</Text>
              <ChevronRight color="rgba(255,255,255,0.75)" size={18} strokeWidth={2.5} />
            </View>

            {paymentsDisabled ? (
              <View
                pointerEvents="none"
                className="absolute inset-0 items-center justify-center rounded-xl bg-black/50 px-4">
                <Ban color="#fafafa" size={28} strokeWidth={2} />
                <Text className="mt-2 text-center text-xs font-semibold uppercase tracking-wide text-white/90">
                  Platby vypnuté
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function MembersScreen() {
  const {
    eventName,
    contributors,
    inviteCode,
    removeContributor,
    viewerContributorId,
    cardPaymentsOffByContributorId,
  } = useEventFlow();
  const canRemove = contributors.length > 1;
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const carouselRef = useRef<ScrollView>(null);

  useEffect(() => {
    setActiveCardIndex((prev) => {
      const max = Math.max(0, contributors.length - 1);
      const clamped = Math.min(Math.max(0, prev), max);
      requestAnimationFrame(() => {
        carouselRef.current?.scrollTo({ x: clamped * CARD_STRIDE, animated: false });
      });
      return clamped;
    });
  }, [contributors.length]);

  const syncActiveIndexFromOffset = useCallback(
    (offsetX: number) => {
      const next = Math.round(offsetX / CARD_STRIDE);
      const max = Math.max(0, contributors.length - 1);
      const clamped = Math.min(Math.max(0, next), max);
      setActiveCardIndex((prev) => (prev === clamped ? prev : clamped));
    },
    [contributors.length],
  );

  const scrollToCardIndex = useCallback(
    (index: number) => {
      const i = Math.min(Math.max(0, index), Math.max(0, contributors.length - 1));
      hapticLight();
      setActiveCardIndex(i);
      carouselRef.current?.scrollTo({ x: i * CARD_STRIDE, animated: true });
    },
    [contributors.length],
  );

  const openMemberSettings = useCallback((memberId: string) => {
    hapticLight();
    router.push({ pathname: '/event/member-card-settings', params: { id: memberId } });
  }, []);

  const confirmRemove = useCallback(
    (member: ContributorMock) => {
      if (!canRemove) return;
      hapticLight();
      Alert.alert(
        'Odstrániť účastníka',
        `${member.name} stratí prístup k tomuto eventu. Naozaj pokračovať?`,
        [
          { text: 'Zrušiť', style: 'cancel' },
          {
            text: 'Odstrániť',
            style: 'destructive',
            onPress: () => removeContributor(member.id),
          },
        ],
      );
    },
    [canRemove, removeContributor],
  );

  const onInvite = () => {
    hapticLight();
    if (!inviteCode && contributors.length === 0) {
      router.replace('/event/setup');
      return;
    }
    router.push('/event/invite');
  };

  const empty = contributors.length === 0;

  return (
    <Screen>
      <View className="flex-1 pt-4">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}>
          <View className="px-6">
            <BrandMark />
            <View className="mt-6 gap-1">
              <MutedText className="text-sm">Skupina</MutedText>
              <SectionTitle className="text-xl">Členovia</SectionTitle>
              <MutedText className="mt-1 text-sm leading-5">
                Prehľad kariet a správa účastníkov. Pozvánku môžeš kedykoľvek poslať znova.
              </MutedText>
            </View>
          </View>

          {empty ? (
            <View className="mt-8 px-6">
              <TatraPanelBleed className="py-8">
                <MutedText className="text-center leading-6">
                  Keď vytvoríš event alebo sa pripojíš kódom, tu uvidíš členov skupiny.
                </MutedText>
                <View className="mt-6">
                  <TatraSecondaryButton onPress={() => router.replace('/event/welcome')}>
                    Späť na úvod
                  </TatraSecondaryButton>
                </View>
              </TatraPanelBleed>
            </View>
          ) : (
            <>
              <View className="mt-8 px-6">
                <SectionTitle className="text-lg">Karty členov</SectionTitle>
                <MutedText className="mt-1 text-sm">
                  Klepnutím na kartu otvoríš nastavenia. Pre cudziu kartu môžeš len vypnúť platby; pre svoju aj ďalšie
                  možnosti.
                </MutedText>
              </View>

              <View className="mt-4 overflow-hidden">
                <ScrollView
                  ref={carouselRef}
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  snapToInterval={CARD_STRIDE}
                  snapToAlignment="start"
                  disableIntervalMomentum
                  style={{ height: CARD_HEIGHT }}
                  contentContainerStyle={{
                    flexDirection: 'row',
                    paddingLeft: CAROUSEL_PADDING_H,
                    paddingRight: CAROUSEL_PADDING_H - CARD_GAP,
                  }}
                  onMomentumScrollEnd={(e) =>
                    syncActiveIndexFromOffset(e.nativeEvent.contentOffset.x)
                  }
                  onScrollEndDrag={(e) => syncActiveIndexFromOffset(e.nativeEvent.contentOffset.x)}>
                  {contributors.map((item) => (
                    <MemberVirtualCard
                      key={item.id}
                      item={item}
                      eventName={eventName}
                      isViewer={item.id === viewerContributorId}
                      paymentsDisabled={!!cardPaymentsOffByContributorId[item.id]}
                    />
                  ))}
                </ScrollView>
              </View>

              <View
                accessibilityRole="tablist"
                accessibilityLabel="Prepnutie karty člena"
                className="mt-4 flex-row items-center justify-center gap-2">
                {contributors.map((c, index) => {
                  const active = index === activeCardIndex;
                  const mine = c.id === viewerContributorId;
                  const dotClass = active
                    ? 'h-2 w-6 bg-tatra-primary'
                    : mine
                      ? 'h-2 w-2 bg-tatra-accent/70'
                      : 'h-2 w-2 bg-tatra-muted/35';
                  return (
                    <Pressable
                      key={c.id}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`Karta ${index + 1} z ${contributors.length}, ${c.name}${mine ? ', tvoja karta' : ''}`}
                      hitSlop={8}
                      onPress={() => scrollToCardIndex(index)}
                      className="items-center justify-center py-1">
                      <View className={`rounded-full ${dotClass}`} />
                    </Pressable>
                  );
                })}
              </View>

              <View className="mt-10 px-6">
                <SectionTitle className="text-lg">Účastníci</SectionTitle>
                <MutedText className="mt-1 text-sm">Pozvi nových ľudí alebo odstráň prístup.</MutedText>
              </View>

              <View className="mt-4 px-6">
                <Pressable
                  accessibilityRole="button"
                  onPress={onInvite}
                  className="flex-row items-center justify-center gap-2 rounded-xl border border-tatra-border bg-tatra-card py-3.5 active:opacity-90">
                  <UserPlus color="#009fe3" size={22} />
                  <Text className="text-base font-semibold text-tatra-primary">Pozvať účastníkov</Text>
                </Pressable>
                {!canRemove ? (
                  <MutedText className="mt-2 text-center text-xs">
                    V skupine musí zostať aspoň jeden účastník.
                  </MutedText>
                ) : null}
              </View>

              <TatraPanelBleed className="mt-4 py-0">
                {contributors.map((m, index) => (
                  <View
                    key={m.id}
                    className={`flex-row items-center gap-3 py-3.5 pl-1 pr-2 ${
                      index > 0 ? 'border-t border-tatra-border' : ''
                    }`}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Nastavenia karty ${m.name}`}
                      onPress={() => openMemberSettings(m.id)}
                      delayPressIn={50}
                      className="min-w-0 flex-1 flex-row items-center gap-3 active:opacity-85">
                      <View
                        className="h-11 w-11 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${m.color}33` }}>
                        <Text className="text-sm font-bold" style={{ color: m.color }}>
                          {m.initials}
                        </Text>
                      </View>
                      <View className="min-w-0 flex-1">
                        <View className="flex-row flex-wrap items-center gap-2">
                          <Text className="text-base font-semibold text-tatra-foreground" numberOfLines={1}>
                            {m.name}
                          </Text>
                          {m.id === viewerContributorId ? (
                            <View className="rounded-full bg-tatra-primary/20 px-2 py-0.5">
                              <Text className="text-[10px] font-semibold uppercase tracking-wide text-tatra-primary">
                                Ty
                              </Text>
                            </View>
                          ) : null}
                          {cardPaymentsOffByContributorId[m.id] ? (
                            <View className="rounded-full bg-tatra-muted/20 px-2 py-0.5">
                              <Text className="text-[10px] font-semibold uppercase tracking-wide text-tatra-muted">
                                Platby vypnuté
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        <MutedText className="text-sm">Príspevok {formatEurCurrency(m.amountEur)}</MutedText>
                      </View>
                      <ChevronRight color="#71717a" size={20} strokeWidth={2} />
                    </Pressable>
                    {m.id === viewerContributorId ? (
                      <View
                        accessibilityLabel="Tvoj účet nemôžeš z tejto obrazovky odstrániť"
                        className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tatra-elevated/60">
                        <Text className="text-xs text-tatra-muted">—</Text>
                      </View>
                    ) : (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Odstrániť ${m.name}`}
                        disabled={!canRemove}
                        onPress={() => confirmRemove(m)}
                        className={`h-10 w-10 shrink-0 items-center justify-center rounded-xl active:opacity-80 ${
                          canRemove ? 'bg-tatra-destructive/15' : 'bg-tatra-elevated opacity-40'
                        }`}>
                        <Trash2 color="#ef4444" size={20} />
                      </Pressable>
                    )}
                  </View>
                ))}
              </TatraPanelBleed>
            </>
          )}
        </ScrollView>

        <EventBottomTabs active="members" />
      </View>
    </Screen>
  );
}
