import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MapGridProps {
  size: number;
  rows?: number;
  columns?: number;
}

export const MapGrid = ({ size, rows = 20, columns = 20 }: MapGridProps) => {
  return (
    <View style={[styles.container, { width: size * columns, height: size * rows }]}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={`row-${i}`} style={styles.row}>
          {Array.from({ length: columns }).map((_, j) => (
            <View
              key={`cell-${i}-${j}`}
              style={[
                styles.cell,
                {
                  width: size,
                  height: size,
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#34495e',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
}); 