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

export function EnvelopeIcon() {
  return (
    <View accessibilityElementsHidden style={styles.envelope}>
      <View style={styles.envelopeFlapLeft} />
      <View style={styles.envelopeFlapRight} />
    </View>
  );
}
