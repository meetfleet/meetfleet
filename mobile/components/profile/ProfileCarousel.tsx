import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

const PrimeButtonSvg = () => (
  <Svg width="115" height="32" viewBox="0 0 115 32" fill="none">
    <Rect x="0.5" y="0.5" width="114" height="31" rx="15.5" stroke="url(#paint0_linear_255_1284)"/>
    <Path d="M15.0089 21H13.8189V11.2H14.9389L20.2029 18.76V11.2H21.3929V21H20.2729L15.0089 13.44V21ZM26.4156 21.084C24.2736 21.084 22.8736 19.614 22.8736 17.43C22.8736 15.26 24.2456 13.776 26.2616 13.776C28.2776 13.776 29.5936 15.05 29.6496 17.164C29.6496 17.318 29.6356 17.486 29.6216 17.654H24.0776V17.752C24.1196 19.11 24.9736 20.062 26.3316 20.062C27.3396 20.062 28.1236 19.53 28.3616 18.606H29.5236C29.2436 20.034 28.0676 21.084 26.4156 21.084ZM24.1476 16.702H28.4176C28.3056 15.47 27.4656 14.784 26.2756 14.784C25.2256 14.784 24.2596 15.54 24.1476 16.702ZM37.2735 19.95H37.6375V21H37.0075C36.0555 21 35.7335 20.594 35.7195 19.894C35.2715 20.538 34.5575 21.084 33.3255 21.084C31.7575 21.084 30.6935 20.3 30.6935 18.998C30.6935 17.57 31.6875 16.772 33.5635 16.772H35.6635V16.282C35.6635 15.358 35.0055 14.798 33.8855 14.798C32.8775 14.798 32.2055 15.274 32.0655 16.002H30.9175C31.0855 14.602 32.2195 13.776 33.9415 13.776C35.7615 13.776 36.8115 14.686 36.8115 16.352V19.474C36.8115 19.852 36.9515 19.95 37.2735 19.95ZM35.6635 18.088V17.738H33.4515C32.4295 17.738 31.8555 18.116 31.8555 18.928C31.8555 19.628 32.4575 20.104 33.4095 20.104C34.8375 20.104 35.6635 19.278 35.6635 18.088ZM41.8241 13.86H42.1461V14.98H41.5721C40.0741 14.98 39.6681 16.226 39.6681 17.36V21H38.5201V13.86H39.5141L39.6681 14.938C40.0041 14.392 40.5501 13.86 41.8241 13.86ZM43.1412 21V11.2H44.2892V17.654L47.8732 13.86H49.2872L46.5012 16.814L49.4832 21H48.0972L45.7312 17.64L44.2892 19.124V21H43.1412ZM54.1236 21V11.2H57.8896C59.8496 11.2 61.1376 12.376 61.1376 14.21C61.1376 16.044 59.8496 17.234 57.8896 17.234H55.3416V21H54.1236ZM57.7916 12.32H55.3416V16.114H57.7776C59.0656 16.114 59.8916 15.372 59.8916 14.21C59.8916 13.048 59.0796 12.32 57.7916 12.32ZM65.5721 13.86H65.8941V14.98H65.3201C63.8221 14.98 63.4161 16.226 63.4161 17.36V21H62.2681V13.86H63.2621L63.4161 14.938C63.7521 14.392 64.2981 13.86 65.5721 13.86ZM67.4772 12.656C67.0572 12.656 66.7352 12.348 66.7352 11.914C66.7352 11.48 67.0572 11.172 67.4772 11.172C67.8972 11.172 68.2192 11.48 68.2192 11.914C68.2192 12.348 67.8972 12.656 67.4772 12.656ZM66.8892 21V13.86H68.0372V21H66.8892ZM77.5759 13.776C79.0599 13.776 80.2779 14.63 80.2779 16.884V21H79.1299V16.954C79.1299 15.554 78.5139 14.826 77.4359 14.826C76.2459 14.826 75.5179 15.722 75.5179 17.178V21H74.3699V16.954C74.3699 15.554 73.7399 14.826 72.6479 14.826C71.4719 14.826 70.7579 15.806 70.7579 17.234V21H69.6099V13.86H70.6039L70.7579 14.84C71.1359 14.322 71.7379 13.776 72.8439 13.776C73.8379 13.776 74.6919 14.224 75.0979 15.134C75.5319 14.364 76.3019 13.776 77.5759 13.776ZM84.9585 21.084C82.8165 21.084 81.4165 19.614 81.4165 17.43C81.4165 15.26 82.7885 13.776 84.8045 13.776C86.8205 13.776 88.1365 15.05 88.1925 17.164C88.1925 17.318 88.1785 17.486 88.1645 17.654H82.6205V17.752C82.6625 19.11 83.5165 20.062 84.8745 20.062C85.8825 20.062 86.6665 19.53 86.9045 18.606H88.0665C87.7865 20.034 86.6105 21.084 84.9585 21.084ZM82.6905 16.702H86.9605C86.8485 15.47 86.0085 14.784 84.8185 14.784C83.7685 14.784 82.8025 15.54 82.6905 16.702ZM95.5186 16.506V14.056H96.5686V16.506H98.9066V17.472H96.5686V19.936H95.5186V17.472H93.1946V16.506H95.5186Z" fill="url(#paint1_linear_255_1284)"/>
    <Defs>
      <LinearGradient id="paint0_linear_255_1284" x1="92.3751" y1="-1.59355e-06" x2="85.4533" y2="38.5756" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#CF69C1"/>
        <Stop offset="0.163487" stopColor="#0CF5FF"/>
        <Stop offset="0.53849" stopColor="#EB926C"/>
        <Stop offset="1" stopColor="#D25FEE"/>
      </LinearGradient>
      <LinearGradient id="paint1_linear_255_1284" x1="82.7507" y1="8" x2="80.4224" y2="27.6327" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#CF69C1"/>
        <Stop offset="0.163487" stopColor="#0CF5FF"/>
        <Stop offset="0.53849" stopColor="#EB926C"/>
        <Stop offset="1" stopColor="#D25FEE"/>
      </LinearGradient>
    </Defs>
  </Svg>
);

export function ProfileCarousel() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + 10}
    >
      {/* First Card - Profile Main */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Image 
              source={require('@/assets/images/img.png')} 
              style={styles.profileImage} 
            />
            {/* Gem Image - Absolute positioned */}
            <View style={styles.gemContainer}>
               <Image 
                source={require('@/assets/premium/premium.png')} 
                style={styles.gemImage} 
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <ThemedText type="title" style={styles.name}>Lamiae, 24</ThemedText>
              <ThemedText style={styles.beerIcon}>🍺</ThemedText>
            </View>
            <ThemedText style={[styles.bio, { color: colors.icon }]}>
              Just hanging out in Rabat. Looking for coffe or tech meetups.
            </ThemedText>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.footerRow}>
            <View style={styles.activePlans}>
              <View style={[styles.dot, { backgroundColor: colors.success }]} />
              <ThemedText style={[styles.activePlansText, { color: colors.text }]}>2 active plans</ThemedText>
            </View>
            
            <TouchableOpacity>
              <PrimeButtonSvg />
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
      <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
         <View style={styles.cardContent}>
            <ThemedText>More profiles coming soon...</ThemedText>
         </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardContent: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 30, // Squircle-ish
  },
  gemContainer: {
    position: 'absolute',
    top: -30,
    right: -60, // Push it off screen to show half
    width: 150,
    height: 150,
    zIndex: 1,
  },
  gemImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  beerIcon: {
    fontSize: 24,
  },
  bio: {
    fontSize: 16,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activePlans: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activePlansText: {
    fontSize: 14,
    fontWeight: '500',
  },

});
