import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSuccess } from '../context/SuccessContext';

const IntroSplashScreen = ({ navigation, onDone }) => {
  const { palette, t } = useSuccess();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true
      })
    ]);
    animation.start();

    const timer = setTimeout(() => {
      if (onDone) {
        onDone();
        return;
      }
      navigation?.replace?.('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [fade, navigation, scale]);

  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <Animated.View style={[styles.center, { opacity: fade, transform: [{ scale }] }]}>
        <Text style={[styles.title, { color: palette.text }]}>{t('appName')}</Text>
        <Text style={[styles.tagline, { color: palette.subText }]}>{t('splashTagline')}</Text>
      </Animated.View>
      <Text style={[styles.bottom, { color: palette.subText }]}>{t('fromOrzu')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 120,
    paddingBottom: 40
  },
  center: {
    alignItems: 'center',
    gap: 10
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 1
  },
  tagline: {
    fontSize: 15,
    fontWeight: '600'
  },
  bottom: {
    fontSize: 14,
    fontWeight: '700'
  }
});

export default IntroSplashScreen;
