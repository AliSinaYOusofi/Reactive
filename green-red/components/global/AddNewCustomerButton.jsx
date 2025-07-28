"use client";

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
        padding: 16,
        backgroundColor: "#fff",
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
