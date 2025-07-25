import { useEffect, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    Text,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import CurrencyDropdownListSearch from "../global/CurrencyDropdownList";
import { validateUsername } from "../../utils/validators/usernameValidator";
import { amountOfMoneyValidator } from "../../utils/validators/amountOfMoneyValidator";
import { RadioButton } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../context/useAppContext";
import { format } from "date-fns";
import Animated, {
    FadeIn,
    FadeInDown,
    SlideInLeft,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { User, Banknote } from "lucide-react-native";
import { supabase } from "../../utils/supabase";

function AddNewCustomerPopup() {
    const [username, setUsername] = useState("");
    const [amountOfMoney, setAmountOfMoney] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [saving, setSaving] = useState(false);

    const { setRefreshHomeScreenOnChangeDatabase, userId } = useAppContext();
    const navigator = useNavigation();

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
        scale.value = withSpring(1.0);
    };

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

        setSaving(true);
        try {
            const { data, error } = await supabase
                .from("customers")
                .select("username")
                .eq("username", username)
                .eq("user_id", userId);

            if (data && data.length > 0) {
                showToast("Username already exists");
            } else {
                await insertCustomer();
            }
        } catch (error) {
            console.error("Error while checking username", error.message);
            showToast("Failed to add new customer");
        } finally {
            setSaving(false);
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

        try {

            const { data: customerData, error: customerError } = await supabase
                .from("customers")
                .insert([
                    {
                        username: username,
                        created_at: currentDateTime,
                        user_id: userId,
                    },
                ])
                .select();

            if (customerError) {
                showToast("Failed to add customer", "error");
                console.error("Error inserting customer:", customerError);
                return;
            }

            const newCustomerId = customerData[0].id;

            const { data, error } = await supabase
                .from("customer_transactions")
                .insert([
                    {
                        customer_id: newCustomerId,
                        amount: Number.parseFloat(amountOfMoney),
                        transaction_type: paymentStatus,
                        currency: selectedCurrency,
                        transaction_at: currentDateTime,
                        transaction_updated_at: currentDateTime,
                        user_id: userId,
                    },
                ]);

            if (error) {
                showToast("Failed to add transaction record", "error");
                console.error("Error inserting transaction record:", error);
                return;
            }

            showToast("Customer added", "success");
            setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
            setSaving(false);

            setTimeout(() => {
                navigator.goBack();
            }, 1000);
        } catch (error) {
            showToast("Failed to add customer: " + error.message, "error");
            console.error("Error while adding new customer", error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Animated.View
                entering={FadeIn.duration(300).delay(330)}
                style={styles.modalView}
            >
                <Animated.Text
                    entering={SlideInRight.duration(300).delay(300)}
                    style={styles.title}
                >
                    Add New Customer
                </Animated.Text>

                <Animated.View
                    entering={SlideInLeft.duration(300).delay(250)}
                    style={styles.inputContainer}
                >
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={setUsername}
                        placeholderTextColor="#94A3B8"
                    />
                    <View style={styles.iconContainer}>
                        <User size={28} color="#64748B" />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={SlideInRight.duration(300).delay(200)}
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
                        <Banknote size={28} color="#64748B" />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={SlideInLeft.duration(300).delay(150)}
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
                    entering={SlideInRight.duration(300).delay(100)}
                    style={styles.dropDownContainer}
                >
                    <CurrencyDropdownListSearch
                        setSelected={setSelectedCurrency}
                        selected={selectedCurrency}
                    />
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(50)}
                    style={styles.buttonWrapper}
                >
                    <Animated.View style={[buttonStyle]}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addNewCustomer}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                        >
                            {saving ? (
                                <ActivityIndicator
                                    size="small"
                                    color="white"
                                    style={{ marginLeft: 12, marginTop: 5 }}
                                />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Add Customer
                                </Text>
                            )}
                        </TouchableOpacity>
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
        borderWidth: 1,
        borderColor: "#EDF2F7",
        padding: 20,
        width: "100%",
        borderRadius: 20,
    },
    iconContainer: {
        position: "absolute",
        right: 16,
        height: "100%",
        justifyContent: "center",
    },
    paymentStatusContainer: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#EDF2F7",
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
        borderRadius: 99,
        paddingVertical: 18,
        paddingHorizontal: 16,
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
        alignContent: "center",
        justifyContent: "center",
        alignItems: " center",
    },
    buttonWrapper: {
        width: "100%",
        alignItems: "center",
    },
});

export default AddNewCustomerPopup;
