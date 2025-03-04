import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import Colors from '@/constants/Colors';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonTitle,
  onButtonPress,
  icon,
}) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
});

export default EmptyState;