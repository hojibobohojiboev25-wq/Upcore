import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import { theme } from '../constants/theme';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';

const DashboardScreen = () => {
  const { metrics, goals, setDailyTaskTarget } = useSuccess();
  const [targetDraft, setTargetDraft] = useState(String(metrics.dailyTaskTarget));
  useEffect(() => {
    setTargetDraft(String(metrics.dailyTaskTarget));
  }, [metrics.dailyTaskTarget]);
  const avgGoalCompletion = goals.length
    ? Math.round(
        goals.reduce((sum, g) => sum + Math.round((g.current / g.target) * 100), 0) / goals.length
      )
    : 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Success Tracker Pro</Text>
      <Text style={styles.subtitle}>Твой ежедневный центр продуктивности и роста</Text>

      <View style={styles.cardRow}>
        <StatCard title="Серия дней" value={`${metrics.streak}`} subtitle="Дней подряд с прогрессом" />
        <StatCard title="Выполнение задач" value={`${metrics.completionRate}%`} subtitle="Общий процент" />
      </View>

      <View style={styles.cardRow}>
        <StatCard title="Завершено задач" value={`${metrics.completedTasks}`} subtitle={`из ${metrics.totalTasks}`} />
        <StatCard title="Закрыто целей" value={`${metrics.goalsCompleted}`} subtitle={`из ${goals.length}`} />
      </View>

      <View style={styles.cardRow}>
        <StatCard title="Продуктивность" value={`${metrics.productivityScore}%`} subtitle="Интегральный KPI" />
        <StatCard
          title="Сегодня"
          value={`${metrics.todaysCompleted}/${metrics.dailyTaskTarget}`}
          subtitle="Выполнено задач"
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Прогресс по целям</Text>
        <Text style={styles.panelValue}>{avgGoalCompletion}%</Text>
        <ProgressBar value={avgGoalCompletion} max={100} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>План на день</Text>
        <Text style={styles.helperText}>
          Цель на сегодня: {metrics.dailyTaskTarget} задач, закрыто {metrics.todaysCompleted}
        </Text>
        <ProgressBar value={metrics.todayTargetPercent} max={100} color={theme.colors.warning} />
        <View style={styles.targetRow}>
          <TextInput
            value={targetDraft}
            onChangeText={setTargetDraft}
            keyboardType="numeric"
            placeholder="Цель в день"
            placeholderTextColor={theme.colors.subText}
            style={styles.targetInput}
          />
          <Pressable
            style={styles.applyBtn}
            onPress={() => {
              setDailyTaskTarget(targetDraft);
            }}
          >
            <Text style={styles.applyBtnText}>Сохранить</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Последние 7 дней</Text>
        <View style={styles.weekRow}>
          {metrics.last7days.map((item) => {
            const height = Math.max(6, Math.min(48, item.done * 12));
            return (
              <View key={String(item.date)} style={styles.dayCol}>
                <View style={[styles.bar, { height }]} />
                <Text style={styles.dayText}>{item.date.getDate()}</Text>
              </View>
            );
          })}
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
  title: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 24
  },
  subtitle: {
    color: theme.colors.subText,
    marginTop: -4,
    marginBottom: 6
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10
  },
  panel: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 10
  },
  panelTitle: {
    color: theme.colors.subText,
    fontWeight: '700'
  },
  panelValue: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800'
  },
  helperText: {
    color: theme.colors.subText,
    fontSize: 13
  },
  targetRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8
  },
  targetInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 10,
    color: theme.colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  applyBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center'
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '800'
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8
  },
  dayCol: {
    alignItems: 'center',
    gap: 8
  },
  bar: {
    width: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary
  },
  dayText: {
    color: theme.colors.subText,
    fontSize: 12
  }
});

export default DashboardScreen;
