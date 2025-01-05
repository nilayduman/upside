import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Badge } from './Badge';

interface InventoryItemProps {
  name: string;
  quantity: number;
  weight?: number;
  value?: string;
  description: string;
  type: 'weapon' | 'armor' | 'potion' | 'gear' | 'treasure';
  onPress?: () => void;
}

export const InventoryItem = ({
  name,
  quantity,
  weight,
  value,
  description,
  type,
  onPress
}: InventoryItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{name}</Text>
            <Badge 
              text={type} 
              variant={
                type === 'weapon' ? 'danger' :
                type === 'armor' ? 'primary' :
                type === 'potion' ? 'success' :
                'info'
              }
            />
          </View>
          <Text style={styles.quantity}>×{quantity}</Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.footer}>
          {weight && (
            <Text style={styles.detail}>Weight: {weight} lb</Text>
          )}
          {value && (
            <Text style={styles.detail}>Value: {value}</Text>
          )}
        </View>
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  detail: {
    fontSize: 12,
    color: '#999',
  },
}); 