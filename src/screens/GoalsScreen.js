import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { theme } from '../constants/theme';
import { useSuccess } from '../context/SuccessContext';
import GoalItem from '../components/GoalItem';

const GoalsScreen = () => {
  const { goals, addGoal, updateGoal, removeGoal } = useSuccess();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('10');

  const onAdd = () => {
    if (!title.trim()) return;
    addGoal({ title: title.trim(), target: Number(target) || 1 });
    setTitle('');
    setTarget('10');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Новая цель</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Например: 30 тренировок за месяц"
          placeholderTextColor={theme.colors.subText}
          style={styles.input}
        />
        <TextInput
          value={target}
          onChangeText={setTarget}
          keyboardType="numeric"
          placeholder="Целевое число"
          placeholderTextColor={theme.colors.subText}
          style={styles.input}
        />
        <Pressable onPress={onAdd} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Создать цель</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {goals.length === 0 ? (
          <Text style={styles.empty}>Добавь первую цель, чтобы отслеживать рост.</Text>
        ) : (
          goals.map((goal) => (
            <GoalItem
              key={goal.id}
              item={goal}
              onMinus={() => updateGoal(goal.id, -1)}
              onPlus={() => updateGoal(goal.id, 1)}
              onDelete={() => removeGoal(goal.id)}
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
  list: {
    gap: 10
  },
  empty: {
    color: theme.colors.subText,
    textAlign: 'center',
    marginTop: 16
  }
});

export default GoalsScreen;
