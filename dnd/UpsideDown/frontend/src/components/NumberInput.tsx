import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface NumberInputProps {
  label: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = ({ 
  label, 
  value, 
  onIncrease, 
  onDecrease, 
  min = 0, 
  max = 99,
  step = 1 
}: NumberInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={[styles.button, value <= min && styles.buttonDisabled]} 
          onPress={onDecrease}
          disabled={value <= min}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, value >= max && styles.buttonDisabled]} 
          onPress={onIncrease}
          disabled={value >= max}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  valueContainer: {
    width: 60,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 