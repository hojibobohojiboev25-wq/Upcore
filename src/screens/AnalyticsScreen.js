import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import ProgressBar from '../components/ProgressBar';
import { generateProgressInsight } from '../services/aiCoach';

const AnalyticsScreen = () => {
  const { tasks, goals, metrics, trackedApps, settings, profile, palette, t } = useSuccess();
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const highPriorityDone = tasks.filter((t) => t.priority === 'high' && t.completed).length;
  const totalHighPriority = tasks.filter((t) => t.priority === 'high').length;
  const goalsOverall = goals.length
    ? Math.round(goals.reduce((sum, g) => sum + (g.current / g.target) * 100, 0) / goals.length)
    : 0;

  const achievements = [
    {
      title: t('firstSteps'),
      reached: metrics.completedTasks >= 1,
      desc: t('firstStepsDesc')
    },
    {
      title: t('stability'),
      reached: metrics.streak >= 3,
      desc: t('stabilityDesc')
    },
    {
      title: t('focus'),
      reached: highPriorityDone >= 5,
      desc: t('focusDesc')
    },
    {
      title: t('goalsMaster'),
      reached: metrics.goalsCompleted >= 1,
      desc: t('goalsMasterDesc')
    }
  ];

  const appUsageByDay = metrics.last7days.map((day) => {
    const key = day.date.toDateString();
    const totalSec = trackedApps.reduce((sum, app) => {
      const sec = (app.sessions || [])
        .filter((session) => new Date(session.startedAt).toDateString() === key)
        .reduce((acc, session) => acc + (session.durationSec || 0), 0);
      return sum + sec;
    }, 0);
    return { day: day.date.getDate(), sec: totalSec };
  });
  const maxUsageSec = Math.max(1, ...appUsageByDay.map((item) => item.sec));
  const allSessions = trackedApps.flatMap((app) => app.sessions || []);
  const totalSessionSec = allSessions.reduce((sum, session) => sum + (session.durationSec || 0), 0);
  const avgSessionSec = allSessions.length ? Math.round(totalSessionSec / allSessions.length) : 0;
  const hourHistogram = Array.from({ length: 24 }).map((_, hour) => {
    const count = allSessions.filter((session) => new Date(session.startedAt).getHours() === hour).length;
    return { hour, count };
  });
  const topHour = hourHistogram.reduce((best, item) => (item.count > best.count ? item : best), {
    hour: 0,
    count: 0
  });

  const onGenerateAiInsight = async () => {
    setAiLoading(true);
    try {
      const text = await generateProgressInsight({
        language: settings.language,
        profile,
        metrics,
        tasks,
        goals,
        trackedApps
      });
      setAiInsight(text || t('aiError'));
    } catch (error) {
      setAiInsight(t('aiError'));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: palette.background }]}
      contentContainerStyle={[styles.container, settings.compactMode && styles.compactContainer]}
    >
      <View style={[styles.panel, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.panelTitle, { color: palette.text }]}>{t('kpi')}</Text>

        <View style={styles.metricBlock}>
          <Text style={[styles.metricLabel, { color: palette.subText }]}>{t('completedTasks')}</Text>
          <Text style={[styles.metricValue, { color: palette.text }]}>{metrics.completionRate}%</Text>
          <ProgressBar value={metrics.completionRate} max={100} color={palette.primary} trackColor={palette.border} />
        </View>

        <View style={styles.metricBlock}>
          <Text style={[styles.metricLabel, { color: palette.subText }]}>{t('priority')}</Text>
          <Text style={[styles.metricValue, { color: palette.text }]}>
            {highPriorityDone}/{totalHighPriority || 0}
          </Text>
          <ProgressBar
            value={highPriorityDone}
            max={totalHighPriority || 1}
            color={palette.warning}
            trackColor={palette.border}
          />
        </View>

        <View style={styles.metricBlock}>
          <Text style={[styles.metricLabel, { color: palette.subText }]}>{t('goals')}</Text>
          <Text style={[styles.metricValue, { color: palette.text }]}>{goalsOverall}%</Text>
          <ProgressBar value={goalsOverall} max={100} color={palette.success} trackColor={palette.border} />
        </View>
      </View>

      <View style={[styles.panel, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.panelTitle, { color: palette.text }]}>{t('achievements')}</Text>
        <View style={styles.achievementList}>
          {achievements.map((achievement) => (
            <View
              key={achievement.title}
              style={[
                styles.achievementCard,
                achievement.reached
                  ? [styles.achievementDone, { borderColor: 'rgba(35, 193, 107, 0.4)' }]
                  : [styles.achievementPending, { borderColor: palette.border, backgroundColor: palette.surface }]
              ]}
            >
              <Text style={[styles.achievementTitle, { color: palette.text }]}>
                {achievement.title}
              </Text>
              <Text style={[styles.achievementDesc, { color: palette.subText }]}>{achievement.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.panel, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.panelTitle, { color: palette.text }]}>{t('usagePerDay')}</Text>
        <View style={styles.usageBars}>
          {appUsageByDay.map((item) => (
            <View key={String(item.day)} style={styles.usageCol}>
              <View style={[styles.usageTrack, { backgroundColor: palette.border }]}>
                <View
                  style={[
                    styles.usageFill,
                    {
                      backgroundColor: palette.primary,
                      height: `${Math.round((item.sec / maxUsageSec) * 100)}%`
                    }
                  ]}
                />
              </View>
              <Text style={[styles.usageDay, { color: palette.subText }]}>{item.day}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.metricLabel, { color: palette.subText }]}>
          {t('avgSession')}: {Math.max(0, Math.floor(avgSessionSec / 60))}m
        </Text>
        <Text style={[styles.metricLabel, { color: palette.subText }]}>
          {t('mostActiveHour')}: {String(topHour.hour).padStart(2, '0')}:00
        </Text>
      </View>

      <View style={[styles.panel, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.panelTitle, { color: palette.text }]}>{t('aiCoach')}</Text>
        <Pressable
          style={[styles.aiBtn, { backgroundColor: palette.primary }]}
          onPress={onGenerateAiInsight}
          disabled={aiLoading}
        >
          {aiLoading ? (
            <View style={styles.aiLoadingRow}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.aiBtnText}>{t('aiLoading')}</Text>
            </View>
          ) : (
            <Text style={styles.aiBtnText}>{t('generateInsight')}</Text>
          )}
        </Pressable>
        <Text style={[styles.aiTitle, { color: palette.text }]}>{t('aiInsightTitle')}</Text>
        <Text style={[styles.aiBody, { color: palette.subText }]}>
          {aiInsight || t('aiInsightPlaceholder')}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1220'
  },
  container: {
    padding: 16,
    gap: 14,
    paddingBottom: 40
  },
  compactContainer: {
    padding: 12,
    gap: 10
  },
  panel: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 12
  },
  panelTitle: {
    fontWeight: '800',
    fontSize: 18
  },
  metricBlock: {
    gap: 6
  },
  metricLabel: {
    fontWeight: '700'
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800'
  },
  achievementList: {
    gap: 8
  },
  achievementCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 4
  },
  achievementDone: {
    backgroundColor: 'rgba(35, 193, 107, 0.12)'
  },
  achievementPending: {
    borderColor: '#253453',
    backgroundColor: '#111A2E'
  },
  achievementTitle: {
    fontWeight: '700'
  },
  achievementDesc: {},
  usageBars: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  usageCol: {
    alignItems: 'center',
    gap: 6
  },
  usageTrack: {
    width: 18,
    height: 90,
    borderRadius: 9,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  usageFill: {
    width: '100%',
    minHeight: 4
  },
  usageDay: {
    fontSize: 11
  },
  aiBtn: {
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12
  },
  aiBtnText: {
    color: '#fff',
    fontWeight: '800'
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  aiBody: {
    fontSize: 13,
    lineHeight: 20
  },
  aiLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
});

export default AnalyticsScreen;
