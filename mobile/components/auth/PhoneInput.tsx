import { Fonts } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface Country {
    code: string;
    dialCode: string;
    flag: string;
    name: string;
}

const COUNTRIES: Country[] = [
    { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
    { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: 'MA', dialCode: '+212', flag: '🇲🇦', name: 'Morocco' },
    { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'France' },
    { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Spain' },
    { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
    { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
    { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: 'Mexico' },
    { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
    { code: 'SA', dialCode: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: 'EG', dialCode: '+20', flag: '🇪🇬', name: 'Egypt' },
];

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onCountryChange?: (country: Country) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChangeText, onCountryChange }) => {
    const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[2]); // Default to Morocco
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        onCountryChange?.(selectedCountry);
    }, []);

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setModalVisible(false);
        onCountryChange?.(country);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TouchableOpacity 
                    style={styles.countrySelector}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.flag}>{selectedCountry.flag}</Text>
                    <Text style={styles.chevron}>▼</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>

                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Phone Number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={15}
                />
            </View>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.countryItem,
                                        selectedCountry.code === item.code && styles.countryItemSelected
                                    ]}
                                    onPress={() => handleCountrySelect(item)}
                                >
                                    <Text style={styles.countryFlag}>{item.flag}</Text>
                                    <View style={styles.countryInfo}>
                                        <Text style={styles.countryName}>{item.name}</Text>
                                        <Text style={styles.countryDialCode}>{item.dialCode}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
        height: 56,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
    },
    flag: {
        fontSize: 24,
        marginRight: 6,
    },
    chevron: {
        fontSize: 10,
        color: '#64748B',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#E2E8F0',
        marginRight: 12,
    },
    dialCode: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#0F172A',
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#0F172A',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: 34,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        color: '#0F172A',
    },
    closeButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 24,
        color: '#64748B',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingHorizontal: 20,
    },
    countryItemSelected: {
        backgroundColor: '#F1F5F9',
    },
    countryFlag: {
        fontSize: 28,
        marginRight: 16,
    },
    countryInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    countryName: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#0F172A',
        flex: 1,
    },
    countryDialCode: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: '#64748B',
    },
});
