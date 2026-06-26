import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMemo } from 'react';

import { getTabBarBottomInset, TAB_LABELS, TAB_ROUTES } from '../constants';
import { HomeScreen, SettingsScreen, TransactionsScreen } from '../screens';
import { useTheme } from '../theme';
import type { MainTabParamList } from '../types';
import { FloatingTabBar } from './FloatingTabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const { colors } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      tabBarActiveTintColor: colors.tabBarActive,
      tabBarInactiveTintColor: colors.tabBarInactive,
    }),
    [colors.tabBarActive, colors.tabBarInactive],
  );

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name={TAB_ROUTES.Home}
        component={HomeScreen}
        options={{
          title: TAB_LABELS.Home,
          tabBarStyle: { position: 'absolute' },
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.Transactions}
        component={TransactionsScreen}
        options={{ title: TAB_LABELS.Transactions }}
      />
      <Tab.Screen
        name={TAB_ROUTES.Settings}
        component={SettingsScreen}
        options={{ title: TAB_LABELS.Settings }}
      />
    </Tab.Navigator>
  );
}

export { getTabBarBottomInset };
