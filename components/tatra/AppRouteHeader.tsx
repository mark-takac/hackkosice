import { usePathname, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { BrandMark } from '@/components/tatra/Typography';
import { hapticLight } from '@/lib/haptics';
import { getRouteTitle } from '@/lib/route-screen-title';

const WEB_DOC_TITLE_SUFFIX = ' · Event';
const TATRA_PRIMARY = '#009fe3';

/** Bottom-tab event screens share one stack; “home” is the dashboard tab. */
const EVENT_HOME = '/event/dashboard';
const EVENT_TAB_ROUTES = new Set<string>(['/event/dashboard', '/event/members', '/event/stats']);

function normalizePath(path: string | undefined): string {
  if (!path) return '';
  const p = path.replace(/\/+$/, '') || '/';
  return p;
}

type AppRouteHeaderProps = {
  titleOverride?: string;
  headerHideBack?: boolean;
};

export function AppRouteHeader({ titleOverride, headerHideBack }: AppRouteHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const path = normalizePath(pathname);
  const title = (titleOverride?.trim() || getRouteTitle(pathname)).trim() || 'Event';

  const onEventTab = EVENT_TAB_ROUTES.has(path);
  const showBack =
    !headerHideBack && (router.canGoBack() || (onEventTab && path !== EVENT_HOME));

  const onBack = () => {
    hapticLight();
    if (onEventTab) {
      if (router.canGoBack()) {
        router.back();
        return;
      }
      if (path !== EVENT_HOME) {
        router.replace(EVENT_HOME);
      }
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof document === 'undefined') return;
    document.title = `${title}${WEB_DOC_TITLE_SUFFIX}`;
  }, [title]);

  return (
    <View className="flex-row items-center gap-1 border-b border-tatra-border bg-tatra-background px-2 py-2.5">
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Späť"
          hitSlop={12}
          onPress={onBack}
          className="shrink-0 rounded-lg p-1 active:opacity-70">
          <ChevronLeft color={TATRA_PRIMARY} size={26} strokeWidth={2.25} />
        </Pressable>
      ) : null}
      <Text
        accessibilityRole="header"
        numberOfLines={1}
        className="min-w-0 flex-1 py-0.5 pr-2 text-left font-sans text-base font-semibold text-tatra-foreground">
        {title}
      </Text>
      <BrandMark compact className="shrink-0 items-end justify-center pr-1" />
    </View>
  );
}
