import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const ProgressBar = ({ value, max = 100, color = theme.colors.primary, height = 10 }) => {
  const widthPercent = Math.max(0, Math.min(100, Math.round((value / max) * 100)));

  return (
    <View style={[styles.track, { height }]}>
      <View style={[styles.fill, { width: `${widthPercent}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 999
  }
});

export default ProgressBar;
