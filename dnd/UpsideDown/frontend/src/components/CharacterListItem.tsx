import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Badge } from './Badge';
import { Character } from '../types/character';

interface CharacterListItemProps {
  character: Character;
  onPress: () => void;
}

export const CharacterListItem = ({ character, onPress }: CharacterListItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>{character.name}</Text>
          <Badge text={`Level ${character.level}`} variant="info" />
        </View>
        
        <View style={styles.details}>
          <Text style={styles.detail}>
            <Text style={styles.label}>Race: </Text>
            {character.race}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Class: </Text>
            {character.class}
          </Text>
        </View>

        <View style={styles.stats}>
          {Object.entries(character.stats).map(([stat, value]) => (
            <View key={stat} style={styles.statItem}>
              <Text style={styles.statLabel}>{stat.slice(0, 3).toUpperCase()}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
}); 