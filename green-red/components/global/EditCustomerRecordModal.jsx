import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
} from "react-native";
import CurrencyDropdownListSearch from "./CurrencyDropdownList";
import Toast from "react-native-toast-message";
import { amountOfMoneyValidator } from "../../utils/validators/amountOfMoneyValidator";
import { format } from "date-fns";
import { useAppContext } from "../../context/useAppContext";
import Animated, { SlideInDown, SlideOutDown, FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../utils/supabase";

const { width, height } = Dimensions.get("window");

export default function EditCustomerRecordModal({
    amount,
    currency,
    transaction_type,
    record_id,
    setUpdateRecordModal,
}) {
    const [newTransactionType, setNewTransactionType] =
        useState(transaction_type);
    const [newCurrency, setNewCurrency] = useState(currency);
    const [newAmount, setNewAmount] = useState(String(amount));
    const [saving, setSaving] = useState(false);
    const {
        setRefreshSingleViewChangeDatabase,
        setRefreshHomeScreenOnChangeDatabase,
    } = useAppContext();

    const showToast = (message, type = "error") => {
        Toast.show({
            type,
            text1: message,
            position: "top",
            topOffset: 100,
        });
    };

    const handleUpdate = async () => {
        if (!amountOfMoneyValidator(newAmount)) {
            return showToast("Amount is not valid");
        }
        if (!newTransactionType) {
            return showToast("Please choose a transaction type");
        }
        if (!newCurrency) {
            return showToast("Please select a currency");
        }

        setSaving(true);
        try {
            const now = format(new Date(), "yyyy-MM-dd HH:mm:ss");
            const { error } = await supabase
                .from("customer_transactions")
                .update({
                    amount: newAmount,
                    transaction_type: newTransactionType,
                    currency: newCurrency,
                    transaction_updated_at: now,
                })
                .eq("id", record_id);
            if (error) throw error;

            showToast("Record updated!", "success");
            setRefreshSingleViewChangeDatabase(prev => !prev);
            setRefreshHomeScreenOnChangeDatabase(prev => !prev);
            setUpdateRecordModal(false);
        } catch (err) {
            console.error(err);
            showToast("Update failed");
        } finally {
            setSaving(false);
        }
    };

    // Colors
    const green = '#10B981';
    const red = '#EF4444';

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            {/* backdrop closes modal */}
            <TouchableWithoutFeedback onPress={() => setUpdateRecordModal(false)}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            {/* modal content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Animated.View
                        entering={SlideInDown.duration(300)}
                        exiting={SlideOutDown.duration(300)}
                        style={styles.modal}
                    >
                        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                            <Text style={styles.header}>Edit Record</Text>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={styles.input}
                                    value={newAmount}
                                    onChangeText={setNewAmount}
                                    keyboardType="decimal-pad"
                                    placeholder="Amount"
                                    placeholderTextColor="#94A3B8"
                                />
                                <Feather name="dollar-sign" size={20} color="#64748B" style={styles.icon} />
                            </View>

                            <View style={styles.pillGroup}>
                                {['received','paid'].map(type => {
                                    const isSel = newTransactionType === type;
                                    const color = type === 'received' ? green : red;
                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            style={[
                                                styles.pill,
                                                isSel && { borderColor: color, backgroundColor: color+'20' }
                                            ]}
                                            onPress={() => setNewTransactionType(type)}
                                        >
                                            <Text style={[styles.pillText, isSel && { color }]}>
                                                {type.charAt(0).toUpperCase()+type.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.dropdownWrapper}>
                                <CurrencyDropdownListSearch
                                    selected={newCurrency}
                                    setSelected={setNewCurrency}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.saveBtn, { backgroundColor: green }]}
                                onPress={handleUpdate}
                                disabled={saving}
                            >
                                {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveTxt}>Update</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeBtn} onPress={() => setUpdateRecordModal(false)}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </ScrollView>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        width: '100%',
    },
    modal: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: '#EDF2F7',
        maxHeight: height * 0.8,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EDF2F7',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1E293B',
    },
    icon: { marginLeft: 8 },
    pillGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
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
    dropdownWrapper: { marginBottom: 24 },
    saveBtn: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    saveTxt: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#EDF2F7',
        padding: 8,
        borderRadius: 18,
    },
});
