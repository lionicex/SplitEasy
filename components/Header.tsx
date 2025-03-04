import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showAddButton?: boolean;
  onAddPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showAddButton = false,
  onAddPress,
  rightComponent,
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      
      <View style={styles.rightContainer}>
        {showAddButton && (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={onAddPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Plus size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
  },
  addButton: {
    padding: 4,
  },
});

export default Header;