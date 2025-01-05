import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  RefreshControl,
  Alert
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
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

const { width } = Dimensions.get('window');

export const Profile = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: 'DungeonMaster123',
    level: 10,
    xp: 7500,
    nextLevelXp: 10000,
    followers: 150,
    following: 89,
    gamesPlayed: 45,
    winRate: 68,
    achievements: [
      { 
        id: 1,
        name: 'Dragon Slayer',
        icon: '🐲',
        description: 'Defeated the mighty dragon in story mode'
      },
      {
        id: 2,
        name: 'Master Storyteller',
        icon: '📚',
        description: 'Created 10 successful story campaigns'
      },
      {
        id: 3,
        name: 'Party Leader',
        icon: '👑',
        description: 'Led 50 game sessions'
      }
    ],
    recentGames: [
      { 
        id: 1, 
        name: 'The Lost Mine',
        mode: 'story',
        result: 'victory',
        date: '2024-03-15',
        players: ['Player1', 'Player2', 'Player3']
      },
      { 
        id: 2, 
        name: "Dragon's Lair",
        mode: 'versus',
        result: 'defeat',
        date: '2024-03-10',
        players: ['Player4', 'Player5']
      },
    ],
    badges: ['verified', 'premium', 'beta-tester']
  });

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'achievements' | 'games' | 'friends'>('achievements');

  const handleFollow = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to follow users');
      return;
    }

    try {
      setIsFollowing(!isFollowing);
      // TODO: Implement follow/unfollow API call
    } catch (error) {
      Alert.alert('Error', 'Failed to update follow status');
      setIsFollowing(!isFollowing); // Revert on error
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch updated profile data
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
      <TouchableOpacity style={styles.settingsButton}>
        <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderProfileInfo = () => (
    <View style={styles.profileInfo}>
      <View style={styles.avatarContainer}>
        <Image 
          style={styles.avatar}
          source={{ uri: 'https://via.placeholder.com/150' }}
        />
        {userProfile.badges.includes('verified') && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#81b0ff" />
          </View>
        )}
      </View>

      <Text style={styles.username}>{userProfile.username}</Text>
      
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>Level {userProfile.level}</Text>
        <View style={styles.xpBar}>
          <View 
            style={[
              styles.xpProgress, 
              { width: `${(userProfile.xp / userProfile.nextLevelXp) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.xpText}>
          {userProfile.xp} / {userProfile.nextLevelXp} XP
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.gamesPlayed}</Text>
          <Text style={styles.statLabel}>Games</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.followButton, isFollowing && styles.followingButton]}
        onPress={handleFollow}
      >
        <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
        onPress={() => setActiveTab('achievements')}
      >
        <Ionicons 
          name="trophy-outline" 
          size={24} 
          color={activeTab === 'achievements' ? "#81b0ff" : "#999"} 
        />
        <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
          Achievements
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 'games' && styles.activeTab]}
        onPress={() => setActiveTab('games')}
      >
        <Ionicons 
          name="game-controller-outline" 
          size={24} 
          color={activeTab === 'games' ? "#81b0ff" : "#999"} 
        />
        <Text style={[styles.tabText, activeTab === 'games' && styles.activeTabText]}>
          Games
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
        onPress={() => setActiveTab('friends')}
      >
        <Ionicons 
          name="people-outline" 
          size={24} 
          color={activeTab === 'friends' ? "#81b0ff" : "#999"} 
        />
        <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
          Friends
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      {userProfile.achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>{achievement.icon}</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>{achievement.name}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderGames = () => (
    <View style={styles.gamesContainer}>
      {userProfile.recentGames.map((game) => (
        <TouchableOpacity key={game.id} style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <Text style={styles.gameName}>{game.name}</Text>
            <View style={[
              styles.gameResult,
              game.result === 'victory' ? styles.victoryResult : styles.defeatResult
            ]}>
              <Text style={styles.gameResultText}>
                {game.result === 'victory' ? 'Victory' : 'Defeat'}
              </Text>
            </View>
          </View>
          
          <View style={styles.gameInfo}>
            <View style={styles.gameMode}>
              <Ionicons 
                name={game.mode === 'story' ? 'library-outline' : 'shield-outline'} 
                size={16} 
                color="#81b0ff" 
              />
              <Text style={styles.gameModeText}>
                {game.mode === 'story' ? 'Story Mode' : 'Versus Mode'}
              </Text>
            </View>
            <Text style={styles.gameDate}>{game.date}</Text>
          </View>

          <View style={styles.gamePlayers}>
            {game.players.map((player, index) => (
              <Text key={index} style={styles.playerName}>
                {player}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFriends = () => (
    <View style={styles.friendsContainer}>
      <Text style={styles.comingSoon}>Friends feature coming soon!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#81b0ff"
          />
        }
      >
        {renderProfileInfo()}
        {renderTabs()}
        
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'games' && renderGames()}
        {activeTab === 'friends' && renderFriends()}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    padding: 5,
  },
  settingsButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#81b0ff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 2,
  },
  username: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  levelText: {
    fontSize: 16,
    color: '#81b0ff',
    fontWeight: '600',
    marginBottom: 5,
  },
  xpBar: {
    width: width * 0.6,
    height: 6,
    backgroundColor: '#2C2C2C',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#81b0ff',
  },
  xpText: {
    fontSize: 12,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#2C2C2C',
  },
  statNumber: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  followButton: {
    backgroundColor: '#81b0ff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#81b0ff',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#81b0ff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingVertical: 10,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
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
  achievementsContainer: {
    padding: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  achievementIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#999',
  },
  gamesContainer: {
    padding: 15,
  },
  gameCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gameResult: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  victoryResult: {
    backgroundColor: 'rgba(129, 176, 255, 0.2)',
  },
  defeatResult: {
    backgroundColor: 'rgba(255, 99, 99, 0.2)',
  },
  gameResultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameMode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameModeText: {
    fontSize: 12,
    color: '#81b0ff',
    marginLeft: 5,
  },
  gameDate: {
    fontSize: 12,
    color: '#999',
  },
  gamePlayers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  playerName: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#2C2C2C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  friendsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  comingSoon: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});