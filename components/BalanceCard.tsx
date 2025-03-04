import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const isPositive = balance >= 0;
  const balanceText = isPositive 
    ? `You are owed $${balance.toFixed(2)}` 
    : `You owe $${Math.abs(balance).toFixed(2)}`;
  
  const balanceColor = isPositive ? Colors.success : Colors.error;
  const backgroundColor = isPositive ? '#E8F5E9' : '#FFEBEE';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.label}>TOTAL BALANCE</Text>
      <Text style={[styles.balance, { color: balanceColor }]}>
        {balanceText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
  balance: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
});

export default BalanceCard;