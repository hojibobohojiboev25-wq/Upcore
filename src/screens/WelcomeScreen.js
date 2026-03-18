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
  const { setProfile, updateSettings, settings, palette, t } = useSuccess();
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
          <Text style={[styles.langTitle, { color: palette.text }]}>{t('language')}</Text>
          <View style={styles.langRow}>
            {[
              { code: 'en', label: 'EN' },
              { code: 'ru', label: 'RU' },
              { code: 'de', label: 'DE' }
            ].map((item) => (
              <Pressable
                key={item.code}
                onPress={() => updateSettings({ language: item.code })}
                style={[
                  styles.langChip,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                  settings.language === item.code && { borderColor: palette.primary }
                ]}
              >
                <Text
                  style={[
                    styles.langChipText,
                    { color: settings.language === item.code ? palette.primary : palette.subText }
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
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
  langTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  langRow: {
    flexDirection: 'row',
    gap: 8
  },
  langChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10
  },
  langChipText: {
    fontWeight: '700'
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
