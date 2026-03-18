import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import ProgressBar from '../components/ProgressBar';

const AnalyticsScreen = () => {
  const { tasks, goals, metrics, settings, palette, t } = useSuccess();
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
  achievementDesc: {}
});

export default AnalyticsScreen;
