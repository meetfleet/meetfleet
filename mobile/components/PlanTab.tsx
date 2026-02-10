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
                <Text style={styles.sectionTitle}>Plan Details</Text>
                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconBox}>
                            <Ionicons name="hourglass-outline" size={20} color="#4F46E5" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Duration</Text>
                            <Text style={styles.detailValue}>1-2 hours</Text>
                        </View>
                    </View>
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconBox}>
                            <Ionicons name="wallet-outline" size={20} color="#10B981" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Cost</Text>
                            <Text style={styles.detailValue}>On Him</Text>
                        </View>
                    </View>
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconBox}>
                            <Ionicons name="briefcase-outline" size={20} color="#F59E0B" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Occupation</Text>
                            <Text style={styles.detailValue}>Sales Mgr</Text>
                        </View>
                    </View>
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconBox}>
                            <Ionicons name="ban-outline" size={20} color="#EF4444" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Smoker</Text>
                            <Text style={styles.detailValue}>No</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>

                <View style={styles.interestsContainer}>
                    {/* Using View with flexWrap for better layout control */}
                    {PLAN_DATA.interests.map((interest, index) => (
                        <View key={index} style={styles.chip}>
                            <Ionicons name={interest.icon} size={14} color="#334155" style={styles.chipIcon} />
                            <Text style={styles.chipText}>{interest.label}</Text>
                        </View>
                    ))}
                </View>
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
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 8,
    },
    detailItem: {
        width: '48%', // Approx 2 columns
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 16,
        gap: 12,
    },
    detailIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    detailLabel: {
        fontSize: 11,
        color: '#64748B',
        fontFamily: Fonts.regular,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 13,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // Light gray background like Profile
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 0, // Removed border
    },
    chipIcon: {
        marginRight: 6,
    },
    chipText: {
        fontSize: 13,
        fontFamily: Fonts.bold,
        color: '#334155',
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#334155',
        lineHeight: 22,
        marginBottom: 8,
        fontFamily: Fonts.regular,
    },
});
