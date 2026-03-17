import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable
} from 'react-native';
import { theme } from '../constants/theme';
import { useSuccess } from '../context/SuccessContext';
import TaskItem from '../components/TaskItem';

const TasksScreen = () => {
  const { tasks, addTask, toggleTask, removeTask } = useSuccess();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filter === 'done') result = result.filter((task) => task.completed);
    if (filter === 'active') result = result.filter((task) => !task.completed);

    if (search.trim()) {
      const normalized = search.trim().toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(normalized) ||
          (task.note || '').toLowerCase().includes(normalized)
      );
    }

    const priorityWeight = { high: 3, medium: 2, low: 1 };
    result = [...result].sort((a, b) => {
      if (sortBy === 'priority') return priorityWeight[b.priority] - priorityWeight[a.priority];
      if (sortBy === 'status') return Number(a.completed) - Number(b.completed);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [tasks, filter, search, sortBy]);

  const onAdd = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), note: note.trim(), priority });
    setTitle('');
    setNote('');
    setPriority('medium');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Новая задача</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Например: Прочитать 20 страниц книги"
          placeholderTextColor={theme.colors.subText}
          style={styles.input}
        />
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Доп. заметка (опционально)"
          placeholderTextColor={theme.colors.subText}
          style={styles.input}
        />

        <View style={styles.row}>
          {['low', 'medium', 'high'].map((item) => (
            <Pressable
              key={item}
              onPress={() => setPriority(item)}
              style={[styles.chip, priority === item && styles.chipActive]}
            >
              <Text style={[styles.chipText, priority === item && styles.chipTextActive]}>
                {item === 'low' ? 'Низкий' : item === 'medium' ? 'Средний' : 'Высокий'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={onAdd} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Добавить задачу</Text>
        </Pressable>
      </View>

      <View style={styles.filters}>
        {[
          { key: 'all', label: 'Все' },
          { key: 'active', label: 'Активные' },
          { key: 'done', label: 'Готово' }
        ].map((item) => (
          <Pressable
            key={item.key}
            onPress={() => setFilter(item.key)}
            style={[styles.filterBtn, filter === item.key && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Поиск и сортировка</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Найти задачу..."
          placeholderTextColor={theme.colors.subText}
          style={styles.input}
        />
        <View style={styles.row}>
          {[
            { key: 'newest', label: 'Новые' },
            { key: 'priority', label: 'Приоритет' },
            { key: 'status', label: 'Статус' }
          ].map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setSortBy(item.key)}
              style={[styles.chip, sortBy === item.key && styles.chipActive]}
            >
              <Text style={[styles.chipText, sortBy === item.key && styles.chipTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.list}>
        {filteredTasks.length === 0 ? (
          <Text style={styles.empty}>Пока нет задач в этой категории.</Text>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              item={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => removeTask(task.id)}
            />
          ))
        )}
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
  sectionTitle: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 18
  },
  form: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    color: theme.colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  row: {
    flexDirection: 'row',
    gap: 8
  },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: theme.colors.surface
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(79, 140, 255, 0.15)'
  },
  chipText: {
    color: theme.colors.subText,
    fontWeight: '700'
  },
  chipTextActive: {
    color: theme.colors.primary
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800'
  },
  filters: {
    flexDirection: 'row',
    gap: 8
  },
  filterBtn: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: theme.colors.border,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: 9
  },
  filterBtnActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(79, 140, 255, 0.15)'
  },
  filterText: {
    color: theme.colors.subText,
    fontWeight: '700'
  },
  filterTextActive: {
    color: theme.colors.primary
  },
  list: {
    gap: 10
  },
  empty: {
    color: theme.colors.subText,
    textAlign: 'center',
    marginTop: 16
  }
});

export default TasksScreen;
