import { Image } from 'expo-image';
import { Text } from 'react-native';

import { Fonts } from '@/constants/theme';

export type AppIconName =
  | 'bell'
  | 'clock'
  | 'intensity'
  | 'flame'
  | 'calories'
  | 'trophy'
  | 'strength'
  | 'play';

const icons: Record<AppIconName, { sf: string; fallback: string }> = {
  bell: { sf: 'bell', fallback: '◇' },
  clock: { sf: 'clock', fallback: '◷' },
  intensity: { sf: 'bolt.fill', fallback: '◆' },
  flame: { sf: 'flame.fill', fallback: '↟' },
  calories: { sf: 'figure.run', fallback: '≋' },
  trophy: { sf: 'trophy.fill', fallback: '★' },
  strength: { sf: 'dumbbell.fill', fallback: '↔' },
  play: { sf: 'play.fill', fallback: '▶' },
};

type AppIconProps = {
  color: string;
  name: AppIconName;
  size?: number;
};

export function AppIcon({ color, name, size = 16 }: AppIconProps) {
  const icon = icons[name];

  if (process.env.EXPO_OS === 'ios') {
    return (
      <Image
        contentFit="contain"
        source={`sf:${icon.sf}`}
        style={{ height: size, width: size }}
        tintColor={color}
      />
    );
  }

  return (
    <Text
      accessibilityElementsHidden
      style={{
        color,
        fontFamily: Fonts.bodyBold,
        fontSize: size,
        lineHeight: size + 2,
        textAlign: 'center',
        width: size,
      }}>
      {icon.fallback}
    </Text>
  );
}
