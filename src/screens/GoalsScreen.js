import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import GoalItem from '../components/GoalItem';

const GoalsScreen = () => {
  const { goals, addGoal, updateGoal, removeGoal, settings, palette, t } = useSuccess();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('10');

  const onAdd = () => {
    if (!title.trim()) return;
    addGoal({ title: title.trim(), target: Number(target) || 1 });
    setTitle('');
    setTarget('10');
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
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('newGoal')}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t('goalTitlePlaceholder')}
          placeholderTextColor={palette.subText}
          style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
        />
        <TextInput
          value={target}
          onChangeText={setTarget}
          keyboardType="numeric"
          placeholder={t('goalTargetPlaceholder')}
          placeholderTextColor={palette.subText}
          style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
        />
        <Pressable onPress={onAdd} style={[styles.primaryButton, { backgroundColor: palette.primary }]}>
          <Text style={styles.primaryButtonText}>{t('createGoal')}</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {goals.length === 0 ? (
          <Text style={[styles.empty, { color: palette.subText }]}>{t('noGoals')}</Text>
        ) : (
          goals.map((goal) => (
            <GoalItem
              key={goal.id}
              item={goal}
              onMinus={() => updateGoal(goal.id, -1)}
              onPlus={() => updateGoal(goal.id, 1)}
              onDelete={() => removeGoal(goal.id)}
              palette={palette}
              t={t}
            />
          ))
        )}
      </View>
      </ScrollView>
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
  primaryButton: {
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
    textAlign: 'center',
    marginTop: 16
  }
});

export default GoalsScreen;
