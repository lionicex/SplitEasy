import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Group, User } from '@/types';

interface GroupCardProps {
  group: Group;
  users: User[];
  onPress: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, users, onPress }) => {
  const memberCount = group.members.length;
  const memberNames = group.members
    .map(memberId => users.find(user => user.id === memberId)?.name || 'Unknown')
    .join(', ');

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{group.name.charAt(0)}</Text>
        </View>
      </View>
      
      <View style={styles.middleSection}>
        <Text style={styles.title}>{group.name}</Text>
        <Text style={styles.members} numberOfLines={1}>
          {memberCount} {memberCount === 1 ? 'member' : 'members'}: {memberNames}
        </Text>
      </View>
      
      <View style={styles.rightSection}>
        <ChevronRight size={16} color={Colors.gray} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leftSection: {
    marginRight: 16,
    justifyContent: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.white,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  members: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.subtext,
  },
});

export default GroupCard;