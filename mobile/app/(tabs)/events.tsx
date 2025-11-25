import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import EventCard from '@/components/EventCard';
import { eventsData } from '@/constants/events-data';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={eventsData}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    flex: 1,
  },
  list: {
    paddingTop: 10,
    paddingBottom: 100,
  },
});

export default EventsScreen;
