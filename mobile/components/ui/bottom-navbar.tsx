import { navItems } from '@/constants/nav-items';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { MessageCircle, MessageSquare } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const getIcon = (iconName: string, isActive: boolean) => {
    const iconColor = isActive ? Colors.light.primary : Colors.light.navbarInactive;
    const iconSize = 24;
    
    switch (iconName) {
      case 'message-circle':
        return <MessageCircle size={iconSize} color={iconColor} />;
      case 'message-square':
        return <MessageSquare size={iconSize} color={iconColor} />;
      case 'navigation':
        return (
          <Image
            source={
              isActive
                ? require('../../assets/images/blue_logo.svg')
                : require('../../assets/images/logo.svg')
            }
            style={{ width: 24, height: 24 }}
            contentFit="contain"
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItemWrapper}
            onPress={() => onTabChange(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.navItem, isActive && styles.activeNavItem]}>
              {getIcon(item.icon, isActive)}
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    backgroundColor: Colors.light.navbarBackground,
    borderRadius: 50,
    paddingVertical: 3,
    paddingHorizontal: 3,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  navItemWrapper: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    gap: 6,
  },
  activeNavItem: {
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 13,
    color: '#b1b4b7',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#000000',
    fontWeight: '600',
  },
});

export default BottomNavBar;