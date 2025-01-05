import React from 'react';
import { Animated, PanResponder, StyleSheet, Text } from 'react-native';

interface Token {
  id: string;
  position: { x: number; y: number };
  type: 'player' | 'enemy' | 'npc';
  color: string;
  name: string;
}

interface MapTokenProps {
  token: Token;
  gridSize: number;
  onMove?: (newPosition: { x: number; y: number }) => void;
}

export const MapToken = ({ token, gridSize, onMove }: MapTokenProps) => {
  const pan = new Animated.ValueXY({
    x: token.position.x * gridSize,
    y: token.position.y * gridSize,
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gesture) => {
      const newX = Math.round((token.position.x * gridSize + gesture.dx) / gridSize);
      const newY = Math.round((token.position.y * gridSize + gesture.dy) / gridSize);
      
      onMove?.({ x: newX, y: newY });
      
      Animated.spring(pan, {
        toValue: { x: newX * gridSize, y: newY * gridSize },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.token,
        {
          backgroundColor: token.color,
          width: gridSize * 0.8,
          height: gridSize * 0.8,
          transform: pan.getTranslateTransform(),
        },
      ]}
    >
      <Text style={styles.tokenText}>{token.name[0]}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  token: {
    position: 'absolute',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 