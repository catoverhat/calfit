import { View } from 'react-native';

import { styles } from '../login-screen.styles';

export function LightningMark() {
  return (
    <View accessibilityElementsHidden style={styles.lightning}>
      <View style={styles.lightningTop} />
      <View style={styles.lightningBottom} />
    </View>
  );
}
