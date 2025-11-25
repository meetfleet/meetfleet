import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mapIcon = require('@/assets/map.png');
const clockIcon = require('@/assets/clock.png');

const EventCard = ({ event }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{event.icon}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.hostInfo}>
            <Text style={styles.hostAvatar}>{event.host.avatar}</Text>
            <Text style={styles.hostName}>{`${event.host.name}, ${event.host.age}`}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <View style={styles.iconBox}>
            <Image source={mapIcon} style={styles.detailIcon} />
          </View>

          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>Where</Text>
            <Text style={styles.detailValue}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.iconBox}>
            <Image source={clockIcon} style={styles.detailIcon} />
          </View>

          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>When</Text>
            <Text style={styles.detailValue}>{event.when}</Text>
          </View>
        </View>
      </View>


      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>"{event.description}"</Text>
      </View>

      <View style={styles.distanceContainer}>
        <View style={styles.distanceDot} />
        <Text style={styles.distanceText}>{event.distance}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    borderWidth: 0.8,
    borderColor: '#E5E5E5',
  },
  icon: {
    fontSize: 30,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  hostAvatar: {
    fontSize: 18,
    marginRight: 6,
  },
  hostName: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  detailText: {
    marginLeft: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  descriptionText: {
    color: '#555',
    fontStyle: 'italic',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  distanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  distanceText: {
    color: '#666',
  },
  iconBox: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: '#E5E5E5',
  },
  detailIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});


export default EventCard;
