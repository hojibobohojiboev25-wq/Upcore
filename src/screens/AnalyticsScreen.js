import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import { theme } from '../constants/theme';
import ProgressBar from '../components/ProgressBar';

const AnalyticsScreen = () => {
  const { tasks, goals, metrics } = useSuccess();
  const highPriorityDone = tasks.filter((t) => t.priority === 'high' && t.completed).length;
  const totalHighPriority = tasks.filter((t) => t.priority === 'high').length;
  const goalsOverall = goals.length
    ? Math.round(goals.reduce((sum, g) => sum + (g.current / g.target) * 100, 0) / goals.length)
    : 0;

  const achievements = [
    {
      title: 'Первые шаги',
      reached: metrics.completedTasks >= 1,
      desc: 'Завершена хотя бы 1 задача'
    },
    {
      title: 'Стабильность',
      reached: metrics.streak >= 3,
      desc: 'Серия 3+ дня подряд'
    },
    {
      title: 'Фокус на важном',
      reached: highPriorityDone >= 5,
      desc: '5 выполненных задач с высоким приоритетом'
    },
    {
      title: 'Мастер целей',
      reached: metrics.goalsCompleted >= 1,
      desc: 'Закрыта хотя бы 1 цель'
    }
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>KPI продуктивности</Text>

        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Выполнение задач</Text>
          <Text style={styles.metricValue}>{metrics.completionRate}%</Text>
          <ProgressBar value={metrics.completionRate} max={100} />
        </View>

        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Высокий приоритет</Text>
          <Text style={styles.metricValue}>
            {highPriorityDone}/{totalHighPriority || 0}
          </Text>
          <ProgressBar
            value={highPriorityDone}
            max={totalHighPriority || 1}
            color={theme.colors.warning}
          />
        </View>

        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Общий прогресс целей</Text>
          <Text style={styles.metricValue}>{goalsOverall}%</Text>
          <ProgressBar value={goalsOverall} max={100} color={theme.colors.success} />
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Достижения</Text>
        <View style={styles.achievementList}>
          {achievements.map((achievement) => (
            <View
              key={achievement.title}
              style={[
                styles.achievementCard,
                achievement.reached ? styles.achievementDone : styles.achievementPending
              ]}
            >
              <Text style={styles.achievementTitle}>
                {achievement.reached ? '🏅' : '🔒'} {achievement.title}
              </Text>
              <Text style={styles.achievementDesc}>{achievement.desc}</Text>
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
    backgroundColor: theme.colors.background
  },
  container: {
    padding: 16,
    gap: 14,
    paddingBottom: 40
  },
  panel: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 12
  },
  panelTitle: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 18
  },
  metricBlock: {
    gap: 6
  },
  metricLabel: {
    color: theme.colors.subText,
    fontWeight: '700'
  },
  metricValue: {
    color: theme.colors.text,
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
    borderColor: 'rgba(35, 193, 107, 0.4)',
    backgroundColor: 'rgba(35, 193, 107, 0.12)'
  },
  achievementPending: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface
  },
  achievementTitle: {
    color: theme.colors.text,
    fontWeight: '700'
  },
  achievementDesc: {
    color: theme.colors.subText
  }
});

export default AnalyticsScreen;
