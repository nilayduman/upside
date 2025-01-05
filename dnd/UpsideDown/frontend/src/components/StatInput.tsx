import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface StatInputProps {
  label: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  modifier: number;
}

export const StatInput = ({ label, value, onIncrease, onDecrease, modifier }: StatInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onDecrease}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.modifier}>{modifier >= 0 ? `+${modifier}` : modifier}</Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={onIncrease}
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
  modifier: {
    fontSize: 14,
    color: '#666',
  },
}); 