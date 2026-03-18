import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSuccess } from '../context/SuccessContext';

const AiChatScreen = () => {
  const { subscribeAiMessages, sendAiMessage, palette, t } = useSuccess();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeAiMessages(setMessages);
    return unsubscribe;
  }, [subscribeAiMessages]);

  const onSend = async () => {
    const ok = await sendAiMessage(text);
    if (ok) setText('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const assistant = item.role === 'assistant';
          return (
            <View
              style={[
                styles.bubble,
                assistant ? styles.left : styles.right,
                {
                  backgroundColor: assistant ? palette.card : palette.primary,
                  borderColor: palette.border
                }
              ]}
            >
              <Text style={[styles.role, { color: assistant ? palette.subText : '#EAF0FF' }]}>
                {assistant ? t('aiCoach') : 'You'}
              </Text>
              <Text style={{ color: assistant ? palette.text : '#fff' }}>{item.text}</Text>
            </View>
          );
        }}
      />

      <View style={[styles.inputRow, { borderTopColor: palette.border, backgroundColor: palette.surface }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t('writeMessage')}
          placeholderTextColor={palette.subText}
          style={[styles.input, { color: palette.text }]}
        />
        <Pressable style={[styles.sendBtn, { backgroundColor: palette.primary }]} onPress={onSend}>
          <Text style={styles.sendText}>{t('send')}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 12, gap: 8, paddingBottom: 16 },
  bubble: {
    maxWidth: '84%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 4
  },
  left: { alignSelf: 'flex-start' },
  right: { alignSelf: 'flex-end' },
  role: { fontSize: 11, fontWeight: '700' },
  inputRow: {
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  input: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  sendBtn: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  sendText: {
    color: '#fff',
    fontWeight: '800'
  }
});

export default AiChatScreen;
