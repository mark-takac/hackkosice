import { Stack } from 'expo-router';

export default function EventLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#061018' },
        animation: 'slide_from_right',
      }}
    />
  );
}
