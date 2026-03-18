import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ value, max = 100, color = '#4F8CFF', height = 10, trackColor = '#253453' }) => {
  const widthPercent = Math.max(0, Math.min(100, Math.round((value / max) * 100)));

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }]}>
      <View style={[styles.fill, { width: `${widthPercent}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 999
  }
});

export default ProgressBar;
