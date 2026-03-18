import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSuccess } from '../context/SuccessContext';

const CommunityScreen = ({ navigation }) => {
  const { authUser, subscribePublicUsers, followUser, unfollowUser, palette, t } = useSuccess();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribePublicUsers((items) => {
      const list = items.filter((item) => item.uid && item.uid !== authUser?.uid);
      setUsers(list);
    });
    return unsubscribe;
  }, [authUser?.uid, subscribePublicUsers]);

  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid || item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isFollowing = Array.isArray(item.followers) && authUser?.uid
            ? item.followers.includes(authUser.uid)
            : false;
          return (
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: palette.text }]}>{item.displayName || 'User'}</Text>
                <Text style={[styles.meta, { color: palette.subText }]}>
                  {t('followers')}: {Array.isArray(item.followers) ? item.followers.length : 0} | {t('following')}:{' '}
                  {Array.isArray(item.following) ? item.following.length : 0}
                </Text>
              </View>
              <Pressable
                style={[styles.followBtn, { borderColor: palette.border }]}
                onPress={() => (isFollowing ? unfollowUser(item.uid) : followUser(item.uid))}
              >
                <Text style={{ color: palette.primary, fontWeight: '700' }}>
                  {isFollowing ? t('unfollow') : t('follow')}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.followBtn, { borderColor: palette.border }]}
                onPress={() => navigation.navigate('UserProfile', { uid: item.uid })}
              >
                <Text style={{ color: palette.text, fontWeight: '700' }}>{t('viewProfile')}</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 12, gap: 8, paddingBottom: 18 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  name: { fontSize: 15, fontWeight: '800' },
  meta: { fontSize: 12 },
  followBtn: {
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8
  }
});

export default CommunityScreen;
