import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';

import { TAB_LABELS, TAB_ROUTES } from '../constants';
import { HomeScreen, SettingsScreen, TransactionsScreen } from '../screens';
import { colors } from '../theme';
import type { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof MainTabParamList, TabIconName> = {
  Home: 'home-outline',
  Transactions: 'document-text-outline',
  Settings: 'settings-outline',
};

const TAB_ICONS_FOCUSED: Record<keyof MainTabParamList, TabIconName> = {
  Home: 'home',
  Transactions: 'document-text',
  Settings: 'settings',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused
            ? TAB_ICONS_FOCUSED[route.name]
            : TAB_ICONS[route.name];

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={TAB_ROUTES.Home}
        component={HomeScreen}
        options={{ title: TAB_LABELS.Home }}
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
