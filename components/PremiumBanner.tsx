import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface PremiumBannerProps {
  onUpgrade: () => void;
}

const PremiumBanner: React.FC<PremiumBannerProps> = ({ onUpgrade }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Sparkles size={24} color={Colors.white} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Upgrade to Premium</Text>
        <Text style={styles.description}>
          Add unlimited expenses per day and unlock advanced reports
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={onUpgrade}
      >
        <Text style={styles.buttonText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.subtext,
  },
  button: {
    backgroundColor: '#7C4DFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
});

export default PremiumBanner;