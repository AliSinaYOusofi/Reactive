import React, { useState, useRef } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import CurrencyDropdownListSearch from "./CurrencyDropdownList";
import Toast from "react-native-toast-message";
import { amountOfMoneyValidator } from "../../utils/validators/amountOfMoneyValidator";
import { format } from "date-fns";
import { useAppContext } from "../../context/useAppContext";
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../../utils/supabase";

const { width, height } = Dimensions.get("window");

export default function AddNewCustomerRecordModal({
    username,
    setAddNewRecordModal,
    customer_id,
}) {
    const [amount, setAmount] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [currency, setCurrency] = useState("");
    const [saving, setSaving] = useState(false);

    const {
        setRefreshSingleViewChangeDatabase,
        setRefreshHomeScreenOnChangeDatabase,
        userId,
    } = useAppContext();

    const buttonScale = useSharedValue(1);
    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));
    const onPressIn = () =>
        (buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 }));
    const onPressOut = () =>
        (buttonScale.value = withSpring(1, { damping: 15, stiffness: 200 }));

    const showToast = (message, type = "error") =>
        Toast.show({ type, text1: message, position: "top", topOffset: 100 });

    const handleAddNewRecord = async () => {
        if (!amountOfMoneyValidator(amount)) return showToast("Amount is not valid");
        if (!transactionType) return showToast("Please select a transaction type");
        if (!currency) return showToast("Please select a currency");

        setSaving(true);
        try {
            const now = format(new Date(), "yyyy-MM-dd HH:mm:ss");
            const { error } = await supabase
                .from("customer_transactions")
                .insert([
                    {
                        amount,
                        transaction_type: transactionType,
                        currency,
                        transaction_at: now,
                        transaction_updated_at: now,
                        user_id: userId,
                        customer_id,
                    },
                ]);
            if (error) throw error;

            showToast("Record added!", "success");
            setTimeout(() => setAddNewRecordModal(false), 1000);
            setRefreshSingleViewChangeDatabase(p => !p);
            setRefreshHomeScreenOnChangeDatabase(p => !p);
        } catch (err) {
            console.error(err);
            showToast("Failed to add record");
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => setAddNewRecordModal(false);
    const isFormValid = amount && transactionType && currency;

    const green = '#10B981';
    const red = '#EF4444';

    return (
        <View style={styles.modalOverlay} pointerEvents="box-none">
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Animated.View
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(300)}
                        style={styles.contentContainer}
                    >
                        <View style={styles.headerContainer}>
                            <View style={styles.headerIconContainer}>
                                <MaterialIcons name="receipt-long" size={28} color="#FFF" />
                            </View>
                            <Text style={styles.title}>Add New Record</Text>
                            <Text style={styles.subtitle}>for {username}</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Feather name="dollar-sign" size={20} color="#64748B" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter amount"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="decimal-pad"
                                    value={amount}
                                    onChangeText={setAmount}
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Transaction Type</Text>
                            <View style={styles.pillGroup}>
                                {['received', 'paid'].map(type => {
                                    const isSel = transactionType === type;
                                    const color = type === 'received' ? green : red;
                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            style={[
                                                styles.pill,
                                                isSel && {
                                                    borderColor: color,
                                                    backgroundColor: color + '20',
                                                },
                                            ]}
                                            onPress={() => setTransactionType(type)}
                                        >
                                            <Text
                                                style={[
                                                    styles.pillText,
                                                    isSel && { color },
                                                ]}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Currency</Text>
                            <CurrencyDropdownListSearch
                                selected={currency}
                                setSelected={setCurrency}
                            />
                        </View>

                        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    (!isFormValid || saving) && styles.saveButtonDisabled,
                                ]}
                                onPress={handleAddNewRecord}
                                onPressIn={onPressIn}
                                onPressOut={onPressOut}
                                disabled={!isFormValid || saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Feather name="save" size={20} color="#FFF" />
                                )}
                                <Text style={styles.buttonText}>
                                    {saving ? 'Saving...' : 'Save Record'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Feather name="x" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    contentContainer: {
        backgroundColor: '#FFF',
        padding: 24,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: '#EDF2F7',
        width: '100%',
        elevation: 8,
    },
    headerContainer: { alignItems: 'center', marginBottom: 24 },
    headerIconContainer: {
        backgroundColor: '#1E293B',
        borderRadius: 30,
        padding: 12,
        marginBottom: 16,
    },
    title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
    subtitle: { fontSize: 16, color: '#64748B', marginBottom: 16 },
    inputContainer: { marginBottom: 20 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    input: { flex: 1, fontSize: 16, paddingVertical: 12, color: '#1E293B' },
    section: { marginBottom: 20 },
    sectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    pillGroup: { flexDirection: 'row', justifyContent: 'space-between' },
    pill: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        alignItems: 'center',
    },
    pillText: { fontSize: 16, color: '#475569', fontWeight: '500' },
    buttonContainer: { alignItems: 'center', marginBottom: 16 },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: "100%",
        justifyContent: 'center',
    },
    saveButtonDisabled: { backgroundColor: '#94A3B8' },
    buttonText: { color: '#FFF', fontSize: 16, marginLeft: 8 },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EDF2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
