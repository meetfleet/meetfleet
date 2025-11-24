import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList } from 'react-native';
import EventCard from '@/components/EventCard';

const eventsData = [
  {
    id: '1',
    icon: '🎮',
    title: 'FIFA Night',
    host: { name: 'Amine', age: 26, avatar: '🙋‍♂️' },
    location: 'Game Center',
    when: '9:30 Tomorrow',
    description: 'Looking for chill person to join us on a FIFA 26, and be ready to lose haha...',
    distance: '1km away',
  },
  {
    id: '2',
    icon: '🍺',
    title: 'Afterwork drinks',
    host: { name: 'Imad', age: 32, avatar: '🤷‍♂️' },
    location: 'Zing Rabat',
    when: '20:00 Today',
    description: 'Hey nearkers! I\'m always thirsty after work and looking for some company. You\'re all welco...',
    distance: '4km away',
  },
  {
    id: '3',
    icon: '👫',
    title: 'Beach Walk',
    host: { name: 'Amina', age: 23, avatar: '🙋‍♀️' },
    location: 'Beachside Promenade',
    when: '18:00 Today',
    description: 'Hey nearkers! i\'m looking for a person. You\'re all...',
    distance: '6km away',
  },
];

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
  fab: {
    position: 'absolute',
    bottom: 100, 
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0052FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0052FF',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { height: 3, width: 0 },
    elevation: 6,
    zIndex: 10,
  },
});

export default EventsScreen;
