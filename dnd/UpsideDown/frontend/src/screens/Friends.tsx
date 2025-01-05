import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';

type FriendRequest = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
};

type Friend = {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline' | 'in-game';
  lastSeen?: number;
};

export const Friends = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // Listen to friend requests
    const unsubscribeRequests = onSnapshot(
      query(
        collection(db, 'friendRequests'),
        where('receiverId', '==', auth.currentUser.uid),
        where('status', '==', 'pending')
      ),
      (snapshot) => {
        const requests: FriendRequest[] = [];
        snapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() } as FriendRequest);
        });
        setFriendRequests(requests);
      }
    );

    // Listen to friends list
    const unsubscribeFriends = onSnapshot(
      query(
        collection(db, 'friends'),
        where('userId', '==', auth.currentUser.uid)
      ),
      (snapshot) => {
        const friendsList: Friend[] = [];
        snapshot.forEach((doc) => {
          friendsList.push({ id: doc.id, ...doc.data() } as Friend);
        });
        setFriends(friendsList);
      }
    );

    return () => {
      unsubscribeRequests();
      unsubscribeFriends();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !auth.currentUser) return;

    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('username', '>=', searchQuery),
        where('username', '<=', searchQuery + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const results: Friend[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.userId !== auth.currentUser?.uid) {
          results.push({
            id: doc.id,
            userId: userData.userId,
            username: userData.username,
            avatar: userData.avatar,
            status: userData.status || 'offline',
            lastSeen: userData.lastSeen,
          });
        }
      });
      
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Error', 'Failed to search for users');
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to add friends');
      return;
    }

    try {
      await addDoc(collection(db, 'friendRequests'), {
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName,
        senderAvatar: auth.currentUser.photoURL,
        receiverId: userId,
        status: 'pending',
        timestamp: Date.now(),
      });

      Alert.alert('Success', 'Friend request sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const handleFriendRequest = async (requestId: string, accept: boolean) => {
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      await updateDoc(requestRef, {
        status: accept ? 'accepted' : 'rejected',
      });

      if (accept) {
        const request = friendRequests.find(r => r.id === requestId);
        if (request) {
          await addDoc(collection(db, 'friends'), {
            userId: auth.currentUser?.uid,
            friendId: request.senderId,
            username: request.senderName,
            avatar: request.senderAvatar,
            status: 'offline',
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process friend request');
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      const friendRef = doc(db, 'friends', friendId);
      await deleteDoc(friendRef);
      Alert.alert('Success', 'Friend removed');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove friend');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh friends and requests data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Friends</Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for users..."
          placeholderTextColor="#999"
          onSubmitEditing={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
        onPress={() => setActiveTab('friends')}
      >
        <Ionicons 
          name="people" 
          size={24} 
          color={activeTab === 'friends' ? "#81b0ff" : "#999"} 
        />
        <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
          Friends
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
        onPress={() => setActiveTab('requests')}
      >
        <View style={styles.tabContent}>
          <Ionicons 
            name="person-add" 
            size={24} 
            color={activeTab === 'requests' ? "#81b0ff" : "#999"} 
          />
          {friendRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{friendRequests.length}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
          Requests
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={
              item.avatar
                ? { uri: item.avatar }
                : require('../assets/images/default-avatar.png')
            }
          />
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
        </View>
        <View style={styles.friendDetails}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.status}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          Alert.alert(
            'Remove Friend',
            'Are you sure you want to remove this friend?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', onPress: () => removeFriend(item.id), style: 'destructive' },
            ]
          );
        }}
      >
        <Ionicons name="person-remove" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  const renderRequestItem = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestItem}>
      <View style={styles.friendInfo}>
        <Image
          style={styles.avatar}
          source={
            item.senderAvatar
              ? { uri: item.senderAvatar }
              : require('../assets/images/default-avatar.png')
          }
        />
        <View style={styles.friendDetails}>
          <Text style={styles.username}>{item.senderName}</Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={[styles.requestButton, styles.acceptButton]}
          onPress={() => handleFriendRequest(item.id, true)}
        >
          <Ionicons name="checkmark" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.requestButton, styles.rejectButton]}
          onPress={() => handleFriendRequest(item.id, false)}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchResult = ({ item }: { item: Friend }) => (
    <View style={styles.searchResultItem}>
      <View style={styles.friendInfo}>
        <Image
          style={styles.avatar}
          source={
            item.avatar
              ? { uri: item.avatar }
              : require('../assets/images/default-avatar.png')
          }
        />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => sendFriendRequest(item.userId)}
      >
        <Ionicons name="person-add" size={24} color="#81b0ff" />
      </TouchableOpacity>
    </View>
  );

  const FriendItem = ({ friend }: { friend: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={
              friend.avatar
                ? { uri: friend.avatar }
                : require('../assets/images/default-avatar.png')
            }
          />
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(friend.status) }]} />
        </View>
        <View style={styles.friendDetails}>
          <Text style={styles.username}>{friend.username}</Text>
          <Text style={styles.status}>{getStatusText(friend.status)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          Alert.alert(
            'Remove Friend',
            'Are you sure you want to remove this friend?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', onPress: () => removeFriend(friend.id), style: 'destructive' },
            ]
          );
        }}
      >
        <Ionicons name="person-remove" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderSearchBar()}
      {renderTabs()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#81b0ff" />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={
            searchQuery
              ? searchResults
              : activeTab === 'friends'
              ? friends.filter((friend): friend is Friend => 'userId' in friend)
              : friendRequests.filter((request): request is FriendRequest => 'senderId' in request && 'receiverId' in request)
          }
          renderItem={
            searchQuery
              ? renderSearchResult
              : activeTab === 'friends'
              ? ({ item }: { item: Friend }) => <FriendItem friend={item} />
              : ({ item }: { item: FriendRequest }) => renderRequestItem({ item })
          }
          keyExtractor={
            searchQuery
              ? (item: Friend) => item.id
              : activeTab === 'friends'
              ? (item: Friend) => item.userId
              : (item: FriendRequest) => item.id
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#81b0ff"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'No users found'
                  : activeTab === 'friends'
                  ? 'No friends yet'
                  : 'No friend requests'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const getStatusColor = (status: Friend['status']) => {
  switch (status) {
    case 'online':
      return '#4CAF50';
    case 'in-game':
      return '#81b0ff';
    default:
      return '#999';
  }
};

const getStatusText = (status: Friend['status']) => {
  switch (status) {
    case 'online':
      return 'Online';
    case 'in-game':
      return 'In Game';
    default:
      return 'Offline';
  }
};

const formatTimestamp = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) {
    return 'Just now';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}m ago`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}h ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
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
  searchContainer: {
    padding: 15,
    backgroundColor: '#1A1A1A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabContent: {
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#81b0ff',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  activeTabText: {
    color: '#81b0ff',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    padding: 15,
    marginBottom: 1,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#121212',
  },
  friendDetails: {
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actionButton: {
    padding: 10,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    padding: 15,
    marginBottom: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  requestButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#ff4444',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    padding: 15,
    marginBottom: 1,
  },
  addButton: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
