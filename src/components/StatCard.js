import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const StatCard = ({ title, value, subtitle }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6
  },
  title: {
    color: theme.colors.subText,
    fontSize: 13,
    fontWeight: '600'
  },
  value: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800'
  },
  subtitle: {
    color: theme.colors.subText,
    fontSize: 12
  }
});

export default StatCard;
