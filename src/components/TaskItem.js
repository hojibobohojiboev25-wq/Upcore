import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { formatDate, formatTime } from '../utils/date';

const priorityMap = {
  low: { key: 'low', color: '#2A9D8F' },
  medium: { key: 'medium', color: '#FFB020' },
  high: { key: 'high', color: '#FF5C5C' }
};

const TaskItem = ({ item, onToggle, onDelete, palette, t, use24Hour = true }) => {
  const priority = priorityMap[item.priority] || priorityMap.medium;
  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <View style={styles.row}>
        <Pressable
          onPress={onToggle}
          style={[
            styles.checkbox,
            { borderColor: palette.border },
            item.completed && [styles.checkboxDone, { backgroundColor: palette.success, borderColor: palette.success }]
          ]}
        >
          <Text style={styles.checkboxText}>{item.completed ? '✓' : ''}</Text>
        </Pressable>

        <View style={styles.main}>
          <Text style={[styles.title, { color: palette.text }, item.completed && [styles.completed, { color: palette.subText }]]}>
            {item.title}
          </Text>
          {!!item.note && <Text style={[styles.note, { color: palette.subText }]}>{item.note}</Text>}
          {!!item.dueAt && (
            <Text style={[styles.note, { color: palette.warning }]}>
              {t('dueDate')}: {formatDate(item.dueAt)} {formatTime(item.dueAt, use24Hour)}
            </Text>
          )}
          <View style={styles.metaRow}>
            <Text style={[styles.priority, { color: priority.color }]}>{t(priority.key)}</Text>
            <Text style={[styles.date, { color: palette.subText }]}>
              {t('createdAt')}: {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>

        <Pressable onPress={onDelete} style={[styles.deleteButton, { backgroundColor: 'rgba(255, 92, 92, 0.15)' }]}>
          <Text style={[styles.deleteText, { color: palette.danger }]}>{t('delete')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
    borderColor: '#253453',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  checkboxDone: {
    backgroundColor: '#23C16B',
    borderColor: '#23C16B'
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
    fontSize: 16,
    fontWeight: '700'
  },
  completed: {
    textDecorationLine: 'line-through'
  },
  note: {
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
    fontSize: 12
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

export default TaskItem;
