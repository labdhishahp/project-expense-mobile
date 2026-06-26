import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, SettingsRow } from '../../components';
import { APP_NAME, APP_VERSION, CURRENCY, getTabBarBottomInset } from '../../constants';
import { spacing, typography, useTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

export function SettingsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          paddingHorizontal: spacing.md,
          paddingTop: spacing.lg,
          marginBottom: spacing.md,
        },
        title: {
          ...typography.screenTitle,
          color: colors.text,
        },
        content: {
          paddingHorizontal: spacing.md,
          paddingBottom: getTabBarBottomInset(insets.bottom) + spacing.md,
        },
        card: {
          padding: 0,
          overflow: 'hidden',
        },
      }),
    [colors, insets.bottom],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <SettingsRow title="Currency" value={CURRENCY.symbol} showChevron={false} />
          <SettingsRow
            title="Manage Categories"
            onPress={() => navigation.navigate('ManageCategories')}
          />
          <SettingsRow
            title="Export Data"
            subtitle="Coming soon"
            disabled
            showChevron={false}
          />
          <SettingsRow title="About App" value={APP_NAME} showChevron={false} />
          <SettingsRow
            title="App Version"
            value={APP_VERSION}
            isLast
            showChevron={false}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
