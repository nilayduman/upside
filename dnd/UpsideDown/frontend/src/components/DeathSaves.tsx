import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DeathSavesProps {
  successes: boolean[];
  failures: boolean[];
  onToggleSuccess: (index: number) => void;
  onToggleFailure: (index: number) => void;
}

export const DeathSaves = ({ 
  successes, 
  failures, 
  onToggleSuccess, 
  onToggleFailure 
}: DeathSavesProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Death Saves</Text>
      
      <View style={styles.savesContainer}>
        <View style={styles.saveRow}>
          <Text style={styles.label}>Successes</Text>
          <View style={styles.checksContainer}>
            {[0, 1, 2].map((index) => (
              <TouchableOpacity
                key={`success-${index}`}
                style={[
                  styles.checkbox,
                  successes[index] && styles.checked
                ]}
                onPress={() => onToggleSuccess(index)}
              />
            ))}
          </View>
        </View>

        <View style={styles.saveRow}>
          <Text style={styles.label}>Failures</Text>
          <View style={styles.checksContainer}>
            {[0, 1, 2].map((index) => (
              <TouchableOpacity
                key={`failure-${index}`}
                style={[
                  styles.checkbox,
                  failures[index] && styles.failureChecked
                ]}
                onPress={() => onToggleFailure(index)}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  savesContainer: {
    gap: 8,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#333',
    width: 80,
  },
  checksContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  checked: {
    backgroundColor: '#4A90E2',
  },
  failureChecked: {
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
  },
}); 