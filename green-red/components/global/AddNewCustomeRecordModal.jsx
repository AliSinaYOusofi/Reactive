import React, { useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    TouchableOpacityBase,
} from "react-native";
import CurrencyDropdownListSearch from "./CurrencyDropdownList";
import Toast from "react-native-toast-message";
import { amountOfMoneyValidator } from "../../utils/validators/amountOfMoneyValidator";
import { format } from "date-fns";
import { useAppContext } from "../../context/useAppContext";
import Animated, {
    FadeInDown,
    SlideInDown,
    SlideOutDown,
} from "react-native-reanimated";
import { Banknote, X } from "lucide-react-native";
import { supabase } from "../../utils/supabase";

export default function AddNewCustomeRecordModal({
    username,
    setAddNewRecordModal,
}) {
    const [amount, setAmount] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [currency, setCurrency] = useState("");

    const {
        setRefreshSingleViewChangeDatabase,
        setRefreshHomeScreenOnChangeDatabase,
    } = useAppContext();

    const handleAddNewRecord = async () => {
        if (!amountOfMoneyValidator(amount)) {
            return showToast("Amount of money is not valid");
        }

        if (!transactionType) {
            return showToast("Please select a payment status");
        }

        if (!currency) {
            return showToast("Please select a currency");
        }

        try {
            await insertToCustomerChild();
        } catch (error) {
            console.error("Error while adding new record:", error.message);
            showToast("Error while adding new record");
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

    const insertToCustomerChild = async () => {
        try {
            const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
            const dataToInsert = {
                username: username,
                amount: amount,
                transaction_type: transactionType,
                currency: currency,
                transaction_at: currentDateTime,
                transaction_updated_at: currentDateTime,
            };

            const { data, error } = await supabase
                .from("customer__records")
                .insert([dataToInsert]);

            if (error) {
                console.error("Error inserting data:", error);
                showToast("Failed to add a new record", "error");
            }

            showToast("User record added", "success");
        } catch (error) {
            console.error("Error while inserting new record:", error.message);
            showToast("Error while inserting new record");
        } finally {
            setAmount("");
            setTransactionType("");
            setCurrency("");
            setAddNewRecordModal(false);
            setRefreshSingleViewChangeDatabase((prev) => !prev);
            setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
        }
    };

    return (
        <Animated.View
            entering={SlideInDown.duration(500)}
            style={styles.modalView}
            exiting={SlideOutDown.duration(400)}
        >
            <View style={styles.options_container}>
                <Animated.View
                    entering={FadeInDown.duration(300).delay(100)}
                    style={styles.input_container}
                >
                    <TextInput
                        style={styles.input}
                        placeholder="amount"
                        onChangeText={(text) => setAmount(text)}
                        keyboardType="phone-pad"
                    />

                    <View style={styles.iconContainer}>
                        <Banknote size={28} color="#64748B" />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(200)}
                    style={styles.paymentStatusContainer}
                >
                    <Text style={styles.paymentLabel}>Payment Status</Text>
                    <RadioButton.Group
                        onValueChange={setTransactionType}
                        value={transactionType}
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
                    entering={FadeInDown.duration(300).delay(300)}
                    style={styles.drop_down_container}
                >
                    <CurrencyDropdownListSearch
                        setSelected={setCurrency}
                        selected={currency}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(300).delay(400)}>
                    <TouchableOpacity
                        style={styles.add_new_customer_btn}
                        onPress={handleAddNewRecord}
                    >
                        <Text style={{ color: "white" }}>Save Record</Text>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                    onPress={() => setAddNewRecordModal(false)}
                    style={[styles.pressable, styles.pressable_close]}
                >
                    <X size={20} color="black" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        position: "relative",
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 20,
        width: "100%",
        borderRadius: 20
    },
    input_container: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        position: "relative",
        marginTop: 10,
    },

    icon: {
        position: "absolute",
        right: 10,
        top: "10%",
        color: "black",
        zIndex: 1,
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50,
    },

    payment_status: {
        flexDirection: "row",
        backgroundColor: "#FDFCFA",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: 5,
    },

    payment_text: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 4,
    },
    options_container: {
        backgroundColor: "white",
        padding: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: "black",
        shadowOffset: { width: 3, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 14,
        elevation: 15,
    },

    add_new_customer_btn: {
        backgroundColor: "green",
        color: "white",
        textAlign: "center",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9999,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: "90%",
        shadowRadius: 4,
        borderRadius: 99,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: -30,
        marginTop: 20
    },

    drop_down_container: {
        marginTop: 10,
    },

    pressable: {
        position: "absolute",
        zIndex: 1,
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50,
        color: "black",
        top: 10,
        right: 10,
    },
    paymentStatusContainer: {
        width: "100%",
        borderRadius: 20,
        padding: 16,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'gray'
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
    iconContainer: {
        position: "absolute",
        right: 16,
        height: "100%",
        justifyContent: "center",
        top:"1"
    }
});
