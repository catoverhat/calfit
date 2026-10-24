import { View } from 'react-native';

import { useStyles } from '../login-screen.styles';

export function LightningMark() {
  const styles = useStyles();
  return (
    <View accessibilityElementsHidden style={styles.lightning}>
      <View style={styles.lightningTop} />
      <View style={styles.lightningBottom} />
    </View>
  );
}
