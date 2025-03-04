import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { 
  Trash2, 
  Edit, 
  ArrowRight 
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import useStore from '@/store/useStore';
import Header from '@/components/Header';
import CategoryIcon from '@/components/CategoryIcon';
import Button from '@/components/Button';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    currentUser, 
    users, 
    groups, 
    expenses, 
    deleteExpense 
  } = useStore();
  
  if (!id || !currentUser) return null;
  
  const expense = expenses.find(e => e.id === id);
  if (!expense) {
    router.back();
    return null;
  }
  
  const group = groups.find(g => g.id === expense.groupId);
  const paidByUser = users.find(u => u.id === expense.paidBy);
  const isPaidByCurrentUser = expense.paidBy === currentUser.id;
  
  const handleEditExpense = () => {
    // Navigate to edit expense screen
    router.push(`/edit-expense/${id}`);
  };
  
  const handleDeleteExpense = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteExpense(id);
            router.back();
          }
        }
      ]
    );
  };
  
  const handleSettleUp = () => {
    Alert.alert(
      'Settle Up',
      'Mark this expense as settled?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settle Up', onPress: () => {} }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Expense Details" 
        showBackButton
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.expenseHeader}>
          <View style={styles.categoryIconContainer}>
            <CategoryIcon category={expense.category} size={60} />
          </View>
          
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseTitle}>{expense.title}</Text>
            <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
            <Text style={styles.expenseDate}>
              {format(new Date(expense.date), 'MMMM d, yyyy')}
            </Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Group</Text>
          <View style={styles.groupRow}>
            <View style={styles.groupAvatar}>
              <Text style={styles.groupAvatarText}>{group?.name.charAt(0)}</Text>
            </View>
            <Text style={styles.groupName}>{group?.name}</Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Paid By</Text>
          <View style={styles.paidByRow}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{paidByUser?.name.charAt(0)}</Text>
            </View>
            <View style={styles.paidByInfo}>
              <Text style={styles.paidByName}>
                {isPaidByCurrentUser ? 'You' : paidByUser?.name}
              </Text>
              <Text style={styles.paidByAmount}>${expense.amount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Split Details</Text>
          {expense.participants.map((participant) => {
            const user = users.find(u => u.id === participant.userId);
            const isCurrentUser = participant.userId === currentUser.id;
            
            return (
              <View key={participant.userId} style={styles.splitRow}>
                <View style={styles.splitUserInfo}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>{user?.name.charAt(0)}</Text>
                  </View>
                  <Text style={styles.splitUserName}>
                    {isCurrentUser ? 'You' : user?.name}
                  </Text>
                </View>
                <Text style={styles.splitAmount}>
                  ${participant.amount.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
        
        {expense.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes</Text>
            <Text style={styles.notesText}>{expense.notes}</Text>
          </View>
        )}
        
        <View style={styles.actionsContainer}>
          {isPaidByCurrentUser && (
            <Button
              title="Edit Expense"
              onPress={handleEditExpense}
              variant="outline"
              style={styles.actionButton}
              leftIcon={<Edit size={16} color={Colors.primary} />}
            />
          )}
          
          <Button
            title="Delete Expense"
            onPress={handleDeleteExpense}
            variant="outline"
            style={[styles.actionButton, styles.deleteButton]}
            textStyle={styles.deleteButtonText}
            leftIcon={<Trash2 size={16} color={Colors.error} />}
          />
        </View>
        
        {!isPaidByCurrentUser && (
          <Button
            title="Settle Up"
            onPress={handleSettleUp}
            style={styles.settleButton}
          />
        )}
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
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryIconContainer: {
    marginRight: 16,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  expenseAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 4,
  },
  expenseDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.subtext,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
  },
  groupName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  paidByRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
  },
  paidByInfo: {
    flex: 1,
  },
  paidByName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  paidByAmount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.subtext,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  splitUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitUserName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  splitAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  notesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    borderColor: Colors.error,
  },
  deleteButtonText: {
    color: Colors.error,
  },
  settleButton: {
    marginBottom: 32,
  },
});