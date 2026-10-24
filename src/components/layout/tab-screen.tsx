import { useAppTheme } from '@/theme/app-theme-provider';
import { ScrollView, StyleSheet, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export type TabScreenProps = Omit<
  ScrollViewProps,
  "contentInsetAdjustmentBehavior"
>;

/**
 * Scrollable root for top-level tab routes.
 *
 * Native tabs handle the bottom inset. This container owns the top inset so
 * scrollable content never renders behind Android's edge-to-edge status bar.
 */
export function TabScreen({ style, ...props }: TabScreenProps) {
  const { SemanticColors } = useAppTheme();
  const backgroundStyle = { backgroundColor: SemanticColors.canvas };

  return (
    <SafeAreaView
      collapsable={false}
      edges={["top"]}
      style={[styles.safeArea, backgroundStyle]}
    >
      <ScrollView
        {...props}
        contentInsetAdjustmentBehavior="never"
        style={[styles.scrollView, backgroundStyle, style]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
