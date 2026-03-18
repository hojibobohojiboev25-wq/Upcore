import React, { useState } from 'react';
import {
  ActivityIndicator,
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

const AuthScreen = () => {
  const { signInWithEmail, signUpWithEmail, sendPasswordReset, sendMagicLink, palette, t } = useSuccess();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email.trim() || !password.trim()) return;
    setError('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail({ email, password });
      } else {
        await signUpWithEmail({ email, password, name });
      }
    } catch (authError) {
      setError(authError?.message || 'Auth error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.title, { color: palette.text }]}>{t('appName')}</Text>
          <Text style={[styles.subtitle, { color: palette.subText }]}>{t('authWelcome')}</Text>

          <View style={styles.modeRow}>
            <Pressable
              style={[
                styles.modeBtn,
                { borderColor: palette.border, backgroundColor: palette.surface },
                mode === 'signin' && { borderColor: palette.primary }
              ]}
              onPress={() => setMode('signin')}
            >
              <Text style={{ color: mode === 'signin' ? palette.primary : palette.subText, fontWeight: '700' }}>
                {t('signIn')}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.modeBtn,
                { borderColor: palette.border, backgroundColor: palette.surface },
                mode === 'signup' && { borderColor: palette.primary }
              ]}
              onPress={() => setMode('signup')}
            >
              <Text style={{ color: mode === 'signup' ? palette.primary : palette.subText, fontWeight: '700' }}>
                {t('signUp')}
              </Text>
            </Pressable>
          </View>

          {mode === 'signup' ? (
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('yourName')}
              placeholderTextColor={palette.subText}
              style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
            />
          ) : null}

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={palette.subText}
            style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t('password')}
            secureTextEntry
            placeholderTextColor={palette.subText}
            style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
          />

          {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}

          <Pressable style={[styles.primaryBtn, { backgroundColor: palette.primary }]} onPress={submit}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {mode === 'signin' ? t('signIn') : t('createAccount')}
              </Text>
            )}
          </Pressable>

          <View style={styles.linksRow}>
            <Pressable
              onPress={async () => {
                try {
                  await sendPasswordReset(email);
                  setError('Reset link sent to your email.');
                } catch (authError) {
                  setError(authError?.message || 'Reset error');
                }
              }}
            >
              <Text style={[styles.linkText, { color: palette.primary }]}>{t('forgotPassword') || 'Forgot password?'}</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                try {
                  await sendMagicLink(email);
                  setError('Magic link sent to your email.');
                } catch (authError) {
                  setError(authError?.message || 'Magic link error');
                }
              }}
            >
              <Text style={[styles.linkText, { color: palette.primary }]}>{t('magicLink') || 'Login link'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    minHeight: '100%',
    justifyContent: 'center',
    padding: 16
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10
  },
  title: {
    fontSize: 28,
    fontWeight: '900'
  },
  subtitle: {
    marginTop: -2,
    marginBottom: 4
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8
  },
  modeBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  error: {
    fontSize: 12
  },
  primaryBtn: {
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800'
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700'
  }
});

export default AuthScreen;
