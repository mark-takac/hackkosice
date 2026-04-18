import { Text, TextInput } from 'react-native';

import { InterFont } from '@/constants/inter-fonts';

type WithDefaultStyle = { defaultProps?: { style?: unknown } };

function mergeDefaultStyle(prev: unknown, next: object) {
  if (prev == null) return next;
  if (Array.isArray(prev)) return [...prev, next];
  return [prev, next];
}

/** Sets default `Text` / `TextInput` body font after Inter has been loaded. */
export function applyInterTextDefaults() {
  const T = Text as typeof Text & WithDefaultStyle;
  const TI = TextInput as typeof TextInput & WithDefaultStyle;

  T.defaultProps = {
    ...T.defaultProps,
    style: mergeDefaultStyle(T.defaultProps?.style, { fontFamily: InterFont.regular }),
  };
  TI.defaultProps = {
    ...TI.defaultProps,
    style: mergeDefaultStyle(TI.defaultProps?.style, { fontFamily: InterFont.regular }),
  };
}
