import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import { formatDuration } from '../utils/date';

const suggestions = [
  'YouTube',
  'Instagram',
  'Telegram',
  'WhatsApp',
  'TikTok',
  'Chrome',
  'Spotify',
  'Gmail',
  'Google Maps',
  'X',
  'Netflix',
  'LinkedIn'
];

const AppsScreen = ({ navigation }) => {
  const { trackedApps, addTrackedApp, startTrackedApp, stopTrackedApp, removeTrackedApp, palette, t } =
    useSuccess();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  const sortedApps = useMemo(
    () => [...trackedApps].sort((a, b) => (b.totalSeconds || 0) - (a.totalSeconds || 0)),
    [trackedApps]
  );

  const quickAdd = (appName) => {
    const created = addTrackedApp({ name: appName, category: 'General' });
    if (!created) return;
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.background }]} contentContainerStyle={styles.container}>
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('addApplication')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('appNameInput')}
          placeholderTextColor={palette.subText}
          style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
        />
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder={t('appCategoryInput')}
          placeholderTextColor={palette.subText}
          style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
        />
        <Pressable
          style={[styles.primary, { backgroundColor: palette.primary }]}
          onPress={() => {
            const ok = addTrackedApp({ name, category });
            if (!ok) return;
            setName('');
            setCategory('');
          }}
        >
          <Text style={styles.primaryText}>{t('addApplication')}</Text>
        </Pressable>
        <View style={styles.quickRow}>
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion}
              style={[styles.chip, { borderColor: palette.border, backgroundColor: palette.surface }]}
              onPress={() => quickAdd(suggestion)}
            >
              <Text style={[styles.chipText, { color: palette.subText }]}>{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {sortedApps.length === 0 ? (
        <Text style={[styles.empty, { color: palette.subText }]}>{t('noAppsYet')}</Text>
      ) : (
        sortedApps.map((app) => (
          <View key={app.id} style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Text style={[styles.appName, { color: palette.text }]}>{app.name}</Text>
            <Text style={[styles.meta, { color: palette.subText }]}>
              {t('totalTime')}: {formatDuration(app.totalSeconds)} | {t('openCount')}: {app.openCount || 0}
            </Text>
            <Text style={[styles.meta, { color: app.isRunning ? palette.success : palette.subText }]}>
              {app.isRunning ? t('runningNow') : `${t('sessions')}: ${(app.sessions || []).length}`}
            </Text>
            <View style={styles.actions}>
              <Pressable
                style={[styles.action, { borderColor: palette.border }]}
                onPress={() => (app.isRunning ? stopTrackedApp(app.id) : startTrackedApp(app.id))}
              >
                <Text style={[styles.actionText, { color: palette.primary }]}>
                  {app.isRunning ? t('stop') : t('start')}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.action, { borderColor: palette.border }]}
                onPress={() => navigation.navigate('AppAnalyticsDetail', { appId: app.id })}
              >
                <Text style={[styles.actionText, { color: palette.text }]}>{t('details')}</Text>
              </Pressable>
              <Pressable
                style={[styles.action, { borderColor: palette.border }]}
                onPress={() => removeTrackedApp(app.id)}
              >
                <Text style={[styles.actionText, { color: palette.danger }]}>{t('delete')}</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 16, gap: 12, paddingBottom: 40 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10
  },
  title: { fontSize: 18, fontWeight: '800' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  primary: {
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12
  },
  primaryText: {
    color: '#fff',
    fontWeight: '800'
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600'
  },
  appName: { fontSize: 17, fontWeight: '800' },
  meta: { fontSize: 13 },
  actions: {
    flexDirection: 'row',
    gap: 8
  },
  action: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 8
  },
  actionText: {
    fontWeight: '700'
  },
  empty: {
    textAlign: 'center',
    marginTop: 18
  }
});

export default AppsScreen;
