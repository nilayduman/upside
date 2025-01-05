import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RootNavigationProp } from '../types/navigation';

type Props = {
  navigation: RootNavigationProp;
};

export const Home = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to D&D</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('GameModes')}
      >
        <Text style={styles.buttonText}>Start Playing</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#e61919',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
