import React, { useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import CurrencyDropdownListSearch from "./CurrencyDropdownList";
import Toast from "react-native-toast-message";
import { amountOfMoneyValidator } from "../../utils/validators/amountOfMoneyValidator";
import { format } from "date-fns";
import { useAppContext } from "../../context/useAppContext";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from '@expo/vector-icons';
import { supabase } from "../../utils/supabase";
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

    const handleAddNewRecord = async () => {
        if (!amountOfMoneyValidator(newAmount)) {
            return showToast("Amount of money is not valid");
        }

        if (!newTransactionType) {
            return showToast("Please select a payment status");
        }

        if (!newCurrency) {
            return showToast("Please select a currency");
        }
        await updateCustomerRecrod();
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

    const updateCustomerRecrod = async () => {
        setSaving(true)
        try {
            const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

            const { data, error } = await supabase
                .from("customer_transactions")
                .update({
                    amount: newAmount,
                    transaction_type: newTransactionType,
                    currency: newCurrency,
                    transaction_updated_at: currentDateTime,
                })
                .eq("id", record_id);
            if (error) {
                showToast("No record found to update");
            } else {
                setSaving(false)
                showToast("User record updated!", "success");
                setUpdateRecordModal(false);
                setRefreshSingleViewChangeDatabase((prev) => !prev);
                setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
            }
        } catch (error) {
            console.error("Error while updating record", error.message);
            showToast("Failed to update record");
        } finally {
            setNewAmount("");
            setNewTransactionType("");
            setNewCurrency("");
            
        }
    };

    return (
        <Animated.View
            entering={SlideInDown.duration(500)}
            style={styles.modalView}
            exiting={SlideOutDown.duration(400)}
        >
            <Animated.View style={styles.options_container}>
                <Animated.View
                    entering={FadeIn.duration(300).delay(300)}
                    style={styles.input_container}
                >
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setNewAmount(text)}
                        keyboardType="phone-pad"
                        value={newAmount}
                    />
                    <View style={styles.iconContainer}>
                        <Feather name="dollar-sign" size={28} color="#64748B" />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeIn.duration(300).delay(200)}
                    style={styles.paymentStatusContainer}
                >
                    <Text style={styles.paymentLabel}>Payment Status</Text>
                    <RadioButton.Group
                        onValueChange={setNewTransactionType}
                        value={newTransactionType}
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
                    entering={FadeIn.duration(300).delay(100)}
                    style={styles.drop_down_container}
                >
                    <CurrencyDropdownListSearch
                        setSelected={setNewCurrency}
                        selected={newCurrency}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(300).delay(400)}>
                    <TouchableOpacity
                        style={styles.add_new_customer_btn}
                        onPress={handleAddNewRecord}
                        title="add new customer"
                    >
                        {saving ? (
                            <ActivityIndicator
                                size="small"
                                color="white"
                                style={{ marginLeft: 12, marginTop: 5 }}
                            />
                        ) : (
                            <Text style={styles.buttonText}>
                                Update Record
                            </Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                    onPress={() => setUpdateRecordModal(false)}
                    style={[styles.pressable, styles.pressable_close]}
                >
                    <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
            </Animated.View>
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
        borderColor: "#EDF2F7",
        padding: 20,
        borderRadius: 5,
        width: "100%",
        borderRadius: 20,
    },
    input_container: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        position: "relative",
        marginTop: 20,
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
        width: "100%",
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
        marginTop: 20,
        textAlign: "center",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
        borderRadius: 99,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: -30,
        marginTop: 20,
    },

    drop_down_container: {
        marginTop: 10,
    },

    pressable: {
        position: "absolute",
        borderRadius: 50,
        color: "white",
        top: 10,
        right: 10,
        position: "absolute",
        zIndex: 1,
        backgroundColor: "white",
        padding: 8,
        borderRadius: 50,
    },
    paymentStatusContainer: {
        width: "100%",
        borderRadius: 20,
        padding: 16,
        marginTop: 10,
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
    iconContainer: {
        position: "absolute",
        right: 16,
        height: "100%",
        justifyContent: "center",
        bottom: 10,
    },
    buttonText : {
        color: "white"
    }
});
