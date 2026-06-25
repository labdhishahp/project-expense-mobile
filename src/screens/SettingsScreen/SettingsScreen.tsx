import { PlaceholderBox, ScreenContainer } from '../../components';

export function SettingsScreen() {
  return (
    <ScreenContainer
      title="Settings"
      subtitle="App preferences and category management will appear here."
    >
      <PlaceholderBox label="SettingsScreen" style={{ flex: 1 }} />
    </ScreenContainer>
  );
}
