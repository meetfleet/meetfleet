import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageCircle, MessageSquare, Navigation } from 'lucide-react-native';

interface NavItem {
  id: string;
  label: string;
  icon: 'message-circle' | 'message-square' | 'navigation';
}

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const navItems: NavItem[] = [
    { id: 'plans', label: 'Plans', icon: 'message-square' },
    { id: 'navigation', label: 'Navigation', icon: 'navigation' },
    { id: 'messages', label: 'Messages', icon: 'message-circle' },
  ];
  
  const getIcon = (iconName: string, isActive: boolean) => {
    const iconColor = isActive ? '#0033FF' : '#b1b4b7';
    const iconSize = 24;
    
    switch (iconName) {
      case 'message-circle':
        return <MessageCircle size={iconSize} color={iconColor} />;
      case 'message-square':
        return <MessageSquare size={iconSize} color={iconColor} />;
      case 'navigation':
        return <Navigation size={iconSize} color={iconColor} />;
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
    backgroundColor: '#F4F7FB',
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