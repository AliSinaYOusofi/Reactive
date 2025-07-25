<<<<<<< HEAD
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserRoundPlus } from 'lucide-react-native';
=======

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserRoundPlus, TrendingUp } from "lucide-react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
>>>>>>> 66e78290e03e9da2713968a103b23bf2202b6fc3

export default function ActionButtons() {
    const navigation = useNavigation();

<<<<<<< HEAD
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
            <TouchableOpacity style={styles.button} onPress={handleAddCustomer}>
                <UserRoundPlus size={24} color="white" />
                <Text style={styles.text}>Add User</Text>
            </TouchableOpacity>
=======
    // Animation values for button press feedback
    const addUserScale = useSharedValue(1);
    const analyticsScale = useSharedValue(1);

    // Press animations
    const createPressAnimation = (scaleValue) => {
        return {
            onPressIn: () => {
                scaleValue.value = withSpring(0.95, {
                    damping: 15,
                    stiffness: 300,
                });
            },
            onPressOut: () => {
                scaleValue.value = withSpring(1, {
                    damping: 15,
                    stiffness: 200,
                });
            },
        };
    };

    const addUserAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: addUserScale.value }],
    }));

    const analyticsAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: analyticsScale.value }],
    }));

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.buttonsContainer}>
                    {/* Add User Button */}
                    <AnimatedTouchableOpacity
                        onPress={() => navigation.navigate("Add Customer")}
                        style={[
                            styles.actionButton,
                            styles.addUserButton,
                            addUserAnimatedStyle,
                        ]}
                        activeOpacity={0.9}
                        {...createPressAnimation(addUserScale)}
                    >
                        <View style={styles.iconContainer}>
                            <UserRoundPlus
                                size={22}
                                color="#FFFFFF"
                                strokeWidth={2.5}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.buttonText}>Add User</Text>
                        </View>
                    </AnimatedTouchableOpacity>

                    {/* Elegant Separator */}
                    <View style={styles.separatorContainer}>
                        <View style={styles.separator} />
                        <View style={styles.separatorDot} />
                    </View>

                    {/* Analytics Button */}
                    <AnimatedTouchableOpacity
                        onPress={() => navigation.navigate("Chart")}
                        style={[
                            styles.actionButton,
                            styles.analyticsButton,
                            analyticsAnimatedStyle,
                        ]}
                        activeOpacity={0.9}
                        {...createPressAnimation(analyticsScale)}
                    >
                        <View
                            style={[
                                styles.iconContainer,
                                styles.analyticsIconContainer,
                            ]}
                        >
                            <TrendingUp
                                size={22}
                                color="#FFFFFF"
                                strokeWidth={2.5}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.buttonText}>Analytics</Text>
                        </View>
                    </AnimatedTouchableOpacity>
                </View>

                {/* Professional indicator dots */}
                <View style={styles.indicatorContainer}>
                    <View style={[styles.indicator, styles.activeIndicator]} />
                    <View style={styles.indicator} />
                </View>
            </View>
>>>>>>> 66e78290e03e9da2713968a103b23bf2202b6fc3
        </View>
    );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
    wrapper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        left: 0,
        right: 0,
        zIndex: 10,
        
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
        borderRadius: 20,
        padding: 6,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    addUserButton: {
        marginRight: 3,
        borderLeftWidth: 4,
        borderLeftColor: "#1E293B",
    },
    analyticsButton: {
        marginLeft: 3,
        borderLeftWidth: 4,
        borderLeftColor: "#06B6D4",
    },
    separatorContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
    },
    separator: {
        width: 1,
        height: 32,
        backgroundColor: "#CBD5E1",
        marginBottom: 4,
    },
    separatorDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#94A3B8",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    analyticsIconContainer: {
        backgroundColor: "#06B6D4",
        shadowColor: "#06B6D4",
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0F172A",
        letterSpacing: 0.3,
        lineHeight: 20,
    },
    buttonSubtext: {
        fontSize: 12,
        fontWeight: "500",
        color: "#64748B",
        marginTop: 2,
        letterSpacing: 0.2,
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    indicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#CBD5E1",
    },
    activeIndicator: {
        backgroundColor: "#1E293B",
        width: 20,
        borderRadius: 3,
    },
>>>>>>> 66e78290e03e9da2713968a103b23bf2202b6fc3
});
