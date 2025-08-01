import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";
import React, { useState, useCallback } from "react";
import CurrencyExchangeModal from "../SingleCustomerViewComp/CurrencyExchangeModal";
import { supabase } from "../../utils/supabase";

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

export default function ActionButtons({ userId, isCustomerListEmpty }) {
    const navigation = useNavigation();
    const [exchangeModal, setExchangeModal] = useState(false);

    // all transactions array which is the total amount of transactions
    // that user has done. so first we use vars to fetch and track all currencies
    // and then pass it to the modal
    const [allCustomersTransactions, setAllCustomersTransactions] = useState(
        []
    );
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    // a function to fetch all current logged in customer transactions

    const fetchAllTransactions = useCallback(async () => {
        setLoadingTransactions(true);
        try {
            const { data, error } = await supabase
                .from("customer_transactions")
                .select("*")
                .eq("user_id", userId);

            if (error) throw error;
            setAllCustomersTransactions(data || []);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoadingTransactions(false);
        }
    }, [userId]);

    // Open exchange modal handler
    const openExchangeModal = async () => {
        await fetchAllTransactions();
        setExchangeModal(true);
    };

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const pressHandlers = {
        onPressIn: () => {
            scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        },
        onPressOut: () => {
            scale.value = withSpring(1, { damping: 15, stiffness: 200 });
        },
    };

    return (
        <View style={styles.container}>
            <Animated.View style={styles.buttonContainer}>
                <AnimatedTouchableOpacity
                    onPress={() => navigation.navigate("Add Customer")}
                    style={[styles.button, animatedStyle]}
                    activeOpacity={0.9}
                    {...pressHandlers}
                >
                    <Feather name="user-plus" size={20} color="black" />
                </AnimatedTouchableOpacity>

                <AnimatedTouchableOpacity
                    onPress={() => navigation.navigate("settings")}
                    style={[styles.button, animatedStyle]}
                    activeOpacity={0.9}
                    {...pressHandlers}
                >
                    <Feather
                        name="settings"
                        size={20}
                        color="black"
                        style={styles.icon}
                    />
                </AnimatedTouchableOpacity>

                <AnimatedTouchableOpacity
                    onPress={openExchangeModal}
                    style={[styles.button, animatedStyle, {display: !isCustomerListEmpty ? 'none' : 'flex'}]}
                    activeOpacity={0.9}
                    {...pressHandlers}
                >
                    {loadingTransactions ? (
                        <ActivityIndicator size="small" color="black" />
                    ) : (
                        <MaterialIcons
                            name="currency-exchange"
                            size={20}
                            color="black"
                            style={styles.icon}
                        />
                    )}
                </AnimatedTouchableOpacity>
            </Animated.View>

            <Modal
                visible={exchangeModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setExchangeModal(false)}
            >
                <CurrencyExchangeModal
                    onClose={() => setExchangeModal(false)}
                    transactions={allCustomersTransactions}
                    username={"All Customers"}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Added for better text alignment
        backgroundColor: "white", // A modern blue shade
        paddingVertical: 12,
        paddingHorizontal: 16, // Adjusted padding for better text fit
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: "#EDF2F7",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "between",
        alignItems: "stretch",
        paddingVertical: 10,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",

        backgroundColor: "white",
        borderRadius: 9999,
        width: "70%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        bottom: 1,
        borderWidth: 1,
        borderColor: "#EDF2F7",
        marginBottom: 15,
    },
});
