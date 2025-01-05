import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Alert,
  Switch,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateGameRoom'>;
const { width } = Dimensions.get('window');

export const CreateGameRoom = ({ navigation }: Props) => {
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('4');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [gameMode, setGameMode] = useState<'story' | 'versus'>('versus');

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to create a room');
      return;
    }

    try {
      const roomData = {
        name: roomName.trim(),
        maxPlayers: parseInt(maxPlayers),
        isPrivate,
        password: isPrivate ? password : '',
        gameMode,
        createdBy: {
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName || 'Anonymous'
        },
        players: [{
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName || 'Anonymous'
        }],
        createdAt: Date.now(),
        status: 'waiting'
      };

      const docRef = await addDoc(collection(db, 'rooms'), roomData);
      navigation.replace('GameRoom', { roomId: docRef.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to create room');
    }
  };

  const renderModeCard = (mode: 'story' | 'versus', title: string, description: string) => (
    <TouchableOpacity
      style={[
        styles.modeCard,
        gameMode === mode && styles.selectedModeCard
      ]}
      onPress={() => setGameMode(mode)}
    >
      <Image
        source={mode === 'story' 
          ? require('../assets/images/story-mode.jpg')
          : require('../assets/images/versus-mode.jpg')
        }
        style={styles.modeImage}
      />
      <BlurView intensity={80} style={styles.modeContent}>
        <Text style={styles.modeTitle}>{title}</Text>
        <Text style={styles.modeDescription}>{description}</Text>
      </BlurView>
      {gameMode === mode && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#81b0ff" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Game Room</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Game Mode</Text>
        <View style={styles.modeContainer}>
          {renderModeCard(
            'story',
            'Story Mode',
            'Embark on an epic adventure with friends'
          )}
          {renderModeCard(
            'versus',
            'Versus Mode',
            'Challenge your friends in intense battles'
          )}
        </View>

        <Text style={styles.sectionTitle}>Room Settings</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="game-controller-outline" size={20} color="#81b0ff" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={roomName}
              onChangeText={setRoomName}
              placeholder="Room Name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="people-outline" size={20} color="#81b0ff" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={maxPlayers}
              onChangeText={setMaxPlayers}
              placeholder="Max Players"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Ionicons name="lock-closed-outline" size={20} color="#81b0ff" />
              <Text style={styles.switchLabel}>Private Room</Text>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isPrivate ? '#FFFFFF' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </View>

          {isPrivate && (
            <View style={styles.inputWrapper}>
              <Ionicons name="key-outline" size={20} color="#81b0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Room Password"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateRoom}
        >
          <Text style={styles.createButtonText}>Create Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#81b0ff',
    marginBottom: 15,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  modeCard: {
    width: width * 0.43,
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2C2C2C',
  },
  selectedModeCard: {
    borderColor: '#81b0ff',
    borderWidth: 2,
  },
  modeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  modeContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'flex-end',
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  modeDescription: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  inputContainer: {
    gap: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#3d3d3d',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 15,
  },
  switchContainer: {
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#3d3d3d',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
  },
  createButton: {
    backgroundColor: '#81b0ff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#81b0ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
