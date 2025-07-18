"use client";

import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserRoundPlus, BarChart3, Plus } from "lucide-react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    withTiming,
    Easing,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

const BUTTON_SIZE = 60;
const BUTTON_SPACING = 75;

export default function ActionButtons() {
    const navigation = useNavigation();
    const [isExpanded, setIsExpanded] = useState(false);

    const expandAnimation = useSharedValue(0);
    const buttonScale = useSharedValue(1);

    const addUserStyle = useAnimatedStyle(() => {
        const offset = 1 * BUTTON_SPACING;
        const delay = 0 * 50;

        const opacity = withTiming(
            interpolate(expandAnimation.value, [0, 1], [0, 1]),
            {
                duration: 300 + delay,
                easing: Easing.out(Easing.quad),
            }
        );

        const translateY = withTiming(
            interpolate(expandAnimation.value, [0, 1], [20, -offset]),
            {
                duration: 400 + delay,
                easing: Easing.out(Easing.back(1.2)),
            }
        );

        const scale = withTiming(
            interpolate(expandAnimation.value, [0, 1], [0.3, 1]),
            {
                duration: 350 + delay,
                easing: Easing.out(Easing.back(1.1)),
            }
        );

        return {
            opacity,
            transform: [{ translateY }, { scale }],
            zIndex: expandAnimation.value > 0 ? 10 : -1,
        };
    });

    const analyticsStyle = useAnimatedStyle(() => {
        const offset = 2 * BUTTON_SPACING;
        const delay = 1 * 50;

        const opacity = withTiming(
            interpolate(expandAnimation.value, [0, 1], [0, 1]),
            {
                duration: 300 + delay,
                easing: Easing.out(Easing.quad),
            }
        );

        const translateY = withTiming(
            interpolate(expandAnimation.value, [0, 1], [20, -offset]),
            {
                duration: 400 + delay,
                easing: Easing.out(Easing.back(1.2)),
            }
        );

        const scale = withTiming(
            interpolate(expandAnimation.value, [0, 1], [0.3, 1]),
            {
                duration: 350 + delay,
                easing: Easing.out(Easing.back(1.1)),
            }
        );

        return {
            opacity,
            transform: [{ translateY }, { scale }],
            zIndex: expandAnimation.value > 0 ? 10 : -1,
        };
    });

    const expandIconStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${interpolate(
                    expandAnimation.value,
                    [0, 1],
                    [0, 45]
                )}deg`,
            },
            { scale: buttonScale.value },
        ],
    }));

    // Backdrop animation
    const backdropStyle = useAnimatedStyle(() => ({
        opacity: withTiming(
            interpolate(expandAnimation.value, [0, 1], [0, 0.3]),
            { duration: 300 }
        ),
    }));

    const toggleExpanded = () => {
        // Button press feedback
        buttonScale.value = withSpring(
            0.9,
            { damping: 20, stiffness: 300 },
            () => {
                buttonScale.value = withSpring(1, {
                    damping: 15,
                    stiffness: 200,
                });
            }
        );

        const toValue = isExpanded ? 0 : 1;
        expandAnimation.value = withTiming(toValue, {
            duration: 400,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        setIsExpanded(!isExpanded);
    };

    const handleAddUser = () => {
        navigation.navigate("Add Customer");
        expandAnimation.value = withTiming(0, { duration: 300 });
        setIsExpanded(false);
    };

    const handleAnalytics = () => {
        navigation.navigate("Chart");
        expandAnimation.value = withTiming(0, { duration: 300 });
        setIsExpanded(false);
    };

    return (
        <>
            {/* Backdrop */}
            {isExpanded && (
                <Animated.View
                    style={[styles.backdrop, backdropStyle]}
                    onTouchEnd={() => {
                        expandAnimation.value = withTiming(0, {
                            duration: 200,
                        });
                        setIsExpanded(false);
                    }}
                />
            )}

            <View style={styles.wrapper}>
                {/* Add User Button */}
                <AnimatedTouchableOpacity
                    onPress={handleAddUser}
                    style={[
                        styles.secondaryButton,
                        styles.addUserButton,
                        addUserStyle,
                    ]}
                    
                >
                    <View style={styles.iconContainer}>
                        <UserRoundPlus
                            size={20}
                            color="#FFFFFF"
                            strokeWidth={2.5}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.secondarySubtext}>
                            Add customer
                        </Text>
                    </View>
                </AnimatedTouchableOpacity>

                {/* Analytics Button */}
                <AnimatedTouchableOpacity
                    onPress={handleAnalytics}
                    style={[
                        styles.secondaryButton,
                        styles.analyticsButton,
                        analyticsStyle,
                    ]}
                    
                >
                    <View
                        style={[
                            styles.iconContainer,
                            styles.analyticsIconContainer,
                        ]}
                    >
                        <BarChart3
                            size={20}
                            color="#FFFFFF"
                            strokeWidth={2.5}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.secondarySubtext}>
                            View insights
                        </Text>
                    </View>
                </AnimatedTouchableOpacity>

                {/* Main FAB */}
                <TouchableOpacity
                    style={styles.expandButton}
                    onPress={toggleExpanded}
                    activeOpacity={0.8}
                >
                    <Animated.View style={expandIconStyle}>
                        <Plus size={28} color="#FFFFFF" strokeWidth={3} />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000",
        zIndex: 5,
    },
    wrapper: {
        position: "absolute",
        bottom: 12,
        right: "50%",
        left: "50%",

        alignItems: "center",
        zIndex: 10,
    },
    expandButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#333333",
    },
    secondaryButton: {
        position: "absolute",
        width: 160,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    addUserButton: {
        // Gradient effect simulation with border
        borderLeftWidth: 4,
        borderLeftColor: "#2C3E50",
    },
    analyticsButton: {
        borderLeftWidth: 4,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#2C3E50",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 4,
    },
    analyticsIconContainer: {
        backgroundColor: "#4ECDC4",
        shadowColor: "#4ECDC4",
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    secondaryText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1a1a1a",
        letterSpacing: 0.3,
        lineHeight: 18,
    },
    secondarySubtext: {
        fontSize: 11,
        fontWeight: "500",
        color: "#666666",
        marginTop: 1,
        letterSpacing: 0.2,
    },
});
