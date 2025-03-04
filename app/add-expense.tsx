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
import { format } from 'date-fns';
import Colors from '@/constants/Colors';
import useStore from '@/store/useStore';
import Header from '@/components/Header';
import Button from '@/components/Button';
import CategoryIcon from '@/components/CategoryIcon';
import { Category } from '@/types';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { 
    currentUser, 
    users, 
    groups, 
    addExpense,
    canAddExpenseToday,
    updateSettings
  } = useStore();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<Category>('food');
  const [selectedPayer, setSelectedPayer] = useState(currentUser?.id || '');
  const [splitEqually, setSplitEqually] = useState(true);
  const [customSplits, setCustomSplits] = useState<{userId: string, amount: number}[]>([]);
  const [notes, setNotes] = useState('');
  
  if (!currentUser) return null;
  
  const selectedGroupData = groups.find(g => g.id === selectedGroup);
  const groupMembers = selectedGroupData 
    ? users.filter(user => selectedGroupData.members.includes(user.id))
    : [];
  
  const categories: Category[] = [
    'food', 
    'transportation', 
    'entertainment', 
    'shopping', 
    'utilities', 
    'rent', 
    'other'
  ];
  
  const handleAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const filtered = text.replace(/[^0-9.]/g, '');
    setAmount(filtered);
    
    // Update custom splits if split equally is enabled
    if (splitEqually && selectedGroupData) {
      const numMembers = selectedGroupData.members.length;
      const amountPerPerson = parseFloat(filtered) / numMembers;
      
      const newSplits = selectedGroupData.members.map(memberId => ({
        userId: memberId,
        amount: amountPerPerson,
      }));
      
      setCustomSplits(newSplits);
    }
  };
  
  const handleSplitTypeChange = (equally: boolean) => {
    setSplitEqually(equally);
    
    if (equally && selectedGroupData) {
      const numMembers = selectedGroupData.members.length;
      const amountPerPerson = parseFloat(amount) / numMembers || 0;
      
      const newSplits = selectedGroupData.members.map(memberId => ({
        userId: memberId,
        amount: amountPerPerson,
      }));
      
      setCustomSplits(newSplits);
    }
  };
  
  const handleCustomSplitChange = (userId: string, value: string) => {
    const newAmount = parseFloat(value) || 0;
    
    setCustomSplits(prev => 
      prev.map(split => 
        split.userId === userId 
          ? { ...split, amount: newAmount } 
          : split
      )
    );
  };
  
  const handleSaveExpense = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the expense');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (!selectedGroup) {
      Alert.alert('Error', 'Please select a group');
      return;
    }
    
    if (!selectedPayer) {
      Alert.alert('Error', 'Please select who paid');
      return;
    }
    
    if (!canAddExpenseToday()) {
      Alert.alert(
        'Daily Limit Reached',
        'You\'ve reached your limit of 3 expenses per day. Upgrade to premium for unlimited expenses or wait until tomorrow.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Upgrade to Premium', 
            onPress: () => {
              updateSettings({ isPremium: true });
              Alert.alert(
                'Premium Activated',
                'You now have access to unlimited expenses and advanced reports!'
              );
            } 
          }
        ]
      );
      return;
    }
    
    // Validate that custom splits add up to the total amount
    if (!splitEqually) {
      const totalSplits = customSplits.reduce((sum, split) => sum + split.amount, 0);
      if (Math.abs(totalSplits - parseFloat(amount)) > 0.01) {
        Alert.alert('Error', 'The sum of all splits must equal the total amount');
        return;
      }
    }
    
    const newExpense = {
      id: Date.now().toString(),
      groupId: selectedGroup,
      title,
      amount: parseFloat(amount),
      paidBy: selectedPayer,
      date: new Date().toISOString(),
      category: selectedCategory,
      participants: customSplits,
      notes: notes.trim() || undefined,
    };
    
    const success = addExpense(newExpense);
    
    if (success) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Add Expense" 
        showBackButton
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="What was this expense for?"
            placeholderTextColor={Colors.gray}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            placeholderTextColor={Colors.gray}
            keyboardType="decimal-pad"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Group</Text>
          <View style={styles.optionsContainer}>
            {groups.map(group => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.optionButton,
                  selectedGroup === group.id && styles.selectedOption,
                ]}
                onPress={() => setSelectedGroup(group.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedGroup === group.id && styles.selectedOptionText,
                  ]}
                >
                  {group.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <CategoryIcon category={category} size={32} />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Paid by</Text>
          <View style={styles.optionsContainer}>
            {groupMembers.map(user => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.optionButton,
                  selectedPayer === user.id && styles.selectedOption,
                ]}
                onPress={() => setSelectedPayer(user.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedPayer === user.id && styles.selectedOptionText,
                  ]}
                >
                  {user.id === currentUser.id ? 'You' : user.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Split</Text>
          <View style={styles.splitTypeContainer}>
            <TouchableOpacity
              style={[
                styles.splitTypeButton,
                splitEqually && styles.selectedSplitType,
              ]}
              onPress={() => handleSplitTypeChange(true)}
            >
              <Text
                style={[
                  styles.splitTypeText,
                  splitEqually && styles.selectedSplitTypeText,
                ]}
              >
                Equal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.splitTypeButton,
                !splitEqually && styles.selectedSplitType,
              ]}
              onPress={() => handleSplitTypeChange(false)}
            >
              <Text
                style={[
                  styles.splitTypeText,
                  !splitEqually && styles.selectedSplitTypeText,
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.splitDetailsContainer}>
            {groupMembers.map(user => (
              <View key={user.id} style={styles.splitRow}>
                <Text style={styles.splitName}>
                  {user.id === currentUser.id ? 'You' : user.name}
                </Text>
                {splitEqually ? (
                  <Text style={styles.splitAmount}>
                    ${(parseFloat(amount) / groupMembers.length || 0).toFixed(2)}
                  </Text>
                ) : (
                  <TextInput
                    style={styles.splitInput}
                    value={customSplits.find(s => s.userId === user.id)?.amount.toString() || '0'}
                    onChangeText={(value) => handleCustomSplitChange(user.id, value)}
                    keyboardType="decimal-pad"
                  />
                )}
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional details..."
            placeholderTextColor={Colors.gray}
            multiline
          />
        </View>
        
        <Button
          title="Save Expense"
          onPress={handleSaveExpense}
          style={styles.saveButton}
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
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
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
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.white,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 16,
    opacity: 0.7,
  },
  selectedCategoryButton: {
    opacity: 1,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.text,
    marginTop: 4,
  },
  selectedCategoryText: {
    color: Colors.primary,
  },
  splitTypeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    marginBottom: 16,
  },
  splitTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedSplitType: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  splitTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.subtext,
  },
  selectedSplitTypeText: {
    color: Colors.text,
  },
  splitDetailsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  splitName: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  splitAmount: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  splitInput: {
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 80,
    textAlign: 'right',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});