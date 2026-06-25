import { StyleSheet } from 'react-native';

import { PlaceholderBox } from '../PlaceholderBox';

export function TransactionList() {
  return <PlaceholderBox label="TransactionList" style={styles.list} />;
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    minHeight: 200,
  },
});
