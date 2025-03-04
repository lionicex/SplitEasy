import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import useStore from '@/store/useStore';
import Header from '@/components/Header';
import Button from '@/components/Button';

export default function AddGroupScreen() {
  const router = useRouter();
  const { currentUser, users, addGroup } = useStore();
  
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    currentUser ? [currentUser.id] : []
  );
  
  if (!currentUser) return null;
  
  const toggleMember = (userId: string) => {
    // Current user should always be included
    if (userId === currentUser.id) return;
    
    setSelectedMembers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    
    if (selectedMembers.length < 2) {
      Alert.alert('Error', 'Please select at least one other member');
      return;
    }
    
    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      members: selectedMembers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addGroup(newGroup);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Create Group" 
        showBackButton
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            placeholderTextColor={Colors.gray}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Members</Text>
          <Text style={styles.helperText}>
            Select the people you want to add to this group
          </Text>
          
          <View style={styles.membersContainer}>
            {users.map(user => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.memberItem,
                  selectedMembers.includes(user.id) && styles.selectedMemberItem,
                  user.id === currentUser.id && styles.currentUserItem,
                ]}
                onPress={() => toggleMember(user.id)}
                disabled={user.id === currentUser.id}
              >
                <View style={styles.memberInfo}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberInitial}>{user.name.charAt(0)}</Text>
                  </View>
                  <Text style={styles.memberName}>
                    {user.id === currentUser.id ? 'You' : user.name}
                  </Text>
                </View>
                
                {selectedMembers.includes(user.id) ? (
                  <Check size={20} color={Colors.primary} />
                ) : (
                  <X size={20} color={Colors.gray} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <Button
          title="Create Group"
          onPress={handleCreateGroup}
          style={styles.createButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  helperText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  membersContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  selectedMemberItem: {
    backgroundColor: '#F0F9FF',
  },
  currentUserItem: {
    backgroundColor: '#F5F5F5',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitial: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  memberName: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  createButton: {
    marginTop: 16,
    marginBottom: 32,
  }
});