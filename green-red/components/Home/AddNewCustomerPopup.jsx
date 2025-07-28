import React, { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
} from "react-native";
import CurrencyDropdownListSearch from "../global/CurrencyDropdownList";
import { validateUsername } from "../../utils/validators/usernameValidator";
import { amountOfMoneyValidator } from "../../utils/validators/amountOfMoneyValidator";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../context/useAppContext";
import { format } from "date-fns";
import Animated, {
    FadeIn,
    SlideInLeft,
    SlideInRight,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../utils/supabase";

const { width } = Dimensions.get("window");
const green = "#10B981";
const red = "#EF4444";

export default function AddNewCustomerPopup() {
    const [username, setUsername] = useState("");
    const [amountOfMoney, setAmountOfMoney] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [saving, setSaving] = useState(false);

    const { setRefreshHomeScreenOnChangeDatabase, userId } = useAppContext();
    const navigator = useNavigation();

    // Add customer and initial transaction
    const addNewCustomer = async () => {
        if (!validateUsername(username))
            return showToast("Username is invalid");
        if (amountOfMoney && !amountOfMoneyValidator(amountOfMoney))
            return showToast("Amount of money is invalid");
        if (!paymentStatus) return showToast("Please select a payment status");
        if (!selectedCurrency) return showToast("Please select a currency");

        setSaving(true);
        const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        try {
            // insert customer
            const { data: customerData, error: custErr } = await supabase
                .from("customers")
                .insert([
                    { username, created_at: currentDateTime, user_id: userId },
                ])
                .select();
            if (custErr) throw custErr;
            const newCustomerId = customerData[0].id;

            // insert transaction
            const { error: txErr } = await supabase
                .from("customer_transactions")
                .insert([
                    {
                        customer_id: newCustomerId,
                        amount: parseFloat(amountOfMoney) || 0,
                        transaction_type: paymentStatus,
                        currency: selectedCurrency,
                        transaction_at: currentDateTime,
                        transaction_updated_at: currentDateTime,
                        user_id: userId,
                    },
                ]);
            if (txErr) throw txErr;

            showToast("Customer added", "success");
            setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
            setTimeout(() => navigator.goBack(), 1000);
        } catch (err) {
            console.error(err);
            showToast("Failed to add customer: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const showToast = (message, type = "error") => {
        Toast.show({ type, text1: message, position: "top", topOffset: 100 });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Animated.View
                    entering={FadeIn.duration(300).delay(100)}
                    style={styles.modalView}
                >
                    <Animated.Text
                        entering={SlideInRight.duration(300).delay(150)}
                        style={styles.title}
                    >
                        Add New Customer
                    </Animated.Text>

                    <Animated.View
                        entering={SlideInLeft.duration(300).delay(200)}
                        style={styles.inputContainer}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            onChangeText={setUsername}
                            placeholderTextColor="#94A3B8"
                        />
                        <View style={styles.iconContainer}>
                            <Feather name="user" size={28} color="#64748B" />
                        </View>
                    </Animated.View>

                    <Animated.View
                        entering={SlideInRight.duration(300).delay(250)}
                        style={styles.inputContainer}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            onChangeText={setAmountOfMoney}
                            keyboardType="decimal-pad"
                            placeholderTextColor="#94A3B8"
                        />
                        <View style={styles.iconContainer}>
                            <Feather
                                name="dollar-sign"
                                size={28}
                                color="#64748B"
                            />
                        </View>
                    </Animated.View>

                    {/* payment status pills */}
                    <Animated.View
                        entering={SlideInLeft.duration(300).delay(250)}
                        style={styles.section}
                    >
                        <Text style={styles.sectionLabel}>Payment Status</Text>
                        <View style={styles.radioGroup}>
                            {["received", "paid"].map((type) => {
                                const isSel = paymentStatus === type;
                                const color =
                                    type === "received" ? "#10B981" : "#EF4444";
                                return (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.pill,
                                            isSel && {
                                                borderColor: color,
                                                backgroundColor: color + "20",
                                            },
                                        ]}
                                        onPress={() => setPaymentStatus(type)}
                                    >
                                        <Text
                                            style={
                                                isSel
                                                    ? {
                                                          ...styles.pillTextSel,
                                                          color,
                                                      }
                                                    : styles.pillText
                                            }
                                        >
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>

                    <Animated.View
                        entering={SlideInLeft.duration(300).delay(300)}
                        style={styles.dropdownWrapper}
                    >
                        <CurrencyDropdownListSearch
                            selected={selectedCurrency}
                            setSelected={setSelectedCurrency}
                        />
                    </Animated.View>

                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: "black" }]}
                        onPress={addNewCustomer}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Add Customer</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        width: "90%",
        backgroundColor: "white",
        padding: 24,
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 24,
        textAlign: "center",
    },
    inputContainer: { marginBottom: 16, position: "relative" },
    input: {
        borderWidth: 1,
        borderColor: "#EDF2F7",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    iconContainer: { position: "absolute", right: 12, top: 16 },
    pillGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 16,
    },
    pill: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 12,
        alignItems: "center",
    },
    pillText: { color: "#475569", fontWeight: "500" },
    pillTextSel: { fontWeight: "600" },
    dropdownWrapper: { marginBottom: 24 },
    addButton: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
    buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
    section: {
        marginBottom: 16,
        width: "100%",
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#1E293B",
    },

    // pill styles you already have:
    radioGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    pill: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 12,
        alignItems: "center",
    },
    pillText: {
        color: "#475569",
        fontWeight: "500",
    },
    pillTextSel: {
        fontWeight: "600",
    },
});
