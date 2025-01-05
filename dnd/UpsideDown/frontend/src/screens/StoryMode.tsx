import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Pressable,
  Modal 
} from 'react-native';
import { CharacterCreation, Character } from '../components/CharacterCreation';
import { DiceRoller } from '../components/DiceRoller';
import { Inventory } from '../components/Inventory';
import { DungeonMaster } from '../services/DungeonMaster';
import { InventoryState } from '../types/inventory';

export const StoryMode: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [dungeonMaster, setDungeonMaster] = useState<DungeonMaster | null>(null);
  const [story, setStory] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [inventory, setInventory] = useState<InventoryState>({
    items: [],
    gold: 0,
    maxWeight: 50,
  });

  useEffect(() => {
    if (character && !dungeonMaster) {
      const dm = new DungeonMaster(character);
      setDungeonMaster(dm);
      // Start the story
      handleDMResponse("Welcome to your adventure! What would you like to do?");
    }
  }, [character]);

  const handleDMResponse = async (response: string) => {
    setStory(prev => [...prev, response]);
  };

  const handleUserInput = async () => {
    if (!userInput.trim() || !dungeonMaster) return;

    const playerMessage = userInput;
    setStory(prev => [...prev, `You: ${playerMessage}`]);
    setUserInput('');

    const response = await dungeonMaster.getResponse(playerMessage);
    handleDMResponse(response);
  };

  const handleDiceRoll = (total: number) => {
    setStory(prev => [...prev, `🎲 You rolled a ${total}!`]);
  };

  if (!character) {
    return <CharacterCreation onComplete={setCharacter} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.characterName}>{character.name}</Text>
        <View style={styles.headerButtons}>
          <Pressable
            style={styles.headerButton}
            onPress={() => setShowDiceRoller(true)}
          >
            <Text style={styles.headerButtonText}>🎲</Text>
          </Pressable>
          <Pressable
            style={styles.headerButton}
            onPress={() => setShowInventory(true)}
          >
            <Text style={styles.headerButtonText}>🎒</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.storyContainer}>
        {story.map((text, index) => (
          <Text 
            key={index} 
            style={[
              styles.storyText,
              text.startsWith('You:') ? styles.playerText : styles.dmText
            ]}
          >
            {text}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="What would you like to do?"
          placeholderTextColor="#666"
          multiline
        />
        <Pressable 
          style={styles.sendButton}
          onPress={handleUserInput}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>

      <Modal
        visible={showDiceRoller}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDiceRoller(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DiceRoller onRollComplete={handleDiceRoll} />
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowDiceRoller(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showInventory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInventory(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Inventory
              inventory={inventory}
              onUseItem={(item) => {
                // Handle item usage
                setStory(prev => [...prev, `You used ${item.name}`]);
              }}
              onDropItem={(item) => {
                // Handle dropping items
                setStory(prev => [...prev, `You dropped ${item.name}`]);
              }}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowInventory(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2c2c2c',
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
  },
  headerButtonText: {
    fontSize: 20,
  },
  storyContainer: {
    flex: 1,
    padding: 16,
  },
  storyText: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
  playerText: {
    color: '#4a90e2',
  },
  dmText: {
    color: '#ffffff',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#2c2c2c',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    backgroundColor: '#666666',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});