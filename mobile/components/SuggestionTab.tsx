import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '../constants/theme';

const SUGGESTION_DATA = {
    title: 'Something in mind ?',
    subtitle: {
        prefix: 'Instead of ',
        place: 'Zing Rabat',
        suffix: ', Imad would love to hear you out !',
    },
    defaultTime: '20 : 00',
};

export default function SuggestionTab() {
    return (
        <View style={styles.suggestionContainer}>
            <Text style={styles.suggestionTitle}>{SUGGESTION_DATA.title}</Text>
            <Text style={styles.suggestionSubtitle}>
                {SUGGESTION_DATA.subtitle.prefix}
                <Text style={styles.suggestionLink}>{SUGGESTION_DATA.subtitle.place}</Text>
                {SUGGESTION_DATA.subtitle.suffix}
            </Text>

            <View style={styles.inputGroup}>
                <View style={styles.inputRow}>
                    <Ionicons name="search-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search another place..."
                        placeholderTextColor="#999"
                    />
                </View>
                <View style={styles.divider} />
                <View style={styles.inputRow}>
                    <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
                    <Text style={styles.inputText}>{SUGGESTION_DATA.defaultTime}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    suggestionContainer: {
        marginTop: 10,
        elevation: 10,

    },
    suggestionTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        marginBottom: 8,
        color: '#000',
    },
    suggestionSubtitle: {
        fontSize: 16,
        color: '#444',
        marginBottom: 24,
        lineHeight: 22,
        fontFamily: Fonts.regular,
    },
    suggestionLink: {
        color: '#4a6cf7',
        fontFamily: Fonts.bold,
    },
    inputGroup: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#eee',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        fontFamily: Fonts.regular,
    },
    inputText: {
        fontSize: 16,
        color: '#000',
        fontFamily: Fonts.bold,
    },
    divider: {
        height: 2,
        backgroundColor: '#eee',
        //marginLeft: 48,
    },
});
