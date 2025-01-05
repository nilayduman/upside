import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import { EmojiPicker } from 'emoji-mart-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../config/firebase';
import { GameRoom as GameRoomType } from '../types/gameRoom';
import { Message, MessageType } from '../types/chat';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<AppStackParamList, 'GameRoom'>;
const { width } = Dimensions.get('window');

export const GameRoom: React.FC<Props> = ({ route, navigation }) => {
  const [room, setRoom] = useState<GameRoomType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [isPrivateMessageModalVisible, setIsPrivateMessageModalVisible] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { roomId } = route.params;
  const flatListRef = useRef<FlatList>(null);

  // ... existing useEffect hooks ...

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadAndSendImage(uri);
    }
  };

  const uploadAndSendImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const imageRef = ref(storage, `chat-images/${Date.now()}`);
      
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);
      
      await sendMessage('image', imageUrl);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const sendMessage = async (type: MessageType, content: string = newMessage) => {
    if ((!content.trim() && type === 'text') || !auth.currentUser) return;

    try {
      const message: Omit<Message, 'id'> = {
        roomId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        content: content.trim(),
        timestamp: Date.now(),
        type,
        ...(type === 'private' && selectedRecipient ? {
          recipientId: selectedRecipient.id,
          recipientName: selectedRecipient.name,
        } : {}),
        ...(type === 'image' ? { imageUrl: content } : {}),
      };

      await addDoc(collection(db, 'messages'), message);
      setNewMessage('');
      setIsPrivateMessageModalVisible(false);
      setSelectedRecipient(null);
      
      flatListRef.current?.scrollToEnd();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.roomName}>{room?.name || 'Game Room'}</Text>
        <Text style={styles.playerCount}>
          <Ionicons name="people" size={16} color="#81b0ff" /> {room?.players?.length || 0} Players
        </Text>
      </View>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.userId === auth.currentUser?.uid ? styles.ownMessage : styles.otherMessage
    ]}>
      {item.type === 'image' ? (
        <TouchableOpacity onPress={() => {/* Handle image preview */}}>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.messageImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.userName}>{item.userName}</Text>
          <View style={[
            styles.messageBubble,
            item.userId === auth.currentUser?.uid ? styles.ownBubble : styles.otherBubble
          ]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </>
      )}
    </View>
  );

  const renderInputToolbar = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={styles.inputContainer}
    >
      <View style={styles.inputToolbar}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={pickImage}
        >
          <Ionicons name="image-outline" size={24} color="#81b0ff" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        
        <TouchableOpacity 
          style={styles.emojiButton}
          onPress={() => setIsEmojiPickerVisible(true)}
        >
          <Ionicons name="happy-outline" size={24} color="#81b0ff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage('text')}
          disabled={!newMessage.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={newMessage.trim() ? "#81b0ff" : "#666"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#81b0ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
      />

      {renderInputToolbar()}

      <Modal
        isVisible={isEmojiPickerVisible}
        onBackdropPress={() => setIsEmojiPickerVisible(false)}
        style={styles.modal}
      >
        <BlurView intensity={100} style={styles.emojiPicker}>
          <EmojiPicker
            onEmojiSelected={(emoji: { native: string }) => {
              setNewMessage(prev => prev + emoji.native);
              setIsEmojiPickerVisible(false);
            }}
            columns={8}
          />
        </BlurView>
      </Modal>

      <Modal
        isVisible={isPrivateMessageModalVisible}
        onBackdropPress={() => setIsPrivateMessageModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Send Private Message</Text>
          {/* Add recipient selection and private message UI */}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
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
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerCount: {
    fontSize: 14,
    color: '#81b0ff',
    marginTop: 2,
  },
  menuButton: {
    padding: 5,
  },
  messageList: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  userName: {
    fontSize: 12,
    color: '#81b0ff',
    marginBottom: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#2C2C2C',
  },
  ownBubble: {
    backgroundColor: '#81b0ff',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#2C2C2C',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 12,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
    backgroundColor: '#1A1A1A',
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 100,
    padding: 10,
    backgroundColor: '#2C2C2C',
    borderRadius: 20,
    color: '#FFFFFF',
    fontSize: 16,
  },
  emojiButton: {
    padding: 8,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  emojiPicker: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
});