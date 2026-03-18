import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSuccess } from '../context/SuccessContext';
import StatCard from '../components/StatCard';

const ProfileScreen = ({ navigation }) => {
  const { profile, metrics, updateSettings, settings, palette, t } = useSuccess();

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
      <View style={[styles.profileCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <View style={styles.profileHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: palette.text }]}>{profile.name || t('profile')}</Text>
            <Text style={[styles.mission, { color: palette.subText }]}>
              {profile.mission || t('profileGreeting')}
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('EditProfile')}
            style={[styles.editIconBtn, { borderColor: palette.border, backgroundColor: palette.surface }]}
          >
            <Ionicons name="create-outline" size={18} color={palette.primary} />
          </Pressable>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { color: palette.subText }]}>
            {t('age')}: {profile.age || '-'}
          </Text>
          <Text style={[styles.infoText, { color: palette.subText }]}>
            {t('city')}: {profile.city || '-'}
          </Text>
        </View>
        <Text style={[styles.infoText, { color: palette.subText }]}>
          {t('profession')}: {profile.profession || '-'}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <StatCard title={t('completedTasks')} value={`${metrics.completedTasks}`} subtitle="" palette={palette} />
        <StatCard title={t('streak')} value={`${metrics.streak}`} subtitle="" palette={palette} />
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 16, gap: 14, paddingBottom: 40 },
  compactContainer: { padding: 12, gap: 10 },
  profileCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8
  },
  name: { fontSize: 26, fontWeight: '800' },
  mission: { fontSize: 14 },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  editIconBtn: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12
  },
  infoText: {
    fontSize: 13
  },
  cardRow: { flexDirection: 'row', gap: 10 },
  form: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10
  },
  title: { fontSize: 18, fontWeight: '800' },
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
