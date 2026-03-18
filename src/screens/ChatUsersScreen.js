import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSuccess } from '../context/SuccessContext';

const ChatUsersScreen = ({ navigation }) => {
  const { subscribeUsers, palette, t } = useSuccess();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeUsers(setUsers);
    return unsubscribe;
  }, [subscribeUsers]);

  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid || item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={[styles.empty, { color: palette.subText }]}>{t('noUsersYet')}</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.userCard, { backgroundColor: palette.card, borderColor: palette.border }]}
            onPress={() => navigation.navigate('DirectChat', { peerId: item.uid, peerName: item.displayName || item.email || 'User' })}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: palette.text }]}>{item.displayName || 'User'}</Text>
              <Text style={[styles.email, { color: palette.subText }]}>{item.email || '-'}</Text>
            </View>
            <Text style={[styles.open, { color: palette.primary }]}>{t('openChat')}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 12, gap: 8, paddingBottom: 20 },
  userCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  name: { fontSize: 15, fontWeight: '800' },
  email: { fontSize: 12 },
  open: { fontSize: 12, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 18 }
});

export default ChatUsersScreen;
