import BottomNavBar from '@/components/ui/bottom-navbar';
import FiltersBackdrop from '@/components/ui/filters-backdrop';
import MapMarker from '@/components/ui/map-marker';
import { MAPBOX_ACCESS_TOKEN } from '@/constants/mapbox-config';
import { markers } from '@/constants/markers-data';
import { Colors } from '@/constants/theme';
import Mapbox from '@rnmapbox/maps';
import { Map, Minus, Plus, Search, Settings2, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const NavigationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('navigation');
  const [zoomLevel, setZoomLevel] = useState(13);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const cameraRef = useRef<Mapbox.Camera>(null);
  
  const centerCoordinate = [-74.0060, 40.7128];

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 1, 20);
    setZoomLevel(newZoom);
    cameraRef.current?.setCamera({
      zoomLevel: newZoom,
      animationDuration: 300,
    });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 1, 0);
    setZoomLevel(newZoom);
    cameraRef.current?.setCamera({
      zoomLevel: newZoom,
      animationDuration: 300,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.mapContainer}>
        <Mapbox.MapView
          style={styles.map}
          styleURL={Mapbox.StyleURL.Street}
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={zoomLevel}
            centerCoordinate={centerCoordinate}
            animationMode="flyTo"
            animationDuration={1000}
          />
          <Mapbox.LocationPuck
            visible={true}
            pulsing={{
              isEnabled: true,
              color: Colors.light.primary,
              radius: 50,
            }}
          />
          {markers.map((marker) => (
            <Mapbox.MarkerView
              key={marker.id}
              id={marker.id}
              coordinate={[marker.longitude, marker.latitude]}
            >
              <MapMarker
                emoji={marker.emoji}
                userEmoji={marker.userEmoji}
                hasProgress={marker.hasProgress}
                progressColor={marker.progressColor}
              />
            </Mapbox.MarkerView>
          ))}
        </Mapbox.MapView>
        <View style={styles.header}>
          {isSearchOpen ? (
            <>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search the vibe you like"
                  placeholderTextColor="#b1b4b7"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  activeOpacity={0.7}
                >
                  <X size={20} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.profileButton}>
                <View style={styles.profileCircle}>
                  <Text style={styles.profileEmoji}>👤</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setIsSearchOpen(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconCircle}>
                    <Search size={20} color={Colors.light.text} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setIsFiltersOpen(true)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.iconCircle,
                    isFiltersOpen && styles.iconCircleActive
                  ]}>
                    <Settings2 
                      size={20} 
                      color={isFiltersOpen ? Colors.light.primary : Colors.light.text} 
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <View style={styles.iconCircle}>
                    <Map size={20} color={Colors.light.text} />
                  </View>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.profileButton}>
                <View style={styles.profileCircle}>
                  <Text style={styles.profileEmoji}>👤</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleZoomIn}>
            <View style={styles.actionCircle}>
              <Plus size={24} color={Colors.light.text} strokeWidth={2} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleZoomOut}>
            <View style={styles.actionCircle}>
              <Minus size={24} color={Colors.light.text} strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.floatingButton}>
          <View style={styles.floatingButtonInner}>
            <Text style={styles.floatingButtonText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <FiltersBackdrop
        visible={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircleActive: {
    backgroundColor: Colors.light.card,
  },
  profileButton: {
    width: 48,
    height: 48,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileEmoji: {
    fontSize: 24,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  closeButton: {
    marginLeft: 12,
    padding: 8,
  },
  rightActions: {
    position: 'absolute',
    right: 20,
    top: 90,
    gap: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonText: {
    fontSize: 32,
    color: Colors.light.card,
    fontWeight: '300',
  },

});

export default NavigationPage;
