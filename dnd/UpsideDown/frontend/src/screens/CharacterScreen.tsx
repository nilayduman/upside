import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CharacterScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Character Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 