import { StyleSheet } from 'react-native';

import { spacing } from '../../theme';
import { PlaceholderBox } from '../PlaceholderBox';

export function SummaryCard() {
  return <PlaceholderBox label="SummaryCard" style={styles.card} />;
}

const styles = StyleSheet.create({
  card: {
    minHeight: 96,
    marginBottom: spacing.md,
  },
});
