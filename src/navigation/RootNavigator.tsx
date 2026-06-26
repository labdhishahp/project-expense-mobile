import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';

import {
  AddTransactionScreen,
  ManageCategoriesScreen,
  TransactionDetailsScreen,
} from '../screens';
import { useTheme } from '../theme';
import type { RootStackParamList } from '../types';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      contentStyle: { backgroundColor: colors.background },
      animation: 'fade' as const,
    }),
    [colors.background],
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="TransactionDetails"
          component={TransactionDetailsScreen}
        />
        <Stack.Screen
          name="ManageCategories"
          component={ManageCategoriesScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
