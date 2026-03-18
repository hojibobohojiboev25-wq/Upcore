import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { SuccessProvider } from './src/context/SuccessContext';
import DashboardScreen from './src/screens/DashboardScreen';
import TasksScreen from './src/screens/TasksScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import IntroSplashScreen from './src/screens/IntroSplashScreen';
import AppsScreen from './src/screens/AppsScreen';
import AppAnalyticsDetailScreen from './src/screens/AppAnalyticsDetailScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import { useSuccess } from './src/context/SuccessContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIconMap = {
  Home: 'home-outline',
  Tasks: 'checkmark-circle-outline',
  Goals: 'flag-outline',
  Analytics: 'stats-chart-outline',
  Profile: 'person-outline'
};

const MainTabs = () => {
  const { palette, t } = useSuccess();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: palette.background },
        headerTitleStyle: { color: palette.text, fontWeight: '700' },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
          height: 62,
          paddingBottom: 10,
          paddingTop: 10
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.subText,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIconMap[route.name]} size={size + 2} color={color} />
        )
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: t('home') }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: t('tasks') }} />
      <Tab.Screen name="Goals" component={GoalsScreen} options={{ title: t('goals') }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: t('analytics') }} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: t('profile'),
          headerRight: () => (
            <Pressable onPress={() => navigation.getParent()?.navigate('Settings')} style={{ padding: 4 }}>
              <Ionicons name="settings-outline" size={24} color={palette.text} />
            </Pressable>
          )
        })}
      />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  const { loaded, profile, palette, t } = useSuccess();
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const hideSystemUi = async () => {
      if (Platform.OS !== 'android') return;
      await NavigationBar.setPositionAsync('absolute');
      await NavigationBar.setBackgroundColorAsync('#00000000');
      await NavigationBar.setBehaviorAsync('overlay-swipe');
      await NavigationBar.setVisibilityAsync('hidden');
    };
    hideSystemUi();
  }, []);

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  if (!introDone) {
    return <IntroSplashScreen onDone={() => setIntroDone(true)} />;
  }

  if (!profile?.ready) {
    return <WelcomeScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: t('settings'),
            headerStyle: { backgroundColor: palette.background },
            headerTintColor: palette.text
          }}
        />
        <Stack.Screen
          name="Apps"
          component={AppsScreen}
          options={{
            title: t('myApps'),
            headerStyle: { backgroundColor: palette.background },
            headerTintColor: palette.text
          }}
        />
        <Stack.Screen
          name="AppAnalyticsDetail"
          component={AppAnalyticsDetailScreen}
          options={{
            title: t('appAnalytics'),
            headerStyle: { backgroundColor: palette.background },
            headerTintColor: palette.text
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            title: t('editProfile'),
            headerStyle: { backgroundColor: palette.background },
            headerTintColor: palette.text
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SuccessProvider>
        <AppContent />
      </SuccessProvider>
    </SafeAreaProvider>
  );
}
