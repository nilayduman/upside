import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  Modal 
} from 'react-native';
import { Item, InventoryState } from '../types/inventory';

interface InventoryProps {
  inventory: InventoryState;
  onUseItem?: (item: Item) => void;
  onDropItem?: (item: Item) => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  inventory,
  onUseItem,
  onDropItem,
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentWeight = inventory.items.reduce(
    (total, item) => total + item.weight * item.quantity,
    0
  );

  const renderItem = ({ item }: { item: Item }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => {
        setSelectedItem(item);
        setIsModalVisible(true);
      }}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
      </View>
      <Text style={styles.itemWeight}>{item.weight * item.quantity} lbs</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.weightText}>
          Weight: {currentWeight}/{inventory.maxWeight} lbs
        </Text>
        <Text style={styles.goldText}>Gold: {inventory.gold}</Text>
      </View>

      <FlatList
        data={inventory.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.itemList}
      />

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalDescription}>
                  {selectedItem.description}
                </Text>
                {selectedItem.effects && (
                  <Text style={styles.modalEffects}>
                    Effects: {selectedItem.effects.join(', ')}
                  </Text>
                )}
                <View style={styles.modalButtons}>
                  {onUseItem && (
                    <Pressable
                      style={[styles.modalButton, styles.useButton]}
                      onPress={() => {
                        onUseItem(selectedItem);
                        setIsModalVisible(false);
                      }}
                    >
                      <Text style={styles.buttonText}>Use</Text>
                    </Pressable>
                  )}
                  {onDropItem && (
                    <Pressable
                      style={[styles.modalButton, styles.dropButton]}
                      onPress={() => {
                        onDropItem(selectedItem);
                        setIsModalVisible(false);
                      }}
                    >
                      <Text style={styles.buttonText}>Drop</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}
            <Pressable
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  weightText: {
    color: '#cccccc',
    fontSize: 16,
  },
  goldText: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemList: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    color: '#cccccc',
    fontSize: 14,
  },
  itemWeight: {
    color: '#cccccc',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  modalDescription: {
    color: '#cccccc',
    fontSize: 16,
    marginBottom: 12,
  },
  modalEffects: {
    color: '#00ff9d',
    fontSize: 14,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#4a90e2',
  },
  dropButton: {
    backgroundColor: '#e25555',
  },
  closeButton: {
    backgroundColor: '#666666',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});