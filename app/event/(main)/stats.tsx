import { PieChart, Receipt, Users } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { DonutChart } from '@/components/tatra/DonutChart';
import { EventBottomTabs } from '@/components/tatra/EventBottomTabs';
import { Screen } from '@/components/tatra/Screen';
import { TatraPanelBleed } from '@/components/tatra/TatraPanelBleed';
import { MutedText, SectionTitle } from '@/components/tatra/Typography';
import { CategoryExpenseIcon } from '@/lib/category-expense-icon';
import { formatEurCurrency } from '@/lib/formatMoney';
import { useEventFlow } from '@/providers/EventFlowContext';

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof PieChart;
  title?: string;
  subtitle?: string;
}) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="mt-0.5 h-11 w-11 items-center justify-center rounded-2xl bg-tatra-primary/15">
        <Icon color="#009fe3" size={22} strokeWidth={2.2} />
      </View>
      <View className="min-w-0 flex-1">
        {title ? <SectionTitle className="text-xl">{title}</SectionTitle> : null}
        {subtitle ? (
          <MutedText className={title ? 'mt-1 text-sm leading-5' : 'text-sm leading-5'}>{subtitle}</MutedText>
        ) : null}
      </View>
    </View>
  );
}

function CategoryLegendRow({
  categoryKey,
  color,
  label,
  amountEur,
  pct,
}: {
  categoryKey: string;
  color: string;
  label: string;
  amountEur: number;
  pct: number;
}) {
  const pctLabel = `${Math.round(pct)} %`;
  const money = formatEurCurrency(amountEur);
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}, ${pctLabel} z celku, suma ${money}`}
      className="rounded-xl bg-tatra-elevated/60 px-3 py-3">
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-3">
          <View
            className="h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${color}33` }}>
            <CategoryExpenseIcon categoryKey={categoryKey} color={color} size={18} strokeWidth={2.2} />
          </View>
          <Text className="font-sans text-base font-medium text-tatra-foreground" numberOfLines={1}>
            {label}
          </Text>
        </View>
        <View className="shrink-0 items-end">
          <Text className="font-sans text-xs font-semibold uppercase tracking-wide text-tatra-muted">{pctLabel}</Text>
          <Text className="text-right font-sans text-base font-bold tabular-nums tracking-tight text-tatra-foreground">
            {money}
          </Text>
        </View>
      </View>
      <View className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-tatra-border">
        <View
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, Math.max(4, pct))}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const { transactions, categories, contributors } = useEventFlow();

  const catSlices = categories.map((c) => ({ color: c.color, value: c.amountEur }));
  const contribSlices = contributors.map((c) => ({ color: c.color, value: c.amountEur }));

  const categoryTotalEur = useMemo(
    () => categories.reduce((s, c) => s + c.amountEur, 0),
    [categories],
  );
  const contributorTotalEur = useMemo(
    () => contributors.reduce((s, c) => s + c.amountEur, 0),
    [contributors],
  );

  const categoryDonutLabel = useMemo(() => {
    if (!categories.length) return 'Žiadne kategórie';
    return categories
      .map((c) => {
        const pct = categoryTotalEur > 0 ? Math.round((c.amountEur / categoryTotalEur) * 100) : 0;
        return `${c.label} ${pct} percent`;
      })
      .join(', ');
  }, [categories, categoryTotalEur]);

  const contributorDonutLabel = useMemo(() => {
    if (!contributors.length) return 'Žiadni prispievatelia';
    return contributors
      .map((c) => {
        const pct = contributorTotalEur > 0 ? Math.round((c.amountEur / contributorTotalEur) * 100) : 0;
        return `${c.name} ${pct} percent`;
      })
      .join(', ');
  }, [contributors, contributorTotalEur]);

  return (
    <Screen>
      <View className="flex-1 pt-4">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}>
          <View className="px-6">
            <View className="mt-6">
              <SectionHeader
                icon={PieChart}
                subtitle="Rozdelenie podľa kategórií podľa zúčtovaných platieb. Percentá sú z celkových výdavkov v kategóriách."
              />
            </View>
          </View>

          <TatraPanelBleed className="mt-6 py-8">
            <View className="items-center">
              <DonutChart
                size={216}
                strokeWidth={26}
                slices={catSlices.length ? catSlices : [{ color: '#71717a', value: 1 }]}
                centerTitle="Spolu"
                centerValue={formatEurCurrency(categoryTotalEur)}
                accessibilityLabel={`Kruhový graf kategórií. ${categoryDonutLabel}`}
              />
            </View>
            <View className="mt-6 gap-3 px-4">
              {categories.length === 0 ? (
                <MutedText className="text-center text-sm">Zatiaľ žiadne výdavky v kategóriách.</MutedText>
              ) : (
                categories.map((c) => (
                  <CategoryLegendRow
                    key={c.key}
                    categoryKey={c.key}
                    color={c.color}
                    label={c.label}
                    amountEur={c.amountEur}
                    pct={categoryTotalEur > 0 ? (c.amountEur / categoryTotalEur) * 100 : 0}
                  />
                ))
              )}
            </View>
          </TatraPanelBleed>

          <View className="mt-10 px-6">
            <SectionHeader icon={Receipt} title="Prehľad transakcií" subtitle="Posledné platby v skratke." />
          </View>
          <TatraPanelBleed className="mt-4 py-0">
            {transactions.length === 0 ? (
              <MutedText className="py-8 text-center text-sm">Zatiaľ žiadne transakcie.</MutedText>
            ) : (
              transactions.slice(0, 5).map((t, index) => (
                <View
                  key={t.id}
                  accessible
                  accessibilityLabel={`${t.merchant}, ${formatEurCurrency(t.amountEur)}`}
                  className={`flex-row items-center justify-between gap-3 py-3.5 pr-2 pl-1 ${index > 0 ? 'border-t border-tatra-border' : ''}`}>
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-tatra-primary/12">
                    <Receipt color="#009fe3" size={18} strokeWidth={2} />
                  </View>
                  <Text className="min-w-0 flex-1 font-sans text-base font-medium text-tatra-foreground" numberOfLines={1}>
                    {t.merchant}
                  </Text>
                  <Text className="shrink-0 text-right font-sans text-base font-bold tabular-nums tracking-tight text-tatra-foreground">
                    {formatEurCurrency(t.amountEur)}
                  </Text>
                </View>
              ))
            )}
          </TatraPanelBleed>

          <View className="mt-10 px-6">
            <SectionHeader
              icon={Users}
              title="Kto koľko prispel"
              subtitle="Rozdelenie príspevkov medzi členov. Percentá sú z celkového prispievania."
            />
          </View>
          <TatraPanelBleed className="mt-4 py-8">
            <View className="items-center">
              <DonutChart
                size={200}
                strokeWidth={22}
                slices={contribSlices.length ? contribSlices : [{ color: '#71717a', value: 1 }]}
                centerTitle="Spolu"
                centerValue={formatEurCurrency(contributorTotalEur)}
                accessibilityLabel={`Kruhový graf prispievateľov. ${contributorDonutLabel}`}
              />
            </View>
            <View className="mt-6 gap-3 px-4">
              {contributors.map((p) => {
                const pct = contributorTotalEur > 0 ? (p.amountEur / contributorTotalEur) * 100 : 0;
                const money = formatEurCurrency(p.amountEur);
                return (
                  <View
                    key={p.id}
                    accessible
                    accessibilityRole="text"
                    accessibilityLabel={`${p.name}, ${Math.round(pct)} percent z celku, suma ${money}`}
                    className="flex-row items-center gap-3 rounded-xl bg-tatra-elevated/60 px-3 py-3 pr-2">
                    <View
                      className="h-11 w-11 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${p.color}44` }}>
                      <Text className="font-sans text-sm font-bold" style={{ color: p.color }}>
                        {p.initials}
                      </Text>
                    </View>
                    <View className="min-w-0 flex-1">
                      <Text className="font-sans text-base font-semibold text-tatra-foreground" numberOfLines={1}>
                        {p.name}
                      </Text>
                      <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-tatra-border">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(4, pct))}%`,
                            backgroundColor: p.color,
                          }}
                        />
                      </View>
                    </View>
                    <View className="shrink-0 items-end">
                      <Text className="font-sans text-xs font-semibold uppercase tracking-wide text-tatra-muted">
                        {Math.round(pct)} %
                      </Text>
                      <Text className="text-right font-sans text-base font-bold tabular-nums tracking-tight text-tatra-foreground">
                        {money}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </TatraPanelBleed>
        </ScrollView>
        <EventBottomTabs active="stats" />
      </View>
    </Screen>
  );
}
