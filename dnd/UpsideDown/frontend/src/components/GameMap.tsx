import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import { MapGrid } from './MapGrid';
import { MapToken } from './MapToken';

interface Position {
  x: number;
  y: number;
}

interface Token {
  id: string;
  position: Position;
  type: 'player' | 'enemy' | 'npc';
  color: string;
  name: string;
}

interface GameMapProps {
  gridSize: number; // Size of each grid square in pixels
  tokens: Token[];
  onTokenMove?: (tokenId: string, newPosition: Position) => void;
}

export const GameMap = ({ gridSize = 50, tokens = [], onTokenMove }: GameMapProps) => {
  const [pan] = useState(new Animated.ValueXY());
  const [scale] = useState(new Animated.Value(1));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      })(_, gesture);
    },
    onPanResponderRelease: () => {
      // Snap to grid
      const x = Math.round(pan.x._value / gridSize) * gridSize;
      const y = Math.round(pan.y._value / gridSize) * gridSize;
      Animated.spring(pan, {
        toValue: { x, y },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.mapContainer,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: scale },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <MapGrid size={gridSize} />
        {tokens.map((token) => (
          <MapToken
            key={token.id}
            token={token}
            gridSize={gridSize}
            onMove={(newPos) => onTokenMove?.(token.id, newPos)}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    overflow: 'hidden',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}); 