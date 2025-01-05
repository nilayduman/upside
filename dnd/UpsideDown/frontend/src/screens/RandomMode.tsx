import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export const RandomMode: React.FC = () => {
  const [matchFound, setMatchFound] = useState(false);

  const handleMatchmaking = () => {
    // Simulate matchmaking logic
    setMatchFound(true);
    Alert.alert('Match Found', 'You are now matched with a random player!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Play with Random Players</Text>
      <Button title="Find a Match" onPress={handleMatchmaking} />
      {matchFound && <Text style={styles.matchText}>You are in a game!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  matchText: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
});