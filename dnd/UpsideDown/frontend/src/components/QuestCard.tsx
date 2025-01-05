import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  giver: string;
  location: string;
  rewards?: string[];
}

interface QuestCardProps extends Quest {
  onPress: () => void;
}

export const QuestCard = ({ title, description, status, onPress }: QuestCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={[styles.status, styles[status]]}>{status}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  status: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  active: { color: '#4A90E2' },
  completed: { color: '#2ECC71' },
  failed: { color: '#E74C3C' },
}); 