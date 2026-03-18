import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  useWindowDimensions
} from 'react-native';
import { useSuccess } from '../context/SuccessContext';

const WelcomeScreen = () => {
  const { setProfile, palette, t } = useSuccess();
  const { width } = useWindowDimensions();
  const [name, setName] = useState('');
  const [mission, setMission] = useState('');
  const iconSize = Math.min(120, Math.max(84, width * 0.22));

  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <View style={styles.topArea}>
        <Image source={require('../../assets/upcore-icon.png')} style={{ width: iconSize, height: iconSize, borderRadius: 24 }} />
        <Text style={[styles.title, { color: palette.text }]}>{t('appName')}</Text>
        <Text style={[styles.subtitle, { color: palette.subText }]}>{t('createProfile')}</Text>
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
      </View>

      <View style={styles.bottomArea}>
        <Text style={[styles.from, { color: palette.subText }]}>{t('fromOrzu')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 30
  },
  topArea: {
    alignItems: 'center',
    gap: 12
  },
  title: {
    fontSize: 36,
    fontWeight: '900'
  },
  subtitle: {
    fontSize: 16
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
  bottomArea: {
    alignItems: 'center'
  },
  from: {
    fontSize: 14,
    fontWeight: '700'
  }
});

export default WelcomeScreen;
