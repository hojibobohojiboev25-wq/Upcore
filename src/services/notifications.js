import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

export const setupNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('upcore-reminders', {
      name: 'Upcore reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 200, 200],
      lightColor: '#4F8CFF'
    });
  }
};

export const requestNotificationPermission = async () => {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
};

export const scheduleTaskReminder = async ({
  taskTitle,
  dueAtISO,
  minutesBefore = 20
}) => {
  const dueAt = new Date(dueAtISO);
  const triggerDate = new Date(dueAt.getTime() - minutesBefore * 60 * 1000);
  if (Number.isNaN(triggerDate.getTime())) return null;
  if (triggerDate.getTime() <= Date.now()) return null;

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Upcore',
      body: `Task reminder: ${taskTitle}`
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate
    }
  });
  return identifier;
};

export const cancelTaskReminder = async (notificationId) => {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    // ignore cancel errors for stale ids
  }
};
