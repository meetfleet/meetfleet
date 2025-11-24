import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { BackButton } from '../../components/BackButton';

const backArrowIcon = require('@/assets/back_arrow.png');
const fingersCrossedImage = require('@/assets/fingers_crossed.png');
const avatarImage = require('@/assets/avatar.png');

const RequestScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
       <BackButton />


        <View style={styles.content}>
          <Image
            source={fingersCrossedImage}
            style={styles.mainImage}
          />
          <Text style={styles.title}>Request Sent To Imad</Text>
          <Text style={styles.subtitle}>
            If your requested got accepted, you'll be notified immediately
          </Text>

          <View style={styles.replyTimeContainer}>
            <Image
              source={avatarImage}
            />
            <Text style={styles.replyTimeText}>
              Imad's Usual reply time: 13 mins
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Navigation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, styles.activityButton]}>
            <Text style={[styles.navButtonText, styles.activityButtonText]}>
              Your Activity
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  mainImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8A8E',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  replyTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: '#E5E5E5',
    borderWidth: 0.9,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  replyTimeText: {
    fontSize: 14,
    color: '#333333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 30,
  },
  navButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  activityButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  activityButtonText: {
    color: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: '#E5E5E5',
  },
  backIcon: {
    width: 9,
    height: 9,
    resizeMode: 'contain',
    marginRight: 6,
  },
  backButtonText: {
    fontSize: 15,
    color: '#000',
  },
});

export default RequestScreen;