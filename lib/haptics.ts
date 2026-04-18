import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Short tactile feedback for taps (banking-app style confirmations). */
export function hapticLight() {
  if (Platform.OS === 'web') return;
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
