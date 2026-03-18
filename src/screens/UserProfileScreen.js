import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSuccess } from '../context/SuccessContext';

const UserProfileScreen = ({ route }) => {
  const { uid } = route.params || {};
  const { followUser, unfollowUser, subscribeUserById, palette, t } = useSuccess();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeUserById(uid, setUser);
    return unsubscribe;
  }, [subscribeUserById, uid]);

  if (!user) {
    return (
      <View style={[styles.screen, { backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: palette.subText }}>...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <Text style={{ color: palette.subText, fontWeight: '800' }}>
              {(user.displayName || 'U').slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={[styles.name, { color: palette.text }]}>{user.displayName || 'User'}</Text>
        <Text style={[styles.meta, { color: palette.subText }]}>
          {t('followers')}: {user.followersCount || 0} | {t('following')}: {user.followingCount || 0}
        </Text>
        <Text style={[styles.meta, { color: palette.subText }]}>{user.mission || '-'}</Text>
        <Pressable
          style={[styles.followBtn, { backgroundColor: palette.primary }]}
          onPress={() => (user.isFollowedByMe ? unfollowUser(uid) : followUser(uid))}
        >
          <Text style={styles.followText}>{user.isFollowedByMe ? t('unfollow') : t('follow')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 10
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: { fontSize: 22, fontWeight: '800' },
  meta: { fontSize: 13 },
  followBtn: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 11
  },
  followText: { color: '#fff', fontWeight: '800' }
});

export default UserProfileScreen;
