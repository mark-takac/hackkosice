import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { Bell, ChevronRight, Link2, SlidersHorizontal, UserPlus, Wallet } from 'lucide-react-native';
import { useMemo } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';

import { Screen } from '@/components/tatra/Screen';
import { TatraPanelBleed } from '@/components/tatra/TatraPanelBleed';
import { MutedText, SectionTitle } from '@/components/tatra/Typography';
import { formatEurCurrency } from '@/lib/formatMoney';
import { hapticLight } from '@/lib/haptics';
import { useEventFlow } from '@/providers/EventFlowContext';

const TATRA_PRIMARY = '#009fe3';

function buildInviteLink(code: string) {
  return `https://event.tatrabanka.sk/j/${encodeURIComponent(code)}`;
}

function normalizeId(raw: string | string[] | undefined): string | undefined {
  if (raw == null) return undefined;
  return Array.isArray(raw) ? raw[0] : raw;
}

export default function MemberCardSettingsScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const id = normalizeId(idParam);

  const {
    contributors,
    viewerContributorId,
    eventName,
    inviteCode,
    cardPaymentsOffByContributorId,
    viewerExpenseAlertsEnabled,
    setContributorCardPaymentsOff,
    setViewerExpenseAlertsEnabled,
  } = useEventFlow();

  const member = useMemo(() => contributors.find((c) => c.id === id), [contributors, id]);
  const isViewer = member != null && member.id === viewerContributorId;
  const paymentsOff = member ? !!cardPaymentsOffByContributorId[member.id] : false;

  const copyInviteLink = async () => {
    const link = buildInviteLink(inviteCode || 'PREVIEW');
    await Clipboard.setStringAsync(link);
    Alert.alert('Odkaz v schránke', 'Pozvánkový odkaz je pripravený na odoslanie.');
  };

  if (!id || !member) {
    return (
      <Screen scroll headerTitle="Karta sa nenašla">
        <View className="flex-1 px-6 pb-10 pt-4">
          <MutedText className="mt-8">Tento člen už v skupine nie je alebo odkaz je neplatný.</MutedText>
        </View>
      </Screen>
    );
  }

  const displayEvent = eventName.trim() || 'Skupinový budget';

  return (
    <Screen scroll headerTitle={member.name}>
      <View className="px-6 pb-10 pt-4">
        <View className="mt-6 gap-1">
          <MutedText className="text-sm">Virtuálna karta</MutedText>
          <MutedText className="mt-1 text-sm leading-5">
            {isViewer
              ? 'Úpravy tvojej karty, pozvánky a upozornenia. Číslo karty sa nezobrazuje.'
              : 'Pre kartu iného člena môžeš len vypnúť alebo zapnúť platby kartou.'}
          </MutedText>
        </View>

        <TatraPanelBleed className="mt-6 py-4">
          <View className="flex-row items-center gap-3 px-1">
            <View
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: `${member.color}33` }}>
              <Text className="text-base font-bold" style={{ color: member.color }}>
                {member.initials}
              </Text>
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-base font-semibold text-tatra-foreground" numberOfLines={1}>
                {displayEvent}
              </Text>
              <MutedText className="text-sm">Príspevok {formatEurCurrency(member.amountEur)}</MutedText>
            </View>
            {isViewer ? (
              <View className="rounded-full bg-tatra-primary/20 px-2 py-1">
                <Text className="text-[10px] font-bold uppercase tracking-wide text-tatra-primary">Tvoja</Text>
              </View>
            ) : null}
          </View>
        </TatraPanelBleed>

        <View className="mt-8">
          <SectionTitle className="text-lg">Platby</SectionTitle>
          <MutedText className="mt-1 text-sm">Platby kartou na e-shopech a termináloch.</MutedText>
        </View>
        <TatraPanelBleed className="mt-3 py-0">
          <View className="flex-row items-center justify-between gap-3 py-4 pl-1 pr-2">
            <View className="min-w-0 flex-1 pr-2">
              <Text className="text-base font-semibold text-tatra-foreground">Povoliť platby kartou</Text>
              <MutedText className="mt-0.5 text-sm">Keď je vypnuté, karta je zablokovaná.</MutedText>
            </View>
            <Switch
              accessibilityLabel="Povoliť platby kartou"
              value={!paymentsOff}
              onValueChange={(enabled) => {
                hapticLight();
                setContributorCardPaymentsOff(member.id, !enabled);
              }}
              trackColor={{ false: '#3f3f46', true: `${member.color}99` }}
              thumbColor="#fafafa"
              ios_backgroundColor="#3f3f46"
            />
          </View>
        </TatraPanelBleed>

        {isViewer ? (
          <>
            <View className="mt-10">
              <SectionTitle className="text-lg">Tvoja karta</SectionTitle>
              <MutedText className="mt-1 text-sm">Ďalšie možnosti len pre teba.</MutedText>
            </View>
            <TatraPanelBleed className="mt-3 py-0">
              <View className="flex-row items-center justify-between gap-3 border-b border-tatra-border py-4 pl-1 pr-2">
                <View className="min-w-0 flex-1 flex-row items-center gap-3 pr-2">
                  <Bell color="#a1a1aa" size={22} strokeWidth={2} />
                  <View className="min-w-0 flex-1">
                    <Text className="text-base font-semibold text-tatra-foreground">Upozornenia na výdavky</Text>
                    <MutedText className="mt-0.5 text-sm">Push pri platbe touto kartou.</MutedText>
                  </View>
                </View>
                <Switch
                  accessibilityLabel="Upozornenia na výdavky"
                  value={viewerExpenseAlertsEnabled}
                  onValueChange={(v) => {
                    hapticLight();
                    setViewerExpenseAlertsEnabled(v);
                  }}
                  trackColor={{ false: '#3f3f46', true: `${TATRA_PRIMARY}99` }}
                  thumbColor="#fafafa"
                  ios_backgroundColor="#3f3f46"
                />
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  hapticLight();
                  router.push('/event/invite');
                }}
                className="flex-row items-center gap-3 border-b border-tatra-border py-4 pl-1 pr-2 active:opacity-85">
                <UserPlus color="#a1a1aa" size={22} strokeWidth={2} />
                <Text className="min-w-0 flex-1 text-base font-semibold text-tatra-foreground">Pozvať účastníkov</Text>
                <ChevronRight color="#71717a" size={22} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  hapticLight();
                  void copyInviteLink();
                }}
                className="flex-row items-center gap-3 border-b border-tatra-border py-4 pl-1 pr-2 active:opacity-85">
                <Link2 color="#a1a1aa" size={22} strokeWidth={2} />
                <Text className="min-w-0 flex-1 text-base font-semibold text-tatra-foreground">Skopírovať odkaz</Text>
                <ChevronRight color="#71717a" size={22} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  hapticLight();
                  router.push('/event/wallet');
                }}
                className="flex-row items-center gap-3 border-b border-tatra-border py-4 pl-1 pr-2 active:opacity-85">
                <Wallet color="#a1a1aa" size={22} strokeWidth={2} />
                <Text className="min-w-0 flex-1 text-base font-semibold text-tatra-foreground">Peňaženka</Text>
                <ChevronRight color="#71717a" size={22} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  hapticLight();
                  Alert.alert(
                    'Limity výdavkov',
                    'Tu nastavíš denný alebo týždenný strop pre platby touto kartou. V demo verzii ide len o ukážku.',
                  );
                }}
                className="flex-row items-center gap-3 py-4 pl-1 pr-2 active:opacity-85">
                <SlidersHorizontal color="#a1a1aa" size={22} strokeWidth={2} />
                <Text className="min-w-0 flex-1 text-base font-semibold text-tatra-foreground">Limity</Text>
                <ChevronRight color="#71717a" size={22} />
              </Pressable>
            </TatraPanelBleed>
          </>
        ) : null}
      </View>
    </Screen>
  );
}
