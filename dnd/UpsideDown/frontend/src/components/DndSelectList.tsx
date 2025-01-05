import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface DndOption {
  id: string;
  name: string;
  description: string;
  modifier?: string;
  type?: 'skill' | 'weapon' | 'armor' | 'tool' | 'language';
}

interface DndSelectListProps {
  label: string;
  options: DndOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxSelections?: number;
  showModifiers?: boolean;
}

export const DndSelectList = ({ 
  label, 
  options, 
  selectedIds, 
  onChange,
  maxSelections = Infinity,
  showModifiers = false
}: DndSelectListProps) => {
  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else if (selectedIds.length < maxSelections) {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {maxSelections < Infinity && `(Choose ${maxSelections})`}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selectedIds.includes(option.id) && styles.selectedOption,
              selectedIds.length >= maxSelections && 
              !selectedIds.includes(option.id) && 
              styles.disabledOption
            ]}
            onPress={() => handleToggle(option.id)}
            disabled={selectedIds.length >= maxSelections && !selectedIds.includes(option.id)}
          >
            <Text style={[
              styles.optionName,
              selectedIds.includes(option.id) && styles.selectedText
            ]}>
              {option.name}
            </Text>
            {showModifiers && option.modifier && (
              <Text style={[
                styles.modifier,
                selectedIds.includes(option.id) && styles.selectedText
              ]}>
                {option.modifier}
              </Text>
            )}
            <Text style={[
              styles.description,
              selectedIds.includes(option.id) && styles.selectedDescription
            ]}>
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    minWidth: 150,
    maxWidth: 200,
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionName: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  modifier: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  description: {
    color: '#666',
    fontSize: 12,
  },
  selectedText: {
    color: 'white',
  },
  selectedDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
}); 