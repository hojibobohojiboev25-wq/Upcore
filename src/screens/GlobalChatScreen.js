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

const GlobalChatScreen = () => {
  const { authUser, sendGlobalMessage, subscribeGlobalMessages, palette, t } = useSuccess();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeGlobalMessages(setMessages);
    return unsubscribe;
  }, [subscribeGlobalMessages]);

  const onSend = async () => {
    const ok = await sendGlobalMessage(text);
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
        renderItem={({ item }) => {
          const mine = item.userId === authUser?.uid;
          return (
            <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubblePeer, { backgroundColor: mine ? palette.primary : palette.card, borderColor: palette.border }]}>
              <Text style={[styles.author, { color: mine ? '#EAF0FF' : palette.subText }]}>
                {item.userName || 'User'}
              </Text>
              <Text style={{ color: mine ? '#fff' : palette.text }}>{item.text}</Text>
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
          <Text style={styles.sendText}>{t('send') || 'Send'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 12, gap: 8, paddingBottom: 18 },
  bubble: {
    maxWidth: '82%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 4
  },
  bubbleMine: {
    alignSelf: 'flex-end'
  },
  bubblePeer: {
    alignSelf: 'flex-start'
  },
  author: {
    fontSize: 11,
    fontWeight: '700'
  },
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

export default GlobalChatScreen;
