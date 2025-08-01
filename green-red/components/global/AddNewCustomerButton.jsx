import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
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
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#1E293B",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center", // Centers the content horizontally
        gap: 10,
        width: width * 0.9,
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
