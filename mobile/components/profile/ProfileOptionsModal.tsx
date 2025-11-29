import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Flag, MessageCircle, ShieldBan } from 'lucide-react-native';
import React from 'react';
import { Modal, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { ThemedText } from '../themed-text';

interface ProfileOptionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileOptionsModal({ visible, onClose }: ProfileOptionsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const options = [
    { label: 'Report', icon: Flag, action: () => console.log('Report') },
    { label: 'Block', icon: ShieldBan, action: () => console.log('Block') },
    { label: 'Send a Message', icon: MessageCircle, action: () => console.log('Message') },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]} />
          
          <TouchableWithoutFeedback>
            <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
              {options.map((option, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    option.action();
                  }}
                  style={({ pressed }) => [
                    styles.optionItem,
                    pressed && { backgroundColor: colors.text }
                  ]}
                >
                  <option.icon size={20} color={colors.text} style={styles.icon} />
                  <ThemedText style={styles.optionText}>{option.label}</ThemedText>
                </Pressable>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
