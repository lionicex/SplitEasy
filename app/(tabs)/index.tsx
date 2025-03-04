import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Receipt, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import useStore from '@/store/useStore';
import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import ExpenseCard from '@/components/ExpenseCard';
import PremiumBanner from '@/components/PremiumBanner';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';

export default function HomeScreen() {
  const router = useRouter();
  const { 
    currentUser, 
    users, 
    expenses, 
    settings,
    getUserBalance,
    canAddExpenseToday,
    updateSettings,
    setCurrentUser
  } = useStore();
  
  const [showPremiumBanner, setShowPremiumBanner] = useState(!settings.isPremium);
  
  // Set current user if not set
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser(users[0]);
    }
  }, [currentUser, users, setCurrentUser]);
  
  if (!currentUser) return null;
  
  const userBalance = getUserBalance(currentUser.id);
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleAddExpense = () => {
    if (!canAddExpenseToday()) {
      Alert.alert(
        'Daily Limit Reached',
        'You\'ve reached your limit of 3 expenses per day. Upgrade to premium for unlimited expenses or wait until tomorrow.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Upgrade to Premium', 
            onPress: () => handleUpgradeToPremium() 
          }
        ]
      );
      return;
    }
    
    // Navigate to add expense screen
    router.push('/add-expense');
  };
  
  const handleUpgradeToPremium = () => {
    // In a real app, this would handle payment processing
    // For this demo, we'll just set the user as premium
    updateSettings({ isPremium: true });
    setShowPremiumBanner(false);
    Alert.alert(
      'Premium Activated',
      'You now have access to unlimited expenses and advanced reports!',
      [{ text: 'Great!', style: 'default' }]
    );
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
      description="Start by adding your first expense to track and split costs with friends."
      buttonTitle="Add Expense"
      onButtonPress={handleAddExpense}
      icon={<Receipt size={64} color={Colors.primary} />}
    />
  );

  return (
    <View style={styles.container}>
      <Header 
        title="SplitEase" 
        showAddButton 
        onAddPress={handleAddExpense}
      />
      
      <FlatList
        data={sortedExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>
                Welcome, {currentUser.name}
              </Text>
              
              <BalanceCard balance={userBalance} />
              
              {showPremiumBanner && (
                <PremiumBanner onUpgrade={handleUpgradeToPremium} />
              )}
              
              {!settings.isPremium && (
                <View style={styles.limitContainer}>
                  <AlertCircle size={16} color={Colors.warning} style={styles.limitIcon} />
                  <Text style={styles.limitText}>
                    {`You have ${3 - settings.dailyExpenseCount} expense${3 - settings.dailyExpenseCount !== 1 ? 's' : ''} left today`}
                  </Text>
                </View>
              )}
              
              {sortedExpenses.length > 0 && (
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
              )}
            </View>
          </>
        }
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
  welcomeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  limitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  limitIcon: {
    marginRight: 8,
  },
  limitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.warning,
  },
  list: {
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
});