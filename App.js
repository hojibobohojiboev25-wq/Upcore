import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SuccessProvider } from './src/context/SuccessContext';
import DashboardScreen from './src/screens/DashboardScreen';
import TasksScreen from './src/screens/TasksScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import { theme } from './src/constants/theme';

const Tab = createBottomTabNavigator();

const tabIcon = (emoji, color) => (
  <Text style={{ fontSize: 18, color }}>{emoji}</Text>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <SuccessProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.background },
              headerTitleStyle: { color: theme.colors.text, fontWeight: '700' },
              headerShadowVisible: false,
              tabBarStyle: {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.border,
                height: 68,
                paddingBottom: 8,
                paddingTop: 8
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.subText
            }}
          >
            <Tab.Screen
              name="Главная"
              component={DashboardScreen}
              options={{
                tabBarIcon: ({ color }) => tabIcon('🏆', color)
              }}
            />
            <Tab.Screen
              name="Задачи"
              component={TasksScreen}
              options={{
                tabBarIcon: ({ color }) => tabIcon('✅', color)
              }}
            />
            <Tab.Screen
              name="Цели"
              component={GoalsScreen}
              options={{
                tabBarIcon: ({ color }) => tabIcon('🎯', color)
              }}
            />
            <Tab.Screen
              name="Аналитика"
              component={AnalyticsScreen}
              options={{
                tabBarIcon: ({ color }) => tabIcon('📈', color)
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SuccessProvider>
    </SafeAreaProvider>
  );
}
