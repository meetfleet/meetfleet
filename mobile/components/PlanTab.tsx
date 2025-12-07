import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '../constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const PLAN_DATA = {
    title: 'Afterwork Drinks',
    status: 'Active Now',
    organizer: {
        name: 'Imad',
        avatar: 'https://i.pravatar.cc/150?u=imad',
    },
    location: {
        name: 'Zing Rabat',
        distance: '1 km away',
    },
    time: {
        text: '20:00 Today',
        relative: '4 hours from now',
    },
    details: [
        { label: 'Duration', value: 'Ideally 1-2 hours' },
        { label: 'Cost', value: 'On Him' },
        { label: 'Smoker', value: 'No' },
        { label: 'Job', value: 'Sales Manager' },
    ],
    interests: [
        { icon: 'color-palette-outline' as IconName, label: 'Art' },
        { icon: 'bicycle-outline' as IconName, label: 'Sports' },
        { icon: 'musical-notes-outline' as IconName, label: 'Music' },
        { icon: 'star-outline' as IconName, label: 'Pop Culture' },
    ],
    message: [
        "Hey nearkers! I'm always thirsty after work and looking for some company.",
        "You're all welcome to join!"
    ],
};

export default function PlanTab() {
    return (
        <>
            <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{PLAN_DATA.title}</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>{PLAN_DATA.status}</Text>
                    </View>
                </View>
                <View style={styles.organizerContainer}>
                    <Text style={styles.organizerLabel}>Organizer</Text>
                    <View style={styles.organizerRow}>
                        <Image
                            source={{ uri: PLAN_DATA.organizer.avatar }}
                            style={styles.avatar}
                            contentFit="cover"
                        />
                        <Text style={styles.organizerName}>{PLAN_DATA.organizer.name}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="location-outline" size={24} color="black" />
                    </View>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>{PLAN_DATA.location.name}</Text>
                        <Text style={styles.cardSubtitle}>{PLAN_DATA.location.distance}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.blackButton}>
                    <Text style={styles.blackButtonText}>Open in Map</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.cardLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="time-outline" size={24} color="black" />
                    </View>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>{PLAN_DATA.time.text}</Text>
                        <Text style={styles.cardSubtitle}>{PLAN_DATA.time.relative}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.blackButton}>
                    <Text style={styles.blackButtonText}>Add Reminder</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Plan's Details</Text>
                {PLAN_DATA.details.map((detail, index) => (
                    <View key={index} style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{detail.label}</Text>
                        <Text style={styles.detailValue}>{detail.value}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.interestsContainer}
                >
                    {PLAN_DATA.interests.map((interest, index) => (
                        <View key={index} style={styles.chip}>
                            <Ionicons name={interest.icon} size={16} color="black" style={styles.chipIcon} />
                            <Text style={styles.chipText}>{interest.label}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{PLAN_DATA.organizer.name}'s want to say</Text>
                {PLAN_DATA.message.map((text, index) => (
                    <Text key={index} style={styles.descriptionText}>{text}</Text>
                ))}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        marginBottom: 5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 4,
        backgroundColor: '#61D9A5',
        marginRight: 6,
    },
    statusText: {
        color: '#61D9A5',
        fontFamily: Fonts.regular,
        fontSize: 12,
    },
    organizerContainer: {
        alignItems: 'flex-end',
    },
    organizerLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
        fontFamily: Fonts.bold,
    },
    organizerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 22,
        height: 22,
        borderRadius: 12,
        marginRight: 6,
        backgroundColor: '#ddd',
    },
    organizerName: {
        fontFamily: Fonts.light,
        fontSize: 13,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 30,
        paddingLeft: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardLeft: {
        flexDirection: 'column',
        alignItems: "flex-start",
        gap: 6,
        flex: 1,
    },
    iconContainer: {
        marginRight: 12,
    },
    cardTextContainer: {
        gap: 6,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontFamily: Fonts.light,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#3337FF',
        fontFamily: Fonts.light,
    },
    blackButton: {
        marginTop: 40,
        fontFamily: Fonts.light,
        backgroundColor: 'black',
        paddingVertical: 15,
        paddingHorizontal: 22,
        borderRadius: 20,
    },
    blackButtonText: {
        color: 'white',
        fontSize: 12,
        fontFamily: Fonts.bold,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        fontFamily: Fonts.regular,
    },
    detailValue: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: '#000',
    },
    interestsContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingRight: 20,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    chipIcon: {
        marginRight: 4,
    },
    chipText: {
        fontSize: 14,
        fontFamily: Fonts.bold,
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
        fontFamily: Fonts.regular,
    },
});
