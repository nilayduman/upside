import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';

interface GameCodeEntryProps {
  onSubmit: (code: string) => void;
  onCancel: () => void;
}

export const GameCodeEntry = ({ onSubmit, onCancel }: GameCodeEntryProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (code.length !== 6) {
      setError('Game code must be 6 characters');
      return;
    }
    setError('');
    onSubmit(code.toUpperCase());
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Enter Game Code</Text>
      
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={text => {
          setCode(text.toUpperCase());
          setError('');
        }}
        placeholder="Enter 6-character code"
        maxLength={6}
        autoCapitalize="characters"
        autoCorrect={false}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttons}>
        <Button
          title="Cancel"
          onPress={onCancel}
          style={styles.cancelButton}
        />
        <Button
          title="Join Game"
          onPress={handleSubmit}
          disabled={code.length !== 6}
          style={styles.submitButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 16,
  },
  error: {
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#ccc',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
}); 