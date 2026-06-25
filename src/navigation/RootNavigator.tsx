import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransactionDetailsScreen } from '../screens/TransactionDetailsScreen';
import type { RootStackParamList } from '../types';
import { colors } from '../theme';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="TransactionDetails"
          component={TransactionDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
