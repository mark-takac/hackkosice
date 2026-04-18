import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { DonutChart } from '@/components/tatra/DonutChart';
import { Screen } from '@/components/tatra/Screen';
import { TatraPanelBleed } from '@/components/tatra/TatraPanelBleed';
import { BrandMark, MutedText, SectionTitle } from '@/components/tatra/Typography';
import { formatEurCurrency } from '@/lib/formatMoney';
import { useEventFlow } from '@/providers/EventFlowContext';

export default function StatsScreen() {
  const { transactions, categories, contributors } = useEventFlow();

  const catSlices = categories.map((c) => ({ color: c.color, value: c.amountEur }));
  const contribSlices = contributors.map((c) => ({ color: c.color, value: c.amountEur }));

  return (
    <Screen scroll>
      <View className="pb-10 pt-4">
        <View className="px-6">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="mb-4 flex-row items-center gap-1 self-start py-2 active:opacity-80">
            <ChevronLeft color="#009fe3" size={28} />
            <Text className="text-base font-semibold text-tatra-primary">Späť</Text>
          </Pressable>
          <BrandMark />
          <SectionTitle className="mt-6">Všetky výdavky</SectionTitle>
          <MutedText className="mt-2">Rozdelenie podľa kategórií podľa zúčtovaných platieb.</MutedText>
        </View>

        <TatraPanelBleed className="mt-8 py-8">
          <View className="items-center">
            <DonutChart
              size={200}
              strokeWidth={28}
              slices={catSlices.length ? catSlices : [{ color: '#71717a', value: 1 }]}
            />
          </View>
          <View className="mt-6 gap-2">
            {categories.map((c) => (
              <View key={c.key} className="flex-row items-center justify-between gap-3 pr-2">
                <View className="min-w-0 flex-1 flex-row items-center gap-2">
                  <View className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                  <Text className="text-base text-tatra-foreground" numberOfLines={1}>
                    {c.label}
                  </Text>
                </View>
                <Text className="shrink-0 text-right text-base font-semibold tabular-nums tracking-tight text-tatra-foreground">
                  {formatEurCurrency(c.amountEur)}
                </Text>
              </View>
            ))}
          </View>
        </TatraPanelBleed>

        <View className="mt-8 px-6">
          <SectionTitle className="text-xl">Prehľad transakcií</SectionTitle>
        </View>
        <TatraPanelBleed className="mt-3 py-0">
          {transactions.slice(0, 5).map((t, index) => (
            <View
              key={t.id}
              className={`flex-row items-center justify-between gap-3 py-3 pr-2 ${index > 0 ? 'border-t border-tatra-border' : ''}`}>
              <Text className="min-w-0 flex-1 text-base text-tatra-foreground" numberOfLines={1}>
                {t.merchant}
              </Text>
              <Text className="shrink-0 text-right text-base font-semibold tabular-nums tracking-tight text-tatra-foreground">
                {formatEurCurrency(t.amountEur)}
              </Text>
            </View>
          ))}
        </TatraPanelBleed>

        <View className="mt-10 px-6">
          <SectionTitle className="text-xl">Kto koľko prispel</SectionTitle>
        </View>
        <TatraPanelBleed className="mt-3 py-8">
          <View className="items-center">
            <DonutChart
              size={180}
              strokeWidth={24}
              slices={contribSlices.length ? contribSlices : [{ color: '#71717a', value: 1 }]}
            />
          </View>
          <View className="mt-6 gap-3">
            {contributors.map((p) => (
              <View key={p.id} className="flex-row items-center gap-3 pr-2">
                <View
                  className="h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${p.color}44` }}>
                  <Text className="font-bold" style={{ color: p.color }}>
                    {p.initials}
                  </Text>
                </View>
                <Text className="min-w-0 flex-1 text-base text-tatra-foreground" numberOfLines={1}>
                  {p.name}
                </Text>
                <Text className="shrink-0 text-right text-base font-bold tabular-nums tracking-tight text-tatra-foreground">
                  {formatEurCurrency(p.amountEur)}
                </Text>
              </View>
            ))}
          </View>
        </TatraPanelBleed>
      </View>
    </Screen>
  );
}
