import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts as useMontserratFonts,
} from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';

export function useAppFonts() {
  const [interLoaded, interError] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [montserratLoaded, montserratError] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });
  const [iconsLoaded, iconsError] = useFonts({
    Lucide: require('@react-native-vector-icons/lucide/fonts/Lucide.ttf'),
  });

  return [
    interLoaded && montserratLoaded && iconsLoaded,
    interError ?? montserratError ?? iconsError,
  ] as const;
}
