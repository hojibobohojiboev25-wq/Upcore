import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useSuccess } from '../context/SuccessContext';
import StatCard from '../components/StatCard';

const ProfileScreen = () => {
  const { profile, metrics, updateSettings, settings, setProfile, palette, t } = useSuccess();
  const [name, setName] = useState(profile.name || '');
  const [mission, setMission] = useState(profile.mission || '');

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.background }]} contentContainerStyle={styles.container}>
      <View style={[styles.profileCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.name, { color: palette.text }]}>{profile.name || 'User'}</Text>
        <Text style={[styles.mission, { color: palette.subText }]}>
          {profile.mission || t('profileGreeting')}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <StatCard title={t('completedTasks')} value={`${metrics.completedTasks}`} subtitle="" palette={palette} />
        <StatCard title={t('streak')} value={`${metrics.streak}`} subtitle="" palette={palette} />
      </View>

      <View style={[styles.form, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('updateProfile')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('yourName')}
          placeholderTextColor={palette.subText}
          style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
        />
        <TextInput
          value={mission}
          onChangeText={setMission}
          placeholder={t('yourGoal')}
          placeholderTextColor={palette.subText}
          style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
        />
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: palette.primary }]}
          onPress={() => setProfile({ name: name.trim() || profile.name, mission: mission.trim() })}
        >
          <Text style={styles.primaryBtnText}>{t('save')}</Text>
        </Pressable>
      </View>

      <View style={[styles.form, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('moreOptions')}</Text>
        <Pressable
          style={[styles.switchRow, { borderColor: palette.border }]}
          onPress={() => updateSettings({ compactMode: !settings.compactMode })}
        >
          <Text style={[styles.switchLabel, { color: palette.text }]}>{t('compactMode')}</Text>
          <Text style={[styles.switchValue, { color: palette.primary }]}>
            {settings.compactMode ? t('on') : t('off')}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 16, gap: 14, paddingBottom: 40 },
  profileCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8
  },
  name: { fontSize: 26, fontWeight: '800' },
  mission: { fontSize: 14 },
  cardRow: { flexDirection: 'row', gap: 10 },
  form: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10
  },
  title: { fontSize: 18, fontWeight: '800' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  primaryBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  switchRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switchLabel: { fontWeight: '700' },
  switchValue: { fontWeight: '800' }
});

export default ProfileScreen;
