import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import { requestNotificationPermission } from '../services/notifications';

const SettingsScreen = () => {
  const { settings, updateSettings, palette, t } = useSuccess();

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
        <Text style={[styles.info, { color: palette.subText }]}>{t('reminderInfo')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('moreOptions')}</Text>
        <Pressable style={[styles.switchRow, { borderColor: palette.border }]}>
          <Text style={[styles.switchLabel, { color: palette.text }]}>{t('weeklyInsights')}</Text>
          <Text style={[styles.switchValue, { color: palette.success }]}>{t('on')}</Text>
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
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10
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
