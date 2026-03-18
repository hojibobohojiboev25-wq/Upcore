import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSuccess } from '../context/SuccessContext';

const EditProfileScreen = ({ navigation }) => {
  const { profile, setProfile, palette, t } = useSuccess();
  const [name, setName] = useState(profile.name || '');
  const [mission, setMission] = useState(profile.mission || '');
  const [age, setAge] = useState(profile.age || '');
  const [city, setCity] = useState(profile.city || '');
  const [profession, setProfession] = useState(profile.profession || '');

  const onSave = () => {
    if (!name.trim()) return;
    setProfile({
      name: name.trim(),
      mission: mission.trim(),
      age: age.trim(),
      city: city.trim(),
      profession: profession.trim()
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.title, { color: palette.text }]}>{t('profileInfo')}</Text>
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
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder={t('age')}
            keyboardType="numeric"
            placeholderTextColor={palette.subText}
            style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
          />
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder={t('city')}
            placeholderTextColor={palette.subText}
            style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
          />
          <TextInput
            value={profession}
            onChangeText={setProfession}
            placeholder={t('profession')}
            placeholderTextColor={palette.subText}
            style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
          />
          <Pressable style={[styles.button, { backgroundColor: palette.primary }]} onPress={onSave}>
            <Text style={styles.buttonText}>{t('saveChanges')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 16, paddingBottom: 40 },
  card: {
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
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800'
  }
});

export default EditProfileScreen;
