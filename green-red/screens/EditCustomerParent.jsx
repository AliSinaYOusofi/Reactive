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
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { validateUsername } from "../utils/validators/usernameValidator";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../context/useAppContext";
import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { supabase } from "../utils/supabase";

import { padi_color, received_color } from "../components/global/colors";
import { MaterialIcons } from "@expo/vector-icons";

export default function EditCustomerParent({ navigation, route }) {
    const { username: prev_username } = route.params;

    const [updatedUsername, setUpdatedUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

    const [saving, setSaving] = useState(false);

    const navigator = useNavigation();
    const { setRefreshHomeScreenOnChangeDatabase, userId } = useAppContext();

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
        setUpdatedUsername(prev_username);
    }, []);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{7,15}$/;
        return phoneRegex.test(phone);
    };

    const handleUpdateCustomerParent = () => {
        if (!validateUsername(updatedUsername)) {
            return showToast("Username is invalid");
        }

        if (email && email.length > 0 && !isValidEmail(email)) {
            return showToast("Email is invalid");
        }

        if (
            phoneNumber &&
            phoneNumber.length > 0 &&
            !isValidPhoneNumber(phoneNumber)
        ) {
            return showToast("Phone number is invalid");
        }

        updateParentCustomer();
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

    const updateParentCustomer = async () => {
        setSaving(true);
        try {
            const { data, error } = await supabase
                .from("customers")
                .update({
                    username: updatedUsername,
                    email: email,
                    phone: phoneNumber,
                })
                .eq("user_id", userId)
                .eq('username', prev_username)

            if (error) {
                showToast("Failed to update");
            } else {
                setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
                showToast("Customer updated", "success");
                setSaving(false);
            }
        } catch (error) {
            console.error("Error updating customer:", error.message);
            showToast("Failed to update customer");
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
                        <MaterialIcons name="verified-user" size={28} color="#64748B" />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(500)}
                    style={styles.inputContainer}
                >
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Phone"
                        keyboardType="decimal-pad"
                        placeholderTextColor="#94A3B8"
                    />
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="phone" size={24} color="#64748B" />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(500)}
                    style={styles.inputContainer}
                >
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="email"
                        placeholderTextColor="#94A3B8"
                    />
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="mail" size={24} color="#64748B" />
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(300).delay(800)}
                    style={styles.buttonWrapper}
                >
                    <Animated.View style={buttonStyle}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleUpdateCustomerParent}
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
                                    Update Customer
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
        backgroundColor: "green",
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        borderRadius: 99,
        paddingVertical: 18,
        paddingHorizontal: 16,
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
