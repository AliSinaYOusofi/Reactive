"use client";

import { useEffect, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    Text,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { EvilIcons, Fontisto } from "@expo/vector-icons";
import CurrencyDropdownListSearch from "../global/CurrencyDropdownList";
import { validateUsername } from "../../utils/validators/usernameValidator";
import { amountOfMoneyValidator } from "../../utils/validators/amountOfMoneyValidator";
import { RadioButton } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../context/useAppContext";
import { format } from "date-fns";
import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

function AddNewCustomerPopup() {
    const [username, setUsername] = useState("");
    const [amountOfMoney, setAmountOfMoney] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");

    const { setRefreshHomeScreenOnChangeDatabase } = useAppContext();
    const db = SQLite.openDatabaseSync("green-red.db");
    const navigator = useNavigation();

    // Animation setup
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

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS customers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        username TEXT NOT NULL, 
                        email TEXT, 
                        phone TEXT, 
                        amount REAL NOT NULL, 
                        transaction_type TEXT NOT NULL, 
                        currency TEXT NOT NULL, 
                        at DATETIME NOT NULL
                    );
                `);
            } catch (error) {
                showToast(error.message);
                console.error("Error creating table: ", error);
            }
        };

        initializeDatabase();
    }, [db.execAsync]); // Added db.execAsync to dependencies

    const addNewCustomer = async () => {
        if (!validateUsername(username)) {
            return showToast("Username is invalid");
        }

        if (amountOfMoney.length && !amountOfMoneyValidator(amountOfMoney)) {
            setAmountOfMoney(0);
            return showToast("Amount of money is invalid");
        }

        if (!paymentStatus) {
            return showToast("Please select a payment status");
        }

        if (!selectedCurrency) {
            return showToast("Please select a currency");
        }

        try {
            const result = await db.execAsync(
                "SELECT * FROM customers WHERE username = ?",
                [username]
            );

            if (result && result[0] && result[0].values.length > 0) {
                showToast("Username already exists");
            } else {
                await insertCustomer();
            }
        } catch (error) {
            console.error("Error while checking username", error.message);
            showToast("Failed to add new customer");
        }
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

    const insertCustomer = async () => {
        const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

        if (
            !username ||
            !amountOfMoney ||
            !paymentStatus ||
            !selectedCurrency
        ) {
            showToast("Please fill in all required fields");
            return;
        }

        const statement = await db.prepareAsync(`
            INSERT INTO customers (username, email, phone, amount, transaction_type, currency, at) 
            VALUES ($username, $email, $phone, $amount, $transactionType, $currency, $at)
        `);

        try {
            await statement.executeAsync({
                $username: username,
                $email: null,
                $phone: null,
                $amount: Number.parseFloat(amountOfMoney),
                $transactionType: paymentStatus,
                $currency: selectedCurrency,
                $at: currentDateTime,
            });

            showToast("Customer added successfully", "success");
            setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
            
            setTimeout( () => {
                navigator.goBack();
            }, 1000)
            
        } catch (error) {
            showToast("Failed to add customer: " + error.message);
            console.error("Error while adding new user", error);
        } finally {
            await statement.finalizeAsync();
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
                <Animated.Text
                    entering={FadeInDown.duration(300).delay(100)}
                    style={styles.title}
                >
                    Add New Customer
                </Animated.Text>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(200)}
                    style={styles.inputContainer}
                >
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={setUsername}
                        placeholderTextColor="#94A3B8"
                    />
                    <View style={styles.iconContainer}>
                        <EvilIcons name="user" size={28} color="#64748B" />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(300)}
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
                        <Fontisto
                            name="money-symbol"
                            size={20}
                            color="#64748B"
                        />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(400)}
                    style={styles.paymentStatusContainer}
                >
                    <Text style={styles.paymentLabel}>Payment Status</Text>
                    <RadioButton.Group
                        onValueChange={setPaymentStatus}
                        value={paymentStatus}
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
                    entering={FadeInDown.duration(300).delay(500)}
                    style={styles.dropDownContainer}
                >
                    <CurrencyDropdownListSearch
                        setSelected={setSelectedCurrency}
                        selected={selectedCurrency}
                    />
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(600)}
                    style={styles.buttonWrapper}
                >
                    <Animated.View style={[buttonStyle]}>
                        <Pressable
                            style={styles.addButton}
                            onPress={addNewCustomer}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                        >
                            <Text style={styles.buttonText}>Add Customer</Text>
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
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 32,
        letterSpacing: 0.5,
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

export default AddNewCustomerPopup;
