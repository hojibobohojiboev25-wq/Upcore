import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ title, value, subtitle, palette }) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.card,
          borderColor: palette.border
        }
      ]}
    >
      <Text style={[styles.title, { color: palette.subText }]}>{title}</Text>
      <Text style={[styles.value, { color: palette.text }]}>{value}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: palette.subText }]}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6
  },
  title: {
    fontSize: 13,
    fontWeight: '600'
  },
  value: {
    fontSize: 24,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 12
  }
});

export default StatCard;
