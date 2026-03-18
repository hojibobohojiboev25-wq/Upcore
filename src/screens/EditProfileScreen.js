import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSuccess } from '../context/SuccessContext';

const EditProfileScreen = ({ navigation }) => {
  const { profile, setProfile, uploadProfileAvatar, palette, t } = useSuccess();
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
          <View style={styles.avatarWrap}>
            {profile.photoURL ? (
              <Image source={{ uri: profile.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <Text style={{ color: palette.subText, fontWeight: '800' }}>
                  {(profile.name || 'U').slice(0, 1).toUpperCase()}
                </Text>
              </View>
            )}
            <Pressable
              style={[styles.photoBtn, { borderColor: palette.border }]}
              onPress={async () => {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) return;
                const picked = await ImagePicker.launchImageLibraryAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.7
                });
                if (picked.canceled) return;
                const uri = picked.assets?.[0]?.uri;
                if (!uri) return;
                await uploadProfileAvatar(uri);
              }}
            >
              <Text style={{ color: palette.primary, fontWeight: '700' }}>{t('uploadPhoto')}</Text>
            </Pressable>
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
  avatarWrap: {
    alignItems: 'center',
    gap: 8
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
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
