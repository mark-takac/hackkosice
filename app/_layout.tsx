import '../global.css';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useLayoutEffect, useRef } from 'react';
import 'react-native-reanimated';

import { interNavigationFonts } from '@/constants/navigation-fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { applyInterTextDefaults } from '@/lib/apply-inter-text-defaults';
import { EventFlowProvider } from '@/providers/EventFlowContext';
import { QueryProvider } from '@/providers/QueryProvider';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'index',
};

const AppLightTheme = {
  ...DefaultTheme,
  fonts: interNavigationFonts,
};

const AppDarkTheme = {
  ...DarkTheme,
  fonts: interNavigationFonts,
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const appliedDefaults = useRef(false);

  const applyDefaultsOnce = useCallback(() => {
    if (appliedDefaults.current) return;
    appliedDefaults.current = true;
    applyInterTextDefaults();
  }, []);

  useLayoutEffect(() => {
    if (loaded) {
      applyDefaultsOnce();
    }
  }, [loaded, applyDefaultsOnce]);

  useLayoutEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryProvider>
      <EventFlowProvider>
        <ThemeProvider value={colorScheme === 'dark' ? AppDarkTheme : AppLightTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="event" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </EventFlowProvider>
    </QueryProvider>
  );
}
