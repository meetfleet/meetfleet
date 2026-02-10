import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { ScreenHeader } from '../../components/ScreenHeader';

const { width } = Dimensions.get('window');

// --- Mock Card Components ---
const MastercardLogo = () => (
    <Svg width="32" height="20" viewBox="0 0 54 32" fill="none">
        <Circle cx="15.8807" cy="15.8807" r="15.8807" fill="#EB001B" fillOpacity={0.9} />
        <Circle cx="37.8764" cy="15.8807" r="15.8807" fill="#F79E1B" fillOpacity={0.9} />
    </Svg>
);

export default function PaymentMethodsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [cards, setCards] = useState([
        { id: '1', type: 'mastercard', last4: '3255', holder: 'Yessie', expiry: '02/25' },
    ]);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);

    const confirmDelete = (id: string) => {
        setCardToDelete(id);
    };

    const executeDelete = () => {
        if (cardToDelete) {
            setCards(cards.filter(c => c.id !== cardToDelete));
            setCardToDelete(null);
        }
    };

    return (
        <View style={styles.container}>
            {/* Standard Header */}
            <ScreenHeader
                title="Payment Methods"
                showBackButton={true}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Your Cards</Text>

                {cards.map((card) => (
                    <View key={card.id} style={styles.cardItem}>
                        <View style={styles.cardHeader}>
                            <MastercardLogo />
                            <TouchableOpacity onPress={() => confirmDelete(card.id)} hitSlop={10}>
                                <Text style={{ fontSize: 22, color: '#CBD5E1', fontWeight: '300' }}>×</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
                        <View style={styles.cardFooter}>
                            <View>
                                <Text style={styles.cardLabel}>Card Holder</Text>
                                <Text style={styles.cardValue}>{card.holder}</Text>
                            </View>
                            <View>
                                <Text style={styles.cardLabel}>Expires</Text>
                                <Text style={styles.cardValue}>{card.expiry}</Text>
                            </View>
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.addCardPlaceholder}
                    activeOpacity={0.8}
                    onPress={() => router.push('/payment/add')}
                >
                    <Plus size={32} color="#94A3B8" />
                    <Text style={styles.addCardText}>Add New Card</Text>
                </TouchableOpacity>

                <View style={{ height: insets.bottom + 20 }} />
            </ScrollView>

            <Modal
                visible={!!cardToDelete}
                transparent
                animationType="fade"
            >
                <BlurView intensity={20} style={styles.modalOverlay}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertTitle}>Remove Card?</Text>
                        <Text style={styles.alertMessage}>Are you sure you want to remove this payment method?</Text>
                        <View style={styles.alertButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setCardToDelete(null)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteBtn} onPress={executeDelete}>
                                <Text style={styles.deleteBtnText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 20,
        marginTop: 10,
    },
    cardItem: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        height: 200,
        justifyContent: 'space-between',
        shadowColor: '#B5B5B5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.01,
        shadowRadius:20,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardNumber: {
        fontSize: 22,
        fontWeight: '500',
        color: '#0F172A',
        letterSpacing: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
    },
    cardLabel: {
        fontSize: 10,
        color: '#94A3B8',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 14,
        color: '#0F172A',
        fontWeight: '500',
    },
    addCardPlaceholder: {
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    addCardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#94A3B8',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    alertBox: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 10,
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },
    alertMessage: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    alertButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#0F172A',
        fontWeight: '600',
    },
    deleteBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#EF4444',
        alignItems: 'center',
    },
    deleteBtnText: {
        color: '#FFF',
        fontWeight: '600',
    },
});
