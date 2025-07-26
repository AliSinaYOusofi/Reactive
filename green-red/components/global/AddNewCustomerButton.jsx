
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

export default function ActionButtons() {
    const navigation = useNavigation();

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
                            <Feather name="user-plus" size={22} color="#FFFFFF" />
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
                    {/* <AnimatedTouchableOpacity
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
                            <Feather name="trending-up" size={22} color="#FFFFFF" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.buttonText}>Analytics</Text>
                        </View>
                    </AnimatedTouchableOpacity> */}
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        marginBottom: 0,
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
});
