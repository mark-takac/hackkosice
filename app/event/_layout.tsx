import { Stack } from 'expo-router';

/** Main bottom-tab routes use `router.replace`; avoid stack push animation (dark flash + “new page” slide). */
const eventTabScreenOptions = {
  animation: 'none' as const,
};

export default function EventLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#061018' },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="dashboard" options={eventTabScreenOptions} />
      <Stack.Screen name="members" options={eventTabScreenOptions} />
      <Stack.Screen name="stats" options={eventTabScreenOptions} />
    </Stack>
  );
}
