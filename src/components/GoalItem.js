import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';

const GoalItem = ({ item, onMinus, onPlus, onDelete, palette, t }) => {
  const percent = Math.round((item.current / item.target) * 100);

  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>{item.title}</Text>
        <Pressable onPress={onDelete} style={[styles.deleteButton, { backgroundColor: 'rgba(255, 92, 92, 0.15)' }]}>
          <Text style={[styles.deleteText, { color: palette.danger }]}>{t('delete')}</Text>
        </Pressable>
      </View>

      <Text style={[styles.progress, { color: palette.subText }]}>
        {item.current}/{item.target} ({percent}%)
      </Text>
      <Text style={[styles.progress, { color: palette.subText }]}>
        {t('goalPeriod')}: {t(item.period || 'monthly')}
      </Text>
      <ProgressBar
        value={item.current}
        max={item.target}
        color={palette.success}
        trackColor={palette.border}
      />

      <View style={styles.controls}>
        <Pressable
          onPress={onMinus}
          style={[
            styles.secondaryBtn,
            { backgroundColor: palette.surface, borderColor: palette.border }
          ]}
        >
          <Text style={[styles.secondaryText, { color: palette.text }]}>-1</Text>
        </Pressable>
        <Pressable onPress={onPlus} style={[styles.primaryBtn, { backgroundColor: palette.primary }]}>
          <Text style={styles.primaryText}>+1</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  title: {
    flex: 1,
    fontWeight: '700',
    fontSize: 16
  },
  progress: {},
  controls: {
    flexDirection: 'row',
    gap: 10
  },
  primaryBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10
  },
  primaryText: {
    color: '#fff',
    fontWeight: '800'
  },
  secondaryBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1
  },
  secondaryText: {
    fontWeight: '800'
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  deleteText: {
    fontWeight: '700',
    fontSize: 12
  }
});

export default GoalItem;
