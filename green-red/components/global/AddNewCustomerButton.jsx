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

    const handleAddCustomer = () => {
        navigation.navigate('Add Customer');
    };

    const handleOpenPaypal = () => {
        Linking.openURL('https://www.paypal.com/paypalme/habibyousofi');
    };

    const handleNavigateToChart = () => {
        navigation.navigate('Chart');
    };

    return (
        <View style={styles.container}>
            <AnimatedTouchableOpacity
                onPress={() => navigation.navigate("Add Customer")}
                style={[styles.button, animatedStyle]}
                activeOpacity={0.9}
                {...pressHandlers}
            >
                <Feather name="user-plus" size={20} color="#fff" />
                <Text style={styles.buttonText}>Add User</Text>
            </AnimatedTouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        columnGap: 8,
        alignItems: 'center',

    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#14171A",
        borderRadius: 99,
        paddingVertical: 18,
        paddingHorizontal: 16,
        width: "90%",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    separator: {
        height: '100%',
        width: 1,
        backgroundColor: 'gray',
    },

    text: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 0.5,
        alignContent: "center",
        justifyContent: "center",
        alignItems: " center"
    }
    wrapper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        left: 0,
        right: 0, 
    },
    container: {
        backgroundColor: "#FFFFFF",
        paddingTop: 10,
        paddingBottom: 34, // Safe area padding
        paddingHorizontal: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderColor: "#E2E8F0",
        borderWidth: 1,
    },
    buttonsContainer: {
        flexDirection: "row",
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
