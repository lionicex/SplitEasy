import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { 
  CreditCard, 
  Bell, 
  Globe, 
  Moon, 
  LogOut, 
  ChevronRight,
  Sparkles
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import useStore from '@/store/useStore';
import Header from '@/components/Header';

export default function SettingsScreen() {
  const { settings, updateSettings } = useStore();
  
  const handleToggleNotifications = (value: boolean) => {
    updateSettings({ notifications: value });
  };
  
  const handleToggleDarkMode = (value: boolean) => {
    updateSettings({ theme: value ? 'dark' : 'light' });
  };
  
  const handleUpgradeToPremium = () => {
    if (settings.isPremium) {
      Alert.alert(
        'Already Premium',
        'You are already enjoying premium features!',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    // In a real app, this would handle payment processing
    Alert.alert(
      'Upgrade to Premium',
      'For $4.99/month, get unlimited expenses per day and advanced reports.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upgrade', 
          onPress: () => {
            updateSettings({ isPremium: true });
            Alert.alert(
              'Premium Activated',
              'You now have access to unlimited expenses and advanced reports!',
              [{ text: 'Great!', style: 'default' }]
            );
          } 
        }
      ]
    );
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleUpgradeToPremium}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#7C4DFF' }]}>
                <Sparkles size={20} color={Colors.white} />
              </View>
              <Text style={styles.settingText}>
                {settings.isPremium ? 'Premium Account' : 'Upgrade to Premium'}
              </Text>
            </View>
            {settings.isPremium ? (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>ACTIVE</Text>
              </View>
            ) : (
              <ChevronRight size={20} color={Colors.gray} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
                <CreditCard size={20} color={Colors.white} />
              </View>
              <Text style={styles.settingText}>Payment Methods</Text>
            </View>
            <ChevronRight size={20} color={Colors.gray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF9800' }]}>
                <Bell size={20} color={Colors.white} />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#607D8B' }]}>
                <Moon size={20} color={Colors.white} />
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={settings.theme === 'dark'}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
                <Globe size={20} color={Colors.white} />
              </View>
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>English</Text>
              <ChevronRight size={20} color={Colors.gray} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.subtext,
    marginRight: 8,
  },
  premiumBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  premiumBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.success,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.error,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    marginTop: 16,
  },
});