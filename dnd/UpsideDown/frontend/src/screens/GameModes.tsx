import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppNavigationProp } from '../types/navigation';

type Props = {
  navigation: AppNavigationProp;
};

export const GameModes = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Adventure</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('FriendMode')}
      >
        <Text style={styles.buttonText}>Play with Friends</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('RandomMode')}
      >
        <Text style={styles.buttonText}>Random Adventure</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('StoryMode')}
      >
        <Text style={styles.buttonText}>Story Mode</Text>
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
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#e61919',
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 