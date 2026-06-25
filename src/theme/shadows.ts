import { Platform, type ViewStyle } from 'react-native';

import { colors } from './colors';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

function createShadow(elevation: number, opacity: number, radius: number): ShadowStyle {
  return Platform.select<ShadowStyle>({
    android: { elevation },
    ios: {
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    default: { elevation },
  })!;
}

export const shadows = {
  none: createShadow(0, 0, 0),
  sm: createShadow(2, 0.06, 2),
  md: createShadow(4, 0.08, 6),
  lg: createShadow(8, 0.12, 12),
} as const;

export type ShadowName = keyof typeof shadows;
