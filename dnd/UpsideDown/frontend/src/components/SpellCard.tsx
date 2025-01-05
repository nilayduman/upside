import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Badge } from './Badge';

interface SpellCardProps {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  description: string;
  onPress?: () => void;
}

export const SpellCard = ({
  name,
  level,
  school,
  castingTime,
  range,
  components,
  duration,
  description,
  onPress
}: SpellCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Badge 
            text={level === 0 ? 'Cantrip' : `Level ${level}`}
            variant={level === 0 ? 'info' : 'primary'}
          />
        </View>

        <View style={styles.subHeader}>
          <Text style={styles.school}>{school}</Text>
          <View style={styles.components}>
            {components.map((component, index) => (
              <Text key={index} style={styles.component}>
                {component}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.detailItem}>
            <Text style={styles.label}>Casting Time: </Text>
            {castingTime}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.label}>Range: </Text>
            {range}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.label}>Duration: </Text>
            {duration}
          </Text>
        </View>

        <Text style={styles.description}>{description}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  school: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  components: {
    flexDirection: 'row',
    gap: 8,
  },
  component: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 