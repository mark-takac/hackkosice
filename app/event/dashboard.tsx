import { router } from 'expo-router';
import { CreditCard, Home, PieChart, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/tatra/Screen';
import { TatraPanelBleed } from '@/components/tatra/TatraPanelBleed';
import { BrandMark, MutedText, SectionTitle } from '@/components/tatra/Typography';
import { formatEurAmount, formatEurCurrency } from '@/lib/formatMoney';
import { useEventFlow } from '@/providers/EventFlowContext';

const PREVIEW_ROWS = 3;

const INCOME_GREEN = '#22c55e';
const EXPENSE_RED = '#ef4444';

function MoneyExpense({ amount }: { amount: number }) {
  const label = formatEurCurrency(-Math.abs(amount));
  return (
    <View className="min-w-[6.5rem] shrink-0 items-end justify-center">
      <Text
        accessibilityLabel={`Výdavok ${label}`}
        className="text-lg font-semibold tabular-nums tracking-tight"
        style={{ color: EXPENSE_RED }}>
        {label}
      </Text>
    </View>
  );
}

function MoneyBalance({ amount }: { amount: number }) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Disponibilný zostatok ${formatEurCurrency(amount)}`}
      className="mt-1 flex-row flex-wrap items-baseline justify-center gap-x-1 gap-y-0 px-2">
      <Text className="text-5xl font-bold tabular-nums tracking-tight" style={{ color: INCOME_GREEN }}>
        {formatEurAmount(amount)}
      </Text>
      <Text className="text-3xl font-bold tabular-nums" style={{ color: INCOME_GREEN }}>
        €
      </Text>
    </View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { eventName, balanceEur, transactions, categories, contributors } = useEventFlow();
  const [showContributeInfo, setShowContributeInfo] = useState(false);

  const contribute = () => {
    setShowContributeInfo((open) => !open);
  };

  const spendingByMember = useMemo(() => {
    const map = new Map<string, { key: string; initials: string; tint: string; amountEur: number }>();
    for (const t of transactions) {
      const key = t.initials;
      const prev = map.get(key);
      if (prev) {
        prev.amountEur += t.amountEur;
      } else {
        map.set(key, { key, initials: t.initials, tint: t.tint, amountEur: t.amountEur });
      }
    }
    return [...map.values()].sort((a, b) => b.amountEur - a.amountEur);
  }, [transactions]);

  const categoriesSorted = useMemo(
    () => [...categories].sort((a, b) => b.amountEur - a.amountEur),
    [categories],
  );

  return (
    <Screen>
      <View className="flex-1 pt-4">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}>
          <View className="px-6">
            <BrandMark />
            <View className="mt-6 flex-row items-center justify-between">
              <View className="flex-1 pr-2">
                <MutedText className="text-sm">Aktívny event</MutedText>
                <Text className="text-xl font-bold text-tatra-foreground" numberOfLines={1}>
                  {eventName || 'Skupinový budget'}
                </Text>
              </View>
            </View>
          </View>

          <TatraPanelBleed className="mt-6 py-6">
            <MutedText className="text-center text-xs font-medium uppercase tracking-wider text-tatra-muted">
              Disponibilný zostatok
            </MutedText>
            <MoneyBalance amount={balanceEur} />
            <View className="mt-5 items-center">
              <View className="w-full max-w-[236px]">
                <Pressable
                  accessibilityRole="button"
                  onPress={contribute}
                  className="flex-row items-center justify-center gap-2 rounded-xl bg-tatra-elevated py-3 active:opacity-90">
                  <Plus color="#009fe3" size={22} />
                  <Text className="text-base font-semibold text-tatra-primary">Prispieť do budgetu</Text>
                </Pressable>
              </View>
            </View>
            {showContributeInfo ? (
              <MutedText className="mt-3 text-center text-sm leading-5">
                Tu by nasledoval prevod z tvojho účtu do spoločného budgetu eventu.
              </MutedText>
            ) : null}
          </TatraPanelBleed>

          <View className="mt-8 px-6">
            <SectionTitle className="text-xl">Výdavky podľa členov</SectionTitle>
            <MutedText className="mt-1 text-sm">Súčet z účteniek podľa iniciál na karte.</MutedText>
          </View>

          <TatraPanelBleed className="mt-3 py-0">
            {spendingByMember.length === 0 ? (
              <MutedText className="py-6 text-center">Zatiaľ žiadne výdavky podľa členov.</MutedText>
            ) : (
              spendingByMember.slice(0, PREVIEW_ROWS).map((m, index) => (
                  <View
                    key={m.key}
                    className={`flex-row items-center gap-3 py-3 pl-1 pr-2 ${index > 0 ? 'border-t border-tatra-border' : ''}`}>
                    <View className="w-1 self-stretch rounded-full" style={{ backgroundColor: EXPENSE_RED }} />
                    <View
                      className="h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${m.tint}33` }}>
                      <Text className="text-sm font-bold" style={{ color: m.tint }}>
                        {m.initials}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-tatra-foreground">
                        {contributors.find((c) => c.initials === m.initials)?.name ?? `Člen ${m.initials}`}
                      </Text>
                      <MutedText className="text-sm">Spolu utratené</MutedText>
                    </View>
                    <MoneyExpense amount={m.amountEur} />
                  </View>
                ))
            )}
          </TatraPanelBleed>
          {spendingByMember.length > PREVIEW_ROWS ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Zobraziť detailný prehľad výdavkov"
              onPress={() => router.push('/event/stats')}
              className="mt-2 px-6 py-2 active:opacity-80">
              <Text className="text-center text-base font-semibold text-tatra-primary">Viac</Text>
            </Pressable>
          ) : spendingByMember.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Zobraziť detailný prehľad výdavkov"
              onPress={() => router.push('/event/stats')}
              className="mt-2 px-6 py-2 active:opacity-80">
              <Text className="text-center text-base font-semibold text-tatra-primary">Detailný prehľad</Text>
            </Pressable>
          ) : null}

          <View className="mt-8 px-6">
            <SectionTitle className="text-xl">Výdavky podľa kategórií</SectionTitle>
          </View>

          <TatraPanelBleed className="mt-3 py-0">
            {categoriesSorted.length === 0 ? (
              <MutedText className="py-6 text-center">Zatiaľ žiadne kategórie.</MutedText>
            ) : (
              categoriesSorted.slice(0, PREVIEW_ROWS).map((c, index) => (
                  <View
                    key={c.key}
                    className={`flex-row items-center gap-3 py-3 pl-1 pr-2 ${index > 0 ? 'border-t border-tatra-border' : ''}`}>
                    <View className="w-1 self-stretch rounded-full" style={{ backgroundColor: EXPENSE_RED }} />
                    <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${c.color}33` }}>
                      <View className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                    </View>
                    <Text className="flex-1 text-base font-semibold text-tatra-foreground">{c.label}</Text>
                    <MoneyExpense amount={c.amountEur} />
                  </View>
                ))
            )}
          </TatraPanelBleed>
          {categoriesSorted.length > PREVIEW_ROWS ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/event/stats')}
              className="mt-2 px-6 py-2 active:opacity-80">
              <Text className="text-center text-base font-semibold text-tatra-primary">Viac</Text>
            </Pressable>
          ) : categoriesSorted.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/event/stats')}
              className="mt-2 px-6 py-2 active:opacity-80">
              <Text className="text-center text-base font-semibold text-tatra-primary">Detailný prehľad</Text>
            </Pressable>
          ) : null}

          <View className="mt-8 px-6">
            <SectionTitle className="text-xl">Výdavky za posledný týždeň</SectionTitle>
          </View>

          <TatraPanelBleed className="mt-3 py-0">
            {transactions.length === 0 ? (
              <MutedText className="py-6 text-center">Zatiaľ žiadne výdavky.</MutedText>
            ) : (
              transactions.map((t, index) => (
                  <View
                    key={t.id}
                    className={`flex-row items-center gap-3 py-3 pl-1 pr-2 ${index > 0 ? 'border-t border-tatra-border' : ''}`}>
                    <View className="w-1 self-stretch rounded-full" style={{ backgroundColor: EXPENSE_RED }} />
                    <View
                      className="h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${t.tint}33` }}>
                      <Text className="text-sm font-bold" style={{ color: t.tint }}>
                        {t.initials}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-tatra-foreground">{t.merchant}</Text>
                      <MutedText className="text-sm">{t.dateLabel}</MutedText>
                    </View>
                    <MoneyExpense amount={t.amountEur} />
                  </View>
                ))
            )}
          </TatraPanelBleed>
        </ScrollView>

        <View
          className="flex-row justify-around border-t border-tatra-border bg-tatra-card py-3"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Domov, aktuálna obrazovka"
            className="items-center gap-1">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-tatra-primary/20 ring-2 ring-tatra-primary/50">
              <Home color="#009fe3" size={22} />
            </View>
            <Text className="text-xs font-medium text-tatra-primary">Domov</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Virtuálna karta, ukážka"
            className="items-center gap-1">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-tatra-elevated">
              <CreditCard color="#d4d4d8" size={22} />
            </View>
            <Text className="text-xs text-tatra-muted">Karta</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Štatistiky výdavkov"
            onPress={() => router.push('/event/stats')}
            className="items-center gap-1">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-tatra-elevated">
              <PieChart color="#d4d4d8" size={22} />
            </View>
            <Text className="text-xs text-tatra-muted">Štatistiky</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
