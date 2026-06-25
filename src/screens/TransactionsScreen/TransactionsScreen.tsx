import { PlaceholderBox, ScreenContainer } from '../../components';

export function TransactionsScreen() {
  return (
    <ScreenContainer
      title="Transactions"
      subtitle="Your transaction list will appear here."
    >
      <PlaceholderBox label="TransactionsScreen" style={{ flex: 1 }} />
    </ScreenContainer>
  );
}
