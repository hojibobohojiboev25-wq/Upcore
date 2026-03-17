import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import ProgressBar from './ProgressBar';

const GoalItem = ({ item, onMinus, onPlus, onDelete }) => {
  const percent = Math.round((item.current / item.target) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Удалить</Text>
        </Pressable>
      </View>

      <Text style={styles.progress}>
        Прогресс: {item.current}/{item.target} ({percent}%)
      </Text>
      <ProgressBar value={item.current} max={item.target} color={theme.colors.success} />

      <View style={styles.controls}>
        <Pressable onPress={onMinus} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>-1</Text>
        </Pressable>
        <Pressable onPress={onPlus} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>+1</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 16
  },
  progress: {
    color: theme.colors.subText
  },
  controls: {
    flexDirection: 'row',
    gap: 10
  },
  primaryBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
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
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderColor: theme.colors.border,
    borderWidth: 1
  },
  secondaryText: {
    color: theme.colors.text,
    fontWeight: '800'
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 92, 92, 0.15)',
    borderRadius: 8
  },
  deleteText: {
    color: theme.colors.danger,
    fontWeight: '700',
    fontSize: 12
  }
});

export default GoalItem;
