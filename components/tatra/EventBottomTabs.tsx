import { router } from 'expo-router';
import { Home, PieChart, Users } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { hapticLight } from '@/lib/haptics';

export type EventTabKey = 'home' | 'members' | 'stats';

type EventBottomTabsProps = {
  active: EventTabKey;
};

const PRIMARY = '#009fe3';
const MUTED_ICON = '#d4d4d8';

export function EventBottomTabs({ active }: EventBottomTabsProps) {
  const insets = useSafeAreaInsets();

  const go = (tab: EventTabKey) => {
    if (tab === active) return;
    hapticLight();
    if (tab === 'home') router.replace('/event/dashboard');
    if (tab === 'members') router.replace('/event/members');
    if (tab === 'stats') router.replace('/event/stats');
  };

  return (
    <View
      className="flex-row justify-around border-t border-tatra-border bg-tatra-card py-3"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'home' }}
        accessibilityLabel="Domov"
        onPress={() => go('home')}
        className="items-center gap-1">
        <View
          className={`h-12 w-12 items-center justify-center rounded-full ${
            active === 'home' ? 'bg-tatra-primary/20 ring-2 ring-tatra-primary/50' : 'bg-tatra-elevated'
          }`}>
          <Home color={active === 'home' ? PRIMARY : MUTED_ICON} size={22} />
        </View>
        <Text
          className={`text-xs font-medium ${active === 'home' ? 'text-tatra-primary' : 'text-tatra-muted'}`}>
          Domov
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'members' }}
        accessibilityLabel="Členovia"
        onPress={() => go('members')}
        className="items-center gap-1">
        <View
          className={`h-12 w-12 items-center justify-center rounded-full ${
            active === 'members' ? 'bg-tatra-primary/20 ring-2 ring-tatra-primary/50' : 'bg-tatra-elevated'
          }`}>
          <Users color={active === 'members' ? PRIMARY : MUTED_ICON} size={22} />
        </View>
        <Text
          className={`text-xs font-medium ${active === 'members' ? 'text-tatra-primary' : 'text-tatra-muted'}`}>
          Členovia
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'stats' }}
        accessibilityLabel="Štatistiky výdavkov"
        onPress={() => go('stats')}
        className="items-center gap-1">
        <View
          className={`h-12 w-12 items-center justify-center rounded-full ${
            active === 'stats' ? 'bg-tatra-primary/20 ring-2 ring-tatra-primary/50' : 'bg-tatra-elevated'
          }`}>
          <PieChart color={active === 'stats' ? PRIMARY : MUTED_ICON} size={22} />
        </View>
        <Text
          className={`text-xs font-medium ${active === 'stats' ? 'text-tatra-primary' : 'text-tatra-muted'}`}>
          Štatistiky
        </Text>
      </Pressable>
    </View>
  );
}
