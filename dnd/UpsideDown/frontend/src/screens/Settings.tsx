import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Platform } from 'react-native';
import { RootNavigationProp } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: RootNavigationProp;
};

export const Settings = ({ navigation }: Props) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const appVersion = "1.0.0";

  const languages = ["English", "Turkish", "Spanish"];
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButtonContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Settings</Text>
    </View>
  );

  const renderSettingItem = (icon: string, title: string, value?: React.ReactNode) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon as any} size={22} color="#81b0ff" style={styles.menuIcon} />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      {value ? value : <Ionicons name="chevron-forward" size={20} color="#666" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem("notifications-outline", "Push Notifications",
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          )}
          {renderSettingItem("moon-outline", "Dark Mode",
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkMode ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          {languages.map((lang) => (
            <TouchableOpacity 
              key={lang}
              style={[styles.menuItem, selectedLanguage === lang && styles.selectedMenuItem]}
              onPress={() => setSelectedLanguage(lang)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="language-outline" size={22} color="#81b0ff" style={styles.menuIcon} />
                <Text style={styles.menuText}>{lang}</Text>
              </View>
              {selectedLanguage === lang && (
                <Ionicons name="checkmark" size={22} color="#81b0ff" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Privacy</Text>
          {renderSettingItem("shield-checkmark-outline", "Privacy Settings")}
          {renderSettingItem("lock-closed-outline", "Security")}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderSettingItem("help-circle-outline", "Help Center")}
          {renderSettingItem("mail-outline", "Contact Us")}
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>About</Text>
          {renderSettingItem("information-circle-outline", "Version", 
            <Text style={styles.versionText}>{appVersion}</Text>
          )}
        </View>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 25,
  },
  lastSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#81b0ff',
    marginBottom: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  menuItem: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  selectedMenuItem: {
    backgroundColor: '#2C2C2C',
    borderColor: '#81b0ff',
    borderWidth: 1,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  versionText: {
    color: '#666',
    fontSize: 14,
  }
});
