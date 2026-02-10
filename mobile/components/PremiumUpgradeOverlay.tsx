import { AuthButton } from '@/components/auth/AuthButton';
import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const JELLYFISH_BG = require('@/assets/premium/theoverlay.png');

interface PremiumUpgradeOverlayProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumUpgradeOverlay: React.FC<PremiumUpgradeOverlayProps> = ({
  visible,
  onClose,
  onUpgrade,
}) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Image
          source={JELLYFISH_BG}
          style={[styles.backgroundImage, { width, height }]}
          resizeMode="cover"
        />

        <SafeAreaView style={styles.safeArea}>
          <View
            style={[
              styles.bottomCtaContainer,
              { paddingBottom: Math.max(insets.bottom + 12, 28) },
            ]}
          >
            <AuthButton
              title="Upgrade for 2.99$/week"
              onPress={onUpgrade}
              style={styles.ctaButton}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  bottomCtaContainer: {
    width: '100%',
  },
  ctaButton: {
    backgroundColor: '#0033FF',
    shadowColor: '#0033FF',
  },
});
