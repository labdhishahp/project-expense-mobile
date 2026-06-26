import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_BAR_BOTTOM_MARGIN,
  TAB_BAR_HEIGHT,
  TAB_BAR_HORIZONTAL_MARGIN,
} from '../constants';
import { radius, shadows, spacing, useTheme } from '../theme';
import type { MainTabParamList } from '../types';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof MainTabParamList, IoniconName> = {
  Home: 'home-outline',
  Transactions: 'document-text-outline',
  Settings: 'settings-outline',
};

const TAB_ICONS_FOCUSED: Record<keyof MainTabParamList, IoniconName> = {
  Home: 'home',
  Transactions: 'document-text',
  Settings: 'settings',
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          position: 'absolute',
          left: TAB_BAR_HORIZONTAL_MARGIN,
          right: TAB_BAR_HORIZONTAL_MARGIN,
          bottom: Math.max(insets.bottom, TAB_BAR_BOTTOM_MARGIN),
        },
        bar: {
          height: TAB_BAR_HEIGHT,
          borderRadius: 20,
          backgroundColor: colors.tabBarBackground,
          borderWidth: 1,
          borderColor: colors.tabBarBorder,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.sm,
          ...shadows.md,
        },
        tab: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.sm,
        },
        label: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
      }),
    [colors, insets.bottom],
  );

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel?.toString() ??
            options.title ??
            route.name;
          const isFocused = state.index === index;
          const color = isFocused ? colors.tabBarActive : colors.tabBarInactive;
          const iconName = isFocused
            ? TAB_ICONS_FOCUSED[route.name as keyof MainTabParamList]
            : TAB_ICONS[route.name as keyof MainTabParamList];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={onPress}
              style={({ pressed }) => [styles.tab, pressed && { opacity: 0.75 }]}
            >
              <Ionicons name={iconName} size={22} color={color} />
              <Text style={[styles.label, { color }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
