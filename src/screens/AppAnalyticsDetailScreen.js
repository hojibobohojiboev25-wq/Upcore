import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import { formatDate, formatDuration, formatTime } from '../utils/date';

const AppAnalyticsDetailScreen = ({ route }) => {
  const { appId } = route.params || {};
  const { trackedApps, settings, palette, t } = useSuccess();
  const app = trackedApps.find((item) => item.id === appId);

  const sessionsByDay = useMemo(() => {
    if (!app) return [];
    const map = new Map();
    (app.sessions || []).forEach((session) => {
      const key = formatDate(session.startedAt);
      const prev = map.get(key) || 0;
      map.set(key, prev + (session.durationSec || 0));
    });
    return [...map.entries()]
      .map(([date, sec]) => ({ date, sec }))
      .sort((a, b) => {
        const [ad, am, ay] = a.date.split('.').map(Number);
        const [bd, bm, by] = b.date.split('.').map(Number);
        return new Date(by, bm - 1, bd).getTime() - new Date(ay, am - 1, ad).getTime();
      });
  }, [app]);

  if (!app) {
    return (
      <View style={[styles.emptyWrap, { backgroundColor: palette.background }]}>
        <Text style={{ color: palette.subText }}>{t('noAppsYet')}</Text>
      </View>
    );
  }

  const maxSec = Math.max(...sessionsByDay.map((item) => item.sec), 1);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.background }]} contentContainerStyle={styles.container}>
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.appName, { color: palette.text }]}>{app.name}</Text>
        <Text style={[styles.meta, { color: palette.subText }]}>
          {t('totalTime')}: {formatDuration(app.totalSeconds || 0)}
        </Text>
        <Text style={[styles.meta, { color: palette.subText }]}>
          {t('openCount')}: {app.openCount || 0} | {t('sessions')}: {(app.sessions || []).length}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('appTimeline')}</Text>
        {sessionsByDay.length === 0 ? (
          <Text style={{ color: palette.subText }}>{t('noAppsYet')}</Text>
        ) : (
          sessionsByDay.map((item) => (
            <View key={item.date} style={styles.barRow}>
              <Text style={[styles.barLabel, { color: palette.subText }]}>{item.date}</Text>
              <View style={[styles.track, { backgroundColor: palette.border }]}>
                <View
                  style={[
                    styles.fill,
                    {
                      backgroundColor: palette.primary,
                      width: `${Math.round((item.sec / maxSec) * 100)}%`
                    }
                  ]}
                />
              </View>
              <Text style={[styles.barValue, { color: palette.text }]}>{formatDuration(item.sec)}</Text>
            </View>
          ))
        )}
      </View>

      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('sessions')}</Text>
        {(app.sessions || []).length === 0 ? (
          <Text style={{ color: palette.subText }}>{t('noAppsYet')}</Text>
        ) : (
          app.sessions
            .slice()
            .reverse()
            .map((session, index) => (
              <View key={`${session.startedAt}_${index}`} style={[styles.sessionRow, { borderBottomColor: palette.border }]}>
                <Text style={[styles.meta, { color: palette.text }]}>
                  {formatDate(session.startedAt)} {formatTime(session.startedAt, settings.twentyFourHour)}
                </Text>
                <Text style={[styles.meta, { color: palette.subText }]}>
                  {formatDuration(session.durationSec)}
                </Text>
              </View>
            ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 16, gap: 12, paddingBottom: 36 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10
  },
  appName: {
    fontSize: 20,
    fontWeight: '900'
  },
  meta: {
    fontSize: 13
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800'
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  barLabel: {
    width: 72,
    fontSize: 12
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    overflow: 'hidden'
  },
  fill: {
    height: '100%'
  },
  barValue: {
    width: 64,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '700'
  },
  sessionRow: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default AppAnalyticsDetailScreen;
