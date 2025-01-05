import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthNavigationProp } from '../../types/navigation';

type Props = {
  navigation: AuthNavigationProp;
};

export const Registration = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
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
  },
});