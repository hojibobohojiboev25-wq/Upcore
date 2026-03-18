import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  View,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useSuccess } from '../context/SuccessContext';

const WelcomeScreen = () => {
  const { setProfile, palette, t } = useSuccess();
  const { width } = useWindowDimensions();
  const [name, setName] = useState('');
  const [mission, setMission] = useState('');
  const titleSize = Math.min(40, Math.max(34, width * 0.095));

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topArea}>
          <Text style={[styles.title, { color: palette.text, fontSize: titleSize }]}>{t('appName')}</Text>
          <Text style={[styles.subtitle, { color: palette.subText }]}>{t('createProfile')}</Text>
          <Text style={[styles.hint, { color: palette.subText }]}>{t('welcomeHint')}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
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
            style={[styles.button, { backgroundColor: palette.primary }]}
            onPress={() => {
              if (!name.trim()) return;
              setProfile({ name: name.trim(), mission: mission.trim(), createdAt: new Date().toISOString() });
            }}
          >
            <Text style={styles.buttonText}>{t('continue')}</Text>
          </Pressable>
          <Text style={[styles.keyboardHint, { color: palette.subText }]}>{t('keyboardFixedHint')}</Text>
        </View>

        <View style={styles.bottomArea}>
          <Text style={[styles.from, { color: palette.subText }]}>{t('fromOrzu')}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  scrollContainer: {
    minHeight: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 30
  },
  topArea: {
    alignItems: 'center',
    gap: 10
  },
  title: {
    marginTop: 8,
    fontWeight: '900'
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  hint: {
    fontSize: 13
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 13
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800'
  },
  keyboardHint: {
    fontSize: 12
  },
  bottomArea: {
    alignItems: 'center'
  },
  from: {
    fontSize: 14,
    fontWeight: '700'
  }
});

export default WelcomeScreen;
