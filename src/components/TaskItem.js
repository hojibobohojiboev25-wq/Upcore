import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { formatDate } from '../utils/date';

const priorityMap = {
  low: { label: 'Низкий', color: '#2A9D8F' },
  medium: { label: 'Средний', color: '#FFB020' },
  high: { label: 'Высокий', color: '#FF5C5C' }
};

const TaskItem = ({ item, onToggle, onDelete }) => {
  const priority = priorityMap[item.priority] || priorityMap.medium;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable
          onPress={onToggle}
          style={[styles.checkbox, item.completed && styles.checkboxDone]}
        >
          <Text style={styles.checkboxText}>{item.completed ? '✓' : ''}</Text>
        </Pressable>

        <View style={styles.main}>
          <Text style={[styles.title, item.completed && styles.completed]}>{item.title}</Text>
          {!!item.note && <Text style={styles.note}>{item.note}</Text>}
          <View style={styles.metaRow}>
            <Text style={[styles.priority, { color: priority.color }]}>{priority.label}</Text>
            <Text style={styles.date}>Создано: {formatDate(item.createdAt)}</Text>
          </View>
        </View>

        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Удалить</Text>
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
    padding: 12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  checkboxDone: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success
  },
  checkboxText: {
    color: '#fff',
    fontWeight: '800'
  },
  main: {
    flex: 1,
    gap: 4
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  completed: {
    textDecorationLine: 'line-through',
    color: theme.colors.subText
  },
  note: {
    color: theme.colors.subText,
    fontSize: 13
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  priority: {
    fontSize: 12,
    fontWeight: '700'
  },
  date: {
    color: theme.colors.subText,
    fontSize: 12
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

export default TaskItem;
