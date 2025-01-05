import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface MultiSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxSelections?: number;
}

export const MultiSelect = ({ 
  label, 
  options, 
  selectedValues, 
  onChange,
  maxSelections = Infinity 
}: MultiSelectProps) => {
  const handleToggle = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else if (selectedValues.length < maxSelections) {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {maxSelections < Infinity && `(Select up to ${maxSelections})`}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedValues.includes(option) && styles.selectedOption,
              selectedValues.length >= maxSelections && 
              !selectedValues.includes(option) && 
              styles.disabledOption
            ]}
            onPress={() => handleToggle(option)}
            disabled={selectedValues.length >= maxSelections && !selectedValues.includes(option)}
          >
            <Text style={[
              styles.optionText,
              selectedValues.includes(option) && styles.selectedOptionText
            ]}>
              {option}
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
    minWidth: 100,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
  },
  disabledOption: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  optionText: {
    color: '#333',
    fontSize: 14,
  },
  selectedOptionText: {
    color: 'white',
  },
}); 