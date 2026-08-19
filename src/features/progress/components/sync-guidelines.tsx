import { Text, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { SemanticColors } from '@/theme/tokens';
import { styles } from '../offline-sync-states-screen.styles';

export type SyncGuideline = {
  body: string;
  icon: AppIconName;
  title: string;
  tone: 'info' | 'local';
};

export function SyncGuidelines({ guidelines }: { guidelines: SyncGuideline[] }) {
  return (
    <View style={styles.guidelinesBlock}>
      <Text style={styles.guidelinesTitle}>System Guidelines</Text>
      <View style={styles.guidelinesList}>
        {guidelines.map((guideline) => (
          <View key={guideline.title} style={styles.guidelineRow}>
            <View
              style={[
                styles.guidelineIcon,
                guideline.tone === 'info' ? styles.guidelineIconInfo : styles.guidelineIconLocal,
              ]}>
              <AppIcon
                color={guideline.tone === 'info' ? SemanticColors.info : SemanticColors.action}
                name={guideline.icon}
                size={15}
              />
            </View>
            <View style={styles.guidelineCopy}>
              <Text style={styles.guidelineTitle}>{guideline.title}</Text>
              <Text style={styles.guidelineBody}>{guideline.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
