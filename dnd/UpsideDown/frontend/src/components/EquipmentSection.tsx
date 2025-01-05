import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from './Card';
import { SelectList } from './SelectList';
import { Equipment } from '../types/character';

interface EquipmentSectionProps {
  equipment: Equipment[];
  onEquip: (id: string) => void;
  onUnequip: (id: string) => void;
}

export const EquipmentSection = ({ equipment, onEquip, onUnequip }: EquipmentSectionProps) => {
  const equipmentByType = equipment.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Equipment[]>);

  return (
    <View style={styles.container}>
      {Object.entries(equipmentByType).map(([type, items]) => (
        <Card key={type} style={styles.section}>
          <Text style={styles.typeTitle}>{type.charAt(0).toUpperCase() + type.slice(1)}s</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.quantity}>×{item.quantity}</Text>
                <SelectList
                  label=""
                  options={[
                    { value: 'Equipped', label: 'Equipped' },
                    { value: 'Unequipped', label: 'Unequipped' }
                  ]}
                  value={item.equipped ? 'Equipped' : 'Unequipped'}
                  onChange={(value) => 
                    value === 'Equipped' ? onEquip(item.id) : onUnequip(item.id)
                  }
                />
              </View>
            ))}
          </ScrollView>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  itemContainer: {
    marginRight: 16,
    minWidth: 150,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
}); 