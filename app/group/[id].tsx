import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Plus, 
  UserPlus, 
  Settings, 
  Receipt, 
  ArrowRight 
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import useStore from '@/store/useStore';
import Header from '@/components/Header';
import ExpenseCard from '@/components/ExpenseCard';
import EmptyState from '@/components/EmptyState';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    currentUser, 
    users, 
    groups, 
    expenses,
    getGroupExpenses,
    canAddExpenseToday
  } = useStore();
  
  const [showOptions, setShowOptions] = useState(false);
  
  if (!id || !currentUser) return null;
  
  const group = groups.find(g => g.id === id);
  if (!group) {
    router.back();
    return null;
  }
  
  const groupExpenses = getGroupExpenses(id);
  const sortedExpenses = [...groupExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const groupMembers = users.filter(user => group.members.includes(user.id));
  
  const handleAddExpense = () => {
    if (!canAddExpenseToday()) {
      Alert.alert(
        'Daily Limit Reached',
        'You\'ve reached your limit of 3 expenses per day. Upgrade to premium for unlimited expenses or wait until tomorrow.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade to Premium', onPress: () => {} }
        ]
      );
      return;
    }
    
    router.push({
      pathname: '/add-expense',
      params: { groupId: id }
    });
  };
  
  const handleAddMember = () => {
    // Navigate to add member screen
    setShowOptions(false);
  };
  
  const handleGroupSettings = () => {
    // Navigate to group settings screen
    setShowOptions(false);
  };
  
  const renderExpenseItem = ({ item }) => (
    <ExpenseCard
      expense={item}
      users={users}
      currentUserId={currentUser.id}
      onPress={() => router.push(`/expense/${item.id}`)}
    />
  );
  
  const renderEmptyState = () => (
    <EmptyState
      title="No expenses yet"
      description="Add your first expense to this group to start tracking shared costs."
      buttonTitle="Add Expense"
      onButtonPress={handleAddExpense}
      icon={<Receipt size={64} color={Colors.primary} />}
    />
  );
  
  const renderGroupHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.groupInfo}>
        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}>{group.name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.memberCount}>
            {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
          </Text>
        </View>
      </View>
      
      <View style={styles.membersPreview}>
        <Text style={styles.membersTitle}>Members</Text>
        {groupMembers.map(member => (
          <View key={member.id} style={styles.memberRow}>
            <View style={styles.memberInfo}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitial}>{member.name.charAt(0)}</Text>
              </View>
              <Text style={styles.memberName}>
                {member.id === currentUser.id ? 'You' : member.name}
              </Text>
            </View>
            <ArrowRight size={16} color={Colors.gray} />
          </View>
        ))}
      </View>
      
      {sortedExpenses.length > 0 && (
        <Text style={styles.sectionTitle}>Expenses</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title={group.name} 
        showBackButton
        showAddButton
        onAddPress={handleAddExpense}
        rightComponent={
          <TouchableOpacity 
            onPress={() => setShowOptions(!showOptions)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Settings size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />
      
      {showOptions && (
        <View style={styles.optionsMenu}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleAddMember}
          >
            <UserPlus size={20} color={Colors.text} />
            <Text style={styles.optionText}>Add Member</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleGroupSettings}
          >
            <Settings size={20} color={Colors.text} />
            <Text style={styles.optionText}>Group Settings</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={sortedExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderGroupHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={sortedExpenses.length === 0 ? styles.emptyList : styles.list}
      />
      
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleAddExpense}
          activeOpacity={0.8}
        >
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    padding: 16,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.white,
  },
  groupName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 4,
  },
  memberCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.subtext,
  },
  membersPreview: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  membersTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
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
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyList: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  optionsMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
});