import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Utensils, 
  Car, 
  Film, 
  ShoppingBag, 
  Lightbulb, 
  Home, 
  HelpCircle 
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Category } from '@/types';

interface CategoryIconProps {
  category: Category;
  size?: number;
  color?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 24, 
  color = Colors.white 
}) => {
  const getIconAndColor = () => {
    switch (category) {
      case 'food':
        return { 
          icon: <Utensils size={size * 0.5} color={color} />, 
          bgColor: '#FF9800' 
        };
      case 'transportation':
        return { 
          icon: <Car size={size * 0.5} color={color} />, 
          bgColor: '#2196F3' 
        };
      case 'entertainment':
        return { 
          icon: <Film size={size * 0.5} color={color} />, 
          bgColor: '#9C27B0' 
        };
      case 'shopping':
        return { 
          icon: <ShoppingBag size={size * 0.5} color={color} />, 
          bgColor: '#F44336' 
        };
      case 'utilities':
        return { 
          icon: <Lightbulb size={size * 0.5} color={color} />, 
          bgColor: '#4CAF50' 
        };
      case 'rent':
        return { 
          icon: <Home size={size * 0.5} color={color} />, 
          bgColor: '#795548' 
        };
      case 'other':
      default:
        return { 
          icon: <HelpCircle size={size * 0.5} color={color} />, 
          bgColor: '#607D8B' 
        };
    }
  };

  const { icon, bgColor } = getIconAndColor();

  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: bgColor 
      }
    ]}>
      {icon}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryIcon;