import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Modal } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';

const DashboardScreen = () => {
  const { metrics, goals, setDailyTaskTarget, settings, updateSettings, palette, t } = useSuccess();
  const [targetDraft, setTargetDraft] = useState(String(metrics.dailyTaskTarget));
  const guideSteps = [t('onboardingStep1'), t('onboardingStep2'), t('onboardingStep3')];
  const [guideIndex, setGuideIndex] = useState(0);
  useEffect(() => {
    setTargetDraft(String(metrics.dailyTaskTarget));
  }, [metrics.dailyTaskTarget]);
  const avgGoalCompletion = goals.length
    ? Math.round(
        goals.reduce((sum, g) => sum + Math.round((g.current / g.target) * 100), 0) / goals.length
      )
    : 0;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: palette.background }]}
      contentContainerStyle={[styles.container, settings.compactMode && styles.compactContainer]}
    >
      <Modal
        visible={settings.showGuide}
        transparent
        animationType="fade"
        onRequestClose={() => updateSettings({ showGuide: false })}
      >
        <View style={styles.guideOverlay}>
          <View style={[styles.guideCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Text style={[styles.guideTitle, { color: palette.text }]}>{t('onboardingTitle')}</Text>
            <Text style={[styles.guideText, { color: palette.subText }]}>{guideSteps[guideIndex]}</Text>
            <View style={styles.guideActions}>
              <Pressable
                style={[styles.guideBtn, { borderColor: palette.border }]}
                onPress={() => updateSettings({ showGuide: false })}
              >
                <Text style={[styles.guideBtnText, { color: palette.subText }]}>{t('close')}</Text>
              </Pressable>
              <Pressable
                style={[styles.guideBtnPrimary, { backgroundColor: palette.primary }]}
                onPress={() => {
                  if (guideIndex >= guideSteps.length - 1) {
                    updateSettings({ showGuide: false });
                    return;
                  }
                  setGuideIndex((prev) => prev + 1);
                }}
              >
                <Text style={styles.guideBtnPrimaryText}>
                  {guideIndex >= guideSteps.length - 1 ? t('close') : t('next')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={[styles.title, { color: palette.text }]}>{t('appName')}</Text>
      <Text style={[styles.subtitle, { color: palette.subText }]}>{t('appSubtitle')}</Text>

      <View style={styles.cardRow}>
        <StatCard title={t('streak')} value={`${metrics.streak}`} subtitle={t('days')} palette={palette} />
        <StatCard title={t('completedTasks')} value={`${metrics.completionRate}%`} subtitle={t('rate')} palette={palette} />
      </View>

      <View style={styles.cardRow}>
        <StatCard title={t('completedTasks')} value={`${metrics.completedTasks}`} subtitle={`${t('of')} ${metrics.totalTasks}`} palette={palette} />
        <StatCard title={t('completedGoals')} value={`${metrics.goalsCompleted}`} subtitle={`${t('of')} ${goals.length}`} palette={palette} />
      </View>

      <View style={styles.cardRow}>
        <StatCard title={t('productivity')} value={`${metrics.productivityScore}%`} subtitle="KPI" palette={palette} />
        <StatCard
          title={t('today')}
          value={`${metrics.todaysCompleted}/${metrics.dailyTaskTarget}`}
          subtitle={t('tasks')}
          palette={palette}
        />
      </View>

      <View style={[styles.panel, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.panelTitle, { color: palette.subText }]}>{t('goalsProgress')}</Text>
        <Text style={[styles.panelValue, { color: palette.text }]}>{avgGoalCompletion}%</Text>
        <ProgressBar value={avgGoalCompletion} max={100} color={palette.primary} trackColor={palette.border} />
      </View>

      <View style={[styles.panel, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.panelTitle, { color: palette.subText }]}>{t('dailyPlan')}</Text>
        <Text style={[styles.helperText, { color: palette.subText }]}>
          {metrics.dailyTaskTarget} / {metrics.todaysCompleted}
        </Text>
        <ProgressBar value={metrics.todayTargetPercent} max={100} color={palette.warning} trackColor={palette.border} />
        <View style={styles.targetRow}>
          <TextInput
            value={targetDraft}
            onChangeText={setTargetDraft}
            keyboardType="numeric"
            placeholder={t('dailyPlan')}
            placeholderTextColor={palette.subText}
            style={[
              styles.targetInput,
              { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }
            ]}
          />
          <Pressable
            style={[styles.applyBtn, { backgroundColor: palette.primary }]}
            onPress={() => {
              setDailyTaskTarget(targetDraft);
            }}
          >
            <Text style={styles.applyBtnText}>{t('save')}</Text>
          </Pressable>
        </View>
      </View>

      {settings.weeklyInsights ? (
        <View style={[styles.panel, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.panelTitle, { color: palette.subText }]}>{t('thisWeek')}</Text>
          <View style={styles.weekRow}>
            {metrics.last7days.map((item) => {
              const height = Math.max(6, Math.min(48, item.done * 12));
              return (
                <View key={String(item.date)} style={styles.dayCol}>
                  <View style={[styles.bar, { height, backgroundColor: palette.primary }]} />
                  <Text style={[styles.dayText, { color: palette.subText }]}>{item.date.getDate()}</Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
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
  guideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22
  },
  guideCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  guideText: {
    fontSize: 14,
    lineHeight: 20
  },
  guideActions: {
    flexDirection: 'row',
    gap: 8
  },
  guideBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10
  },
  guideBtnText: {
    fontWeight: '700'
  },
  guideBtnPrimary: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10
  },
  guideBtnPrimaryText: {
    color: '#fff',
    fontWeight: '800'
  },
  title: {
    fontWeight: '800',
    fontSize: 24
  },
  subtitle: {
    marginTop: -4,
    marginBottom: 6
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10
  },
  panel: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 10
  },
  panelTitle: {
    fontWeight: '700'
  },
  panelValue: {
    fontSize: 28,
    fontWeight: '800'
  },
  helperText: {
    fontSize: 13
  },
  targetRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8
  },
  targetInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  applyBtn: {
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
    backgroundColor: '#4F8CFF'
  },
  dayText: {
    fontSize: 12
  }
});

export default DashboardScreen;
