import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet, Switch } from 'react-native';
import { useAppStore } from '../context';
import { Settings as SettingsIcon, Bell, Lock, Save } from 'lucide-react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import BlurHeader from '../components/BlurHeader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  rowLabel: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  tabText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default function Settings() {
  const { user, updateUser } = useAppStore();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy'>('account');
  
  const [accountForm, setAccountForm] = useState({
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
  });

  const [notifications, setNotifications] = useState({
    matchReminders: true,
    opponentAssignments: true,
    tournamentUpdates: true,
    leaderboardChanges: false,
  });

  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    allowFriendRequests: true,
    publicProfile: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setAccountForm({
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleSaveAccount = async () => {
    setIsSaving(true);
    try {
      await updateUser({
        email: accountForm.email,
        phoneNumber: accountForm.phoneNumber,
        location: accountForm.location,
      });
      Alert.alert('Success', 'Account settings updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update account settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <BlurHeader title="Settings" />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {(['account', 'notifications', 'privacy'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Settings */}
        {activeTab === 'account' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#64748b"
                value={accountForm.email}
                onChangeText={(text) => setAccountForm({...accountForm, email: text})}
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#64748b"
                value={accountForm.phoneNumber}
                onChangeText={(text) => setAccountForm({...accountForm, phoneNumber: text})}
              />

              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="City, Country"
                placeholderTextColor="#64748b"
                value={accountForm.location}
                onChangeText={(text) => setAccountForm({...accountForm, location: text})}
              />

              <TouchableOpacity 
                style={styles.button}
                onPress={handleSaveAccount}
                disabled={isSaving}
              >
                <Text style={styles.buttonText}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Password</Text>
              
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                secureTextEntry
              />

              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                secureTextEntry
              />

              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                secureTextEntry
              />

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Match Reminders</Text>
              <Switch
                value={notifications.matchReminders}
                onValueChange={(value) => setNotifications({...notifications, matchReminders: value})}
                trackColor={{ false: '#334155', true: '#7c3aed' }}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Opponent Assignments</Text>
              <Switch
                value={notifications.opponentAssignments}
                onValueChange={(value) => setNotifications({...notifications, opponentAssignments: value})}
                trackColor={{ false: '#334155', true: '#7c3aed' }}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Tournament Updates</Text>
              <Switch
                value={notifications.tournamentUpdates}
                onValueChange={(value) => setNotifications({...notifications, tournamentUpdates: value})}
                trackColor={{ false: '#334155', true: '#7c3aed' }}
              />
            </View>

            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <Text style={styles.rowLabel}>Leaderboard Changes</Text>
              <Switch
                value={notifications.leaderboardChanges}
                onValueChange={(value) => setNotifications({...notifications, leaderboardChanges: value})}
                trackColor={{ false: '#334155', true: '#7c3aed' }}
              />
            </View>
          </View>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Show Online Status</Text>
              <Switch
                value={privacy.showOnlineStatus}
                onValueChange={(value) => setPrivacy({...privacy, showOnlineStatus: value})}
                trackColor={{ false: '#334155', true: '#7c3aed' }}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Allow Friend Requests</Text>
              <Switch
                value={privacy.allowFriendRequests}
                onValueChange={(value) => setPrivacy({...privacy, allowFriendRequests: value})}
                trackColor={{ false: '#334155', true: '#7c3aed' }}
              />
            </View>

            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <Text style={styles.rowLabel}>Public Profile</Text>
              <Switch
                value={privacy.publicProfile}
                onValueChange={(value) => setPrivacy({...privacy, publicProfile: value})}
                trackColor={{ false: '#334155', true: '#7c3aed' }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
