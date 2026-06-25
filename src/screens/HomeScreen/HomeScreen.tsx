import { StyleSheet, View } from 'react-native';

import {
  BalanceCard,
  FloatingActionButton,
  ScreenContainer,
  SummaryCard,
  TransactionList,
} from '../../components';

export function HomeScreen() {
  return (
    <ScreenContainer
      title="Home"
      subtitle="Your expense overview will appear here."
    >
      <View style={styles.dashboard}>
        <BalanceCard />
        <SummaryCard />
        <TransactionList />
      </View>
      <FloatingActionButton />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    flex: 1,
  },
});
