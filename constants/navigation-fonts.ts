import type { Theme } from '@react-navigation/native';

import { InterFont } from '@/constants/inter-fonts';

/** React Navigation header / link typography. */
export const interNavigationFonts = {
  regular: { fontFamily: InterFont.regular, fontWeight: '400' as const },
  medium: { fontFamily: InterFont.medium, fontWeight: '500' as const },
  bold: { fontFamily: InterFont.semibold, fontWeight: '600' as const },
  heavy: { fontFamily: InterFont.bold, fontWeight: '700' as const },
} satisfies Theme['fonts'];
