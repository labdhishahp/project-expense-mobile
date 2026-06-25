import { StyleSheet } from 'react-native';

import { spacing } from '../../theme';
import { PlaceholderBox } from '../PlaceholderBox';

export function BalanceCard() {
  return <PlaceholderBox label="BalanceCard" style={styles.card} />;
}

const styles = StyleSheet.create({
  card: {
    minHeight: 120,
    marginBottom: spacing.md,
  },
});
