import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

interface SelectListProps {
  label: string;
  options: (SelectOption | string)[];
  value: string;
  onChange: (value: string) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export const SelectList = ({ 
  label, 
  options, 
  value, 
  onChange,
  multiple = false,
  disabled = false 
}: SelectListProps) => {
  const normalizedOptions = options.map(option => 
    typeof option === 'string' ? { value: option, label: option } : option
  );

  const selectedValues = multiple ? value.split(',') : [value];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {normalizedOptions.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const isDisabled = disabled || option.disabled;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                isDisabled && styles.disabledOption
              ]}
              onPress={() => {
                if (!isDisabled) {
                  if (multiple) {
                    const newValues = isSelected
                      ? selectedValues.filter(v => v !== option.value)
                      : [...selectedValues, option.value];
                    onChange(newValues.join(','));
                  } else {
                    onChange(option.value);
                  }
                }
              }}
              disabled={isDisabled}
            >
              <Text style={[
                styles.optionText,
                isSelected && styles.selectedOptionText,
                isDisabled && styles.disabledOptionText
              ]}>
                {option.label}
              </Text>
              {option.description && (
                <Text style={[
                  styles.descriptionText,
                  isSelected && styles.selectedDescriptionText,
                  isDisabled && styles.disabledDescriptionText
                ]}>
                  {option.description}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
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
    opacity: 0.5,
  },
  optionText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
  },
  disabledOptionText: {
    color: '#999',
  },
  descriptionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedDescriptionText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  disabledDescriptionText: {
    color: '#999',
  },
});