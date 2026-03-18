import React, { useEffect, useLayoutEffect, useState } from 'react';
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

const DirectChatScreen = ({ route, navigation }) => {
  const { peerId, peerName } = route.params || {};
  const { authUser, subscribeDirectMessages, sendDirectMessage, palette, t } = useSuccess();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: peerName || t('chat') });
  }, [navigation, peerName, t]);

  useEffect(() => {
    const unsubscribe = subscribeDirectMessages(peerId, setMessages);
    return unsubscribe;
  }, [peerId, subscribeDirectMessages]);

  const onSend = async () => {
    const ok = await sendDirectMessage({ peerId, text, replyTo });
    if (ok) {
      setText('');
      setReplyTo(null);
    }
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
          const mine = item.userId === authUser?.uid;
          return (
            <Pressable
              onLongPress={() => setReplyTo(item)}
              style={[styles.bubble, mine ? styles.bubbleMine : styles.bubblePeer, { backgroundColor: mine ? palette.primary : palette.card, borderColor: palette.border }]}
            >
              <Text style={[styles.author, { color: mine ? '#EAF0FF' : palette.subText }]}>
                {item.userName || 'User'}
              </Text>
              {item.replyTo?.text ? (
                <View style={[styles.replyPreview, { borderColor: mine ? 'rgba(255,255,255,0.3)' : palette.border }]}>
                  <Text style={[styles.replyMeta, { color: mine ? '#EAF0FF' : palette.subText }]}>
                    {item.replyTo.userName}
                  </Text>
                  <Text style={{ color: mine ? '#EAF0FF' : palette.subText }} numberOfLines={1}>
                    {item.replyTo.text}
                  </Text>
                </View>
              ) : null}
              <Text style={{ color: mine ? '#fff' : palette.text }}>{item.text}</Text>
            </Pressable>
          );
        }}
      />
      {replyTo ? (
        <View style={[styles.replyBanner, { borderTopColor: palette.border, backgroundColor: palette.card }]}>
          <Text style={[styles.replyMeta, { color: palette.subText }]} numberOfLines={1}>
            Reply to {replyTo.userName}: {replyTo.text}
          </Text>
          <Pressable onPress={() => setReplyTo(null)}>
            <Text style={{ color: palette.danger, fontWeight: '700' }}>X</Text>
          </Pressable>
        </View>
      ) : null}
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
  replyPreview: {
    borderLeftWidth: 2,
    paddingLeft: 6,
    marginBottom: 2
  },
  replyMeta: {
    fontSize: 11,
    fontWeight: '700'
  },
  replyBanner: {
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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

export default DirectChatScreen;
