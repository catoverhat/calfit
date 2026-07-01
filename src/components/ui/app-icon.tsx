import { Image } from 'expo-image';
import { Text } from 'react-native';

import { Fonts } from '@/constants/theme';

export type AppIconName =
  | 'bell'
  | 'cloud'
  | 'clock'
  | 'intensity'
  | 'flame'
  | 'calories'
  | 'trophy'
  | 'strength'
  | 'play'
  | 'add'
  | 'edit'
  | 'open'
  | 'briefcase'
  | 'body'
  | 'running'
  | 'today'
  | 'routines'
  | 'exercises'
  | 'home'
  | 'workouts'
  | 'progress'
  | 'profile';

const icons: Record<AppIconName, { sf: string; fallback: string }> = {
  bell: { sf: 'bell', fallback: 'B' },
  cloud: { sf: 'icloud', fallback: 'C' },
  clock: { sf: 'clock', fallback: 'C' },
  intensity: { sf: 'bolt.fill', fallback: 'I' },
  flame: { sf: 'flame.fill', fallback: 'F' },
  calories: { sf: 'figure.run', fallback: 'K' },
  trophy: { sf: 'trophy.fill', fallback: 'T' },
  strength: { sf: 'dumbbell.fill', fallback: 'S' },
  play: { sf: 'play.fill', fallback: '>' },
  add: { sf: 'plus', fallback: '+' },
  edit: { sf: 'pencil', fallback: 'P' },
  open: { sf: 'arrow.up.right.square', fallback: 'O' },
  briefcase: { sf: 'briefcase.fill', fallback: 'L' },
  body: { sf: 'figure.strengthtraining.traditional', fallback: 'F' },
  running: { sf: 'figure.run', fallback: 'R' },
  today: { sf: 'calendar', fallback: 'D' },
  routines: { sf: 'figure.run', fallback: 'R' },
  exercises: { sf: 'list.bullet.rectangle', fallback: 'E' },
  home: { sf: 'house.fill', fallback: 'H' },
  workouts: { sf: 'dumbbell.fill', fallback: 'W' },
  progress: { sf: 'chart.bar.fill', fallback: 'P' },
  profile: { sf: 'person.fill', fallback: 'U' },
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
