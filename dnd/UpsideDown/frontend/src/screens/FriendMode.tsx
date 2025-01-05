import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, Alert } from 'react-native';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase'; 
import { GameRoom } from '../types/gameRoom';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';

export const FriendMode: React.FC = () => {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Subscribe to game rooms
    const q = query(collection(db, 'gameRooms'), where('status', '==', 'waiting'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomData: GameRoom[] = [];
      snapshot.forEach((doc) => {
        roomData.push({ id: doc.id, ...doc.data() } as GameRoom);
      });
      setRooms(roomData);
    });

    return () => unsubscribe();
  }, []);

  const createRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }

    try {
      setLoading(true);
      const newRoom: Omit<GameRoom, 'id'> = {
        hostId: auth.currentUser?.uid || '',
        name: roomName,
        players: [{
          id: auth.currentUser?.uid || '',
          name: auth.currentUser?.displayName || 'Host',
          role: 'host'
        }],
        status: 'waiting',
        createdAt: Date.now(),
        maxPlayers: 5
      };

      await addDoc(collection(db, 'gameRooms'), newRoom);
      setRoomName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (room: GameRoom) => {
    try {
      // Add the current user to the room's players
      const updatedPlayers = [...room.players, {
        id: auth.currentUser?.uid || '',
        name: auth.currentUser?.displayName || 'Player',
        role: 'player'
      }];

      await updateDoc(doc(db, 'gameRooms', room.id), {
        players: updatedPlayers
      });

      // Navigate to the game room
      navigation.navigate('GameRoom', { roomId: room.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to join room');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.createRoom}>
        <Text style={styles.title}>Create Game Room</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter room name"
          placeholderTextColor="#808080"
          value={roomName}
          onChangeText={setRoomName}
        />
        <Pressable 
          style={styles.button}
          onPress={createRoom}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Room'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.roomList}>
        <Text style={styles.subtitle}>Available Rooms</Text>
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable 
              style={styles.roomItem}
              onPress={() => joinRoom(item)}
            >
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.playerCount}>
                Players: {item.players.length}/{item.maxPlayers}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  createRoom: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  input: {
    height: 40,
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#2C2C2C',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roomList: {
    flex: 1,
  },
  roomItem: {
    backgroundColor: '#2C2C2C',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#404040',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  playerCount: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});