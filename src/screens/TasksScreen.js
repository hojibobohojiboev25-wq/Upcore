import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import TaskItem from '../components/TaskItem';
import { formatDate, formatTime } from '../utils/date';

const TasksScreen = () => {
  const { tasks, addTask, toggleTask, removeTask, settings, palette, t } = useSuccess();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [priority, setPriority] = useState(settings.defaultPriority || 'medium');
  const [taskBucket, setTaskBucket] = useState('anytime');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [pickerMode, setPickerMode] = useState(null);

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

  const buildDueAt = () => {
    if (!selectedDate || !selectedTime) return null;
    const dueDate = new Date(selectedDate);
    dueDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
    return dueDate.toISOString();
  };

  const onAdd = async () => {
    if (!title.trim()) return;
    let dueAt = buildDueAt();
    if (!dueAt && taskBucket !== 'anytime') {
      const now = new Date();
      if (taskBucket === 'today') {
        now.setHours(20, 0, 0, 0);
      } else if (taskBucket === 'tomorrow') {
        now.setDate(now.getDate() + 1);
        now.setHours(20, 0, 0, 0);
      } else if (taskBucket === 'week') {
        now.setDate(now.getDate() + 7);
        now.setHours(20, 0, 0, 0);
      }
      dueAt = now.toISOString();
    }
    await addTask({ title: title.trim(), note: note.trim(), priority, dueAt });
    setTitle('');
    setNote('');
    setSelectedDate(null);
    setSelectedTime(null);
    setPriority(settings.defaultPriority || 'medium');
    setTaskBucket('anytime');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.screen, { backgroundColor: palette.background }]}
        contentContainerStyle={[styles.container, settings.compactMode && styles.compactContainer]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.form, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('newTask')}</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={t('taskTitlePlaceholder')}
            placeholderTextColor={palette.subText}
            style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t('taskNotePlaceholder')}
            placeholderTextColor={palette.subText}
            style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
          />
          <View style={styles.row}>
            <Pressable
              onPress={() => setPickerMode('date')}
              style={[styles.input, styles.halfInput, styles.pickerButton, { backgroundColor: palette.surface, borderColor: palette.border }]}
            >
              <Text style={{ color: selectedDate ? palette.text : palette.subText }}>
                {selectedDate ? formatDate(selectedDate) : t('taskDatePlaceholder')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPickerMode('time')}
              style={[styles.input, styles.halfInput, styles.pickerButton, { backgroundColor: palette.surface, borderColor: palette.border }]}
            >
              <Text style={{ color: selectedTime ? palette.text : palette.subText }}>
                {selectedTime ? formatTime(selectedTime, settings.twentyFourHour) : t('taskTimePlaceholder')}
              </Text>
            </Pressable>
          </View>
          <Text style={[styles.helper, { color: palette.subText }]}>
            {selectedDate && selectedTime
              ? `${t('dueDate')}: ${formatDate(buildDueAt())} ${formatTime(buildDueAt(), settings.twentyFourHour)}`
              : t('noDueDate')}
          </Text>

          <Text style={[styles.helperTitle, { color: palette.text }]}>{t('taskBucket')}</Text>
          <View style={styles.row}>
            {[
              { key: 'today', label: t('todayTasks') },
              { key: 'tomorrow', label: t('tomorrowTasks') },
              { key: 'week', label: t('weekTasks') },
              { key: 'anytime', label: t('anytime') }
            ].map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setTaskBucket(item.key)}
                style={[
                  styles.bucketChip,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                  taskBucket === item.key && { borderColor: palette.primary }
                ]}
              >
                <Text
                  style={[
                    styles.bucketChipText,
                    { color: taskBucket === item.key ? palette.primary : palette.subText }
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            {['low', 'medium', 'high'].map((item) => (
              <Pressable
                key={item}
                onPress={() => setPriority(item)}
                style={[
                  styles.chip,
                  { borderColor: palette.border, backgroundColor: palette.surface },
                  priority === item && [styles.chipActive, { borderColor: palette.primary }]
                ]}
              >
                <Text style={[styles.chipText, { color: palette.subText }, priority === item && [styles.chipTextActive, { color: palette.primary }]]}>
                  {item === 'low' ? t('low') : item === 'medium' ? t('medium') : t('high')}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={onAdd} style={[styles.primaryButton, { backgroundColor: palette.primary }]}>
            <Text style={styles.primaryButtonText}>{t('addTask')}</Text>
          </Pressable>
        </View>

        <View style={styles.filters}>
          {[
            { key: 'all', label: t('all') },
            { key: 'active', label: t('active') },
            { key: 'done', label: t('done') }
          ].map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[
                styles.filterBtn,
                { borderColor: palette.border, backgroundColor: palette.surface },
                filter === item.key && [styles.filterBtnActive, { borderColor: palette.primary }]
              ]}
            >
              <Text style={[styles.filterText, { color: palette.subText }, filter === item.key && [styles.filterTextActive, { color: palette.primary }]]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.form, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('searchSort')}</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('searchTask')}
            placeholderTextColor={palette.subText}
            style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
          />
          <View style={styles.row}>
            {[
              { key: 'newest', label: t('newest') },
              { key: 'priority', label: t('priority') },
              { key: 'status', label: t('status') }
            ].map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setSortBy(item.key)}
                style={[
                  styles.chip,
                  { borderColor: palette.border, backgroundColor: palette.surface },
                  sortBy === item.key && [styles.chipActive, { borderColor: palette.primary }]
                ]}
              >
                <Text style={[styles.chipText, { color: palette.subText }, sortBy === item.key && [styles.chipTextActive, { color: palette.primary }]]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.list}>
          {filteredTasks.length === 0 ? (
            <Text style={[styles.empty, { color: palette.subText }]}>{t('emptyTasks')}</Text>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                item={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => removeTask(task.id)}
                palette={palette}
                t={t}
                use24Hour={settings.twentyFourHour}
              />
            ))
          )}
        </View>
      </ScrollView>
      {pickerMode && (
        <DateTimePicker
          value={pickerMode === 'date' ? selectedDate || new Date() : selectedTime || new Date()}
          mode={pickerMode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={settings.twentyFourHour}
          onChange={(event, pickedValue) => {
            if (Platform.OS === 'android') setPickerMode(null);
            if (event.type !== 'set' || !pickedValue) return;
            if (pickerMode === 'date') setSelectedDate(pickedValue);
            if (pickerMode === 'time') setSelectedTime(pickedValue);
          }}
        />
      )}
    </KeyboardAvoidingView>
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
  sectionTitle: {
    fontWeight: '800',
    fontSize: 18
  },
  form: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  halfInput: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    gap: 8
  },
  pickerButton: {
    justifyContent: 'center'
  },
  helper: {
    fontSize: 12
  },
  helperTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  bucketChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  bucketChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#111A2E'
  },
  chipActive: {
    backgroundColor: 'rgba(79, 140, 255, 0.15)'
  },
  chipText: {
    fontWeight: '700'
  },
  chipTextActive: {
    color: '#4F8CFF'
  },
  primaryButton: {
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
    borderWidth: 1,
    backgroundColor: '#111A2E',
    paddingVertical: 9
  },
  filterBtnActive: {
    backgroundColor: 'rgba(79, 140, 255, 0.15)'
  },
  filterText: {
    fontWeight: '700'
  },
  filterTextActive: {
    color: '#4F8CFF'
  },
  list: {
    gap: 10
  },
  empty: {
    textAlign: 'center',
    marginTop: 16
  }
});

export default TasksScreen;
