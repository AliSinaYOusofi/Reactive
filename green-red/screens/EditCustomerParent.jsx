import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    Text,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { EvilIcons, Fontisto, SimpleLineIcons } from "@expo/vector-icons";
import CurrencyDropdownListSearch from "../components/global/CurrencyDropdownList";
import { validateUsername } from "../utils/validators/usernameValidator";
import { isEmailValid } from "../utils/validators/emailValidator";
import { phoneNumberValidator } from "../utils/validators/phoneNumberValidator";
import { amountOfMoneyValidator } from "../utils/validators/amountOfMoneyValidator";
import { RadioButton } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../context/useAppContext";
import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import money from "../assets/mony.png";

export default function EditCustomerParent({ navigation, route }) {
    // Destructure previous data from route.params
    const {
        username: prev_username,
        totalAmount: prev_amount_of_money,
        transaction_type: prev_payment_status,
        currency: prev_selected_currency,
    } = route.params;

    // Convert amount to a string for the TextInput
    const initialAmount = String(prev_amount_of_money);

    // Local state for updated fields
    const [updatedUsername, setUpdatedUsername] = useState("");
    const [updatedAmountOfMoney, setUpdatedAmountOfMoney] = useState("");
    const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState("");
    const [updatedSelectedCurrency, setUpdatedSelectedCurrency] = useState("");

    const navigator = useNavigation();
    const { setRefreshHomeScreenOnChangeDatabase } = useAppContext();
    const db = SQLite.openDatabaseSync("green-red.db");

    // Reanimated shared value for button scale
    const scale = useSharedValue(1);
    const buttonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const onPressIn = () => {
        scale.value = withSpring(0.95);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    // Preload previous values into state on mount
    useEffect(() => {
        setUpdatedUsername(prev_username);
        setUpdatedAmountOfMoney(initialAmount);
        setUpdatedPaymentStatus(prev_payment_status);
        setUpdatedSelectedCurrency(prev_selected_currency);
    }, []);

    // Validate inputs and perform update
    const handleUpdateCustomerParent = () => {
        if (!validateUsername(updatedUsername)) {
            return showToast("Username is invalid");
        }

        if (
            updatedAmountOfMoney.length &&
            !amountOfMoneyValidator(updatedAmountOfMoney)
        ) {
            return showToast("Amount of money is invalid");
        }

        if (!updatedPaymentStatus) {
            return showToast("Please select a payment status");
        }

        if (!updatedSelectedCurrency) {
            return showToast("Please select a currency");
        }

        updateParentCustomer();
        updateParentChildren();
    };

    const showToast = (message, type = "error") => {
        Toast.show({
            type: type,
            text1: message,
            position: "top",
            onPress: () => Toast.hide(),
            swipeable: true,
            topOffset: 100,
        });
    };

    // Update the customer record in the customers table
    const updateParentCustomer = async () => {
        try {
            await db.runAsync(
                "UPDATE customers SET username = ?, amount = ?, transaction_type = ?, currency = ? WHERE username = ?",
                [
                    updatedUsername,
                    updatedAmountOfMoney,
                    updatedPaymentStatus,
                    updatedSelectedCurrency,
                    prev_username,
                ]
            );
            setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
        } catch (error) {
            showToast("Failed to update customer");
            console.error(error);
        }
    };

    const updateParentChildren = async () => {
        try {
            await db.runAsync(
                "UPDATE customer__records SET username = ? WHERE username = ?",
                [updatedUsername, prev_username]
            );
            showToast("Updated customer successfully", "success");
            setTimeout(() => navigator.navigate("homescreen"), 2000);
            setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
        } catch (error) {
            showToast("Failed to update customer records");
            console.error(error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Animated.View
                entering={FadeIn.duration(300)}
                style={styles.modalView}
            >
                <Animated.View
                    entering={FadeInDown.duration(300).delay(200)}
                    style={styles.inputContainer}
                >
                    <TextInput
                        style={styles.input}
                        value={updatedUsername}
                        onChangeText={setUpdatedUsername}
                        placeholder="Username"
                        placeholderTextColor="#94A3B8"
                    />
                    <View style={styles.iconContainer}>
                        <EvilIcons name="user" size={28} color="#64748B" />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(500)}
                    style={styles.inputContainer}
                >
                    <TextInput
                        style={styles.input}
                        value={updatedAmountOfMoney}
                        onChangeText={setUpdatedAmountOfMoney}
                        placeholder="Amount"
                        keyboardType="decimal-pad"
                        placeholderTextColor="#94A3B8"
                    />
                    <View style={styles.iconContainer}>
                        <Fontisto
                            name="money-symbol"
                            size={24}
                            color="#64748B"
                        />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(600)}
                    style={styles.paymentStatusContainer}
                >
                    <Text style={styles.paymentLabel}>Payment Status</Text>
                    <RadioButton.Group
                        onValueChange={setUpdatedPaymentStatus}
                        value={updatedPaymentStatus}
                    >
                        <View style={styles.radioGroup}>
                            <View style={styles.radioOption}>
                                <RadioButton
                                    value="received"
                                    color="#10B981"
                                    uncheckedColor="#CBD5E1"
                                />
                                <Text style={styles.radioLabel}>Received</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton
                                    value="paid"
                                    color="#EF4444"
                                    uncheckedColor="#CBD5E1"
                                />
                                <Text style={styles.radioLabel}>Paid</Text>
                            </View>
                        </View>
                    </RadioButton.Group>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(700)}
                    style={styles.dropDownContainer}
                >
                    <CurrencyDropdownListSearch
                        setSelected={setUpdatedSelectedCurrency}
                        selected={updatedSelectedCurrency}
                    />
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(800)}
                    style={styles.buttonWrapper}
                >
                    <Animated.View style={buttonStyle}>
                        <Pressable
                            style={styles.addButton}
                            onPress={handleUpdateCustomerParent}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                        >
                            <Text style={styles.buttonText}>
                                Update Customer
                            </Text>
                        </Pressable>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        backgroundColor: "white",
    },
    image_container: {
        width: 100,
        height: 100,
        marginBottom: 24,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 16,
        position: "relative",
    },
    input: {
        width: "100%",
        height: 56,
        paddingHorizontal: 16,
        paddingRight: 48,
        fontSize: 16,
        color: "#1E293B",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    iconContainer: {
        position: "absolute",
        right: 16,
        height: "100%",
        justifyContent: "center",
    },
    paymentStatusContainer: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    paymentLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 12,
    },
    radioGroup: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioLabel: {
        fontSize: 16,
        color: "#475569",
        marginLeft: 8,
    },
    dropDownContainer: {
        width: "100%",
        marginBottom: 24,
    },
    addButton: {
        width: "100%",
        minWidth: 280,
        backgroundColor: "black",
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 0.5,
    },
    buttonWrapper: {
        width: "100%",
        alignItems: "center",
    },
});
