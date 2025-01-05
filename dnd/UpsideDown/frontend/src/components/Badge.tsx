import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  text: string;
  variant: 'primary' | 'info' | 'success' | 'danger';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ text, variant, style }) => {
  return (
    <View style={[styles.container, styles[variant], style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: '#4A90E2',
  },
  success: {
    backgroundColor: '#2ECC71',
  },
  warning: {
    backgroundColor: '#F1C40F',
  },
  danger: {
    backgroundColor: '#E74C3C',
  },
  info: {
    backgroundColor: '#95A5A6',
  },
}); 