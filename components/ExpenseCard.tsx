import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Expense, User } from '@/types';
import CategoryIcon from './CategoryIcon';

interface ExpenseCardProps {
  expense: Expense;
  users: User[];
  currentUserId: string;
  onPress: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  users, 
  currentUserId,
  onPress 
}) => {
  const paidByUser = users.find(user => user.id === expense.paidBy);
  const isPaidByCurrentUser = expense.paidBy === currentUserId;
  
  // Calculate what the current user owes or is owed
  const currentUserParticipant = expense.participants.find(p => p.userId === currentUserId);
  const currentUserAmount = currentUserParticipant?.amount || 0;
  
  let balanceText = '';
  let balanceColor = Colors.text;
  
  if (isPaidByCurrentUser) {
    const othersOwe = expense.amount - currentUserAmount;
    if (othersOwe > 0) {
      balanceText = `You are owed $${othersOwe.toFixed(2)}`;
      balanceColor = Colors.success;
    }
  } else if (currentUserAmount > 0) {
    balanceText = `You owe $${currentUserAmount.toFixed(2)}`;
    balanceColor = Colors.error;
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <CategoryIcon category={expense.category} size={40} />
      </View>
      
      <View style={styles.middleSection}>
        <Text style={styles.title} numberOfLines={1}>{expense.title}</Text>
        <Text style={styles.date}>
          {format(new Date(expense.date), 'MMM d, yyyy')}
        </Text>
        <Text style={styles.paidBy}>
          {isPaidByCurrentUser ? 'You paid' : `${paidByUser?.name} paid`} ${expense.amount.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[styles.balance, { color: balanceColor }]}>
          {balanceText}
        </Text>
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
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  paidBy: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.subtext,
  },
  balance: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default ExpenseCard;