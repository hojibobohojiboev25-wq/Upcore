import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import { requestNotificationPermission } from '../services/notifications';

const SettingsScreen = ({ navigation }) => {
  const { settings, updateSettings, clearCompletedTasks, palette, t } = useSuccess();

  const onToggleNotifications = async () => {
    const next = !settings.notificationsEnabled;
    if (next) {
      const granted = await requestNotificationPermission();
      updateSettings({ notificationsEnabled: granted });
      return;
    }
    updateSettings({ notificationsEnabled: false });
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.background }]} contentContainerStyle={styles.container}>
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('theme')}</Text>
        <View style={styles.row}>
          {['light', 'dark'].map((themeMode) => (
            <Pressable
              key={themeMode}
              onPress={() => updateSettings({ theme: themeMode })}
              style={[
                styles.chip,
                { backgroundColor: palette.surface, borderColor: palette.border },
                settings.theme === themeMode && { borderColor: palette.primary }
              ]}
            >
              <Text style={[styles.chipText, { color: settings.theme === themeMode ? palette.primary : palette.subText }]}>
                {t(themeMode)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('language')}</Text>
        <View style={styles.row}>
          {[
            { code: 'ru', label: 'RU' },
            { code: 'en', label: 'EN' },
            { code: 'de', label: 'DE' }
          ].map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => updateSettings({ language: lang.code })}
              style={[
                styles.chip,
                { backgroundColor: palette.surface, borderColor: palette.border },
                settings.language === lang.code && { borderColor: palette.primary }
              ]}
            >
              <Text style={[styles.chipText, { color: settings.language === lang.code ? palette.primary : palette.subText }]}>
                {lang.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('notifications')}</Text>
        <Pressable style={[styles.switchRow, { borderColor: palette.border }]} onPress={onToggleNotifications}>
          <Text style={[styles.switchLabel, { color: palette.text }]}>{t('notifications')}</Text>
          <Text style={[styles.switchValue, { color: palette.primary }]}>
            {settings.notificationsEnabled ? t('on') : t('off')}
          </Text>
        </Pressable>
        <Text style={[styles.switchLabel, { color: palette.text }]}>{t('reminderMinutes')}</Text>
        <View style={styles.row}>
          {[10, 20, 30].map((minutes) => (
            <Pressable
              key={minutes}
              onPress={() => updateSettings({ reminderMinutes: minutes })}
              style={[
                styles.chip,
                { backgroundColor: palette.surface, borderColor: palette.border },
                settings.reminderMinutes === minutes && { borderColor: palette.primary }
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: settings.reminderMinutes === minutes ? palette.primary : palette.subText }
                ]}
              >
                {minutes}m
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.info, { color: palette.subText }]}>{t('reminderInfo')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('moreOptions')}</Text>
        <Pressable
          style={[styles.switchRow, { borderColor: palette.border }]}
          onPress={() => updateSettings({ weeklyInsights: !settings.weeklyInsights })}
        >
          <Text style={[styles.switchLabel, { color: palette.text }]}>{t('weeklyInsights')}</Text>
          <Text style={[styles.switchValue, { color: palette.success }]}>
            {settings.weeklyInsights ? t('on') : t('off')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.switchRow, { borderColor: palette.border }]}
          onPress={() => updateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
        >
          <Text style={[styles.switchLabel, { color: palette.text }]}>{t('haptics')}</Text>
          <Text style={[styles.switchValue, { color: palette.primary }]}>
            {settings.hapticsEnabled ? t('on') : t('off')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.switchRow, { borderColor: palette.border }]}
          onPress={() => updateSettings({ twentyFourHour: !settings.twentyFourHour })}
        >
          <Text style={[styles.switchLabel, { color: palette.text }]}>{t('twentyFourHour')}</Text>
          <Text style={[styles.switchValue, { color: palette.primary }]}>
            {settings.twentyFourHour ? t('on') : t('off')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.switchRow, { borderColor: palette.border }]}
          onPress={() =>
            updateSettings({
              weekStartsOn: settings.weekStartsOn === 'monday' ? 'sunday' : 'monday'
            })
          }
        >
          <Text style={[styles.switchLabel, { color: palette.text }]}>{t('startWeekOn')}</Text>
          <Text style={[styles.switchValue, { color: palette.primary }]}>
            {settings.weekStartsOn === 'monday' ? t('monday') : t('sunday')}
          </Text>
        </Pressable>
        <Text style={[styles.switchLabel, { color: palette.text }]}>{t('defaultPriority')}</Text>
        <View style={styles.row}>
          {['low', 'medium', 'high'].map((priority) => (
            <Pressable
              key={priority}
              onPress={() => updateSettings({ defaultPriority: priority })}
              style={[
                styles.chip,
                { backgroundColor: palette.surface, borderColor: palette.border },
                settings.defaultPriority === priority && { borderColor: palette.primary }
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: settings.defaultPriority === priority ? palette.primary : palette.subText }
                ]}
              >
                {t(priority)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={[styles.switchRow, { borderColor: palette.border }]}
          onPress={clearCompletedTasks}
        >
          <Text style={[styles.switchLabel, { color: palette.text }]}>{t('clearCompleted')}</Text>
          <Text style={[styles.switchValue, { color: palette.danger }]}>✓</Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('myApps')}</Text>
        <Text style={[styles.info, { color: palette.subText }]}>{t('trackerNotSupported')}</Text>
        <Pressable
          style={[styles.switchRow, { borderColor: palette.border }]}
          onPress={() => navigation.navigate('Apps')}
        >
          <Text style={[styles.switchLabel, { color: palette.text }]}>{t('addApplication')}</Text>
          <Text style={[styles.switchValue, { color: palette.primary }]}>{'>'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 16, gap: 14, paddingBottom: 40 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10
  },
  title: { fontSize: 18, fontWeight: '800' },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  chipText: { fontWeight: '700' },
  switchRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  switchLabel: { fontWeight: '700' },
  switchValue: { fontWeight: '800' },
  info: { fontSize: 13 }
});

export default SettingsScreen;
