import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ConfirmationEmail({
    email,
    setConfirmationModal,
    password,
}) {
    const navigation = useNavigation();

    const handleCloseModal = () => {
        setConfirmationModal(false);
        navigation.navigate("login", {email, password});
    };

    return (
        <View style={styles.container}>
            <View style={styles.options_container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Email Sent</Text>
                    <TouchableOpacity
                        onPress={handleCloseModal}
                        style={styles.closeButton}
                    >
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Ionicons
                        name="mail"
                        size={80}
                        color="#4F46E5"
                        style={styles.fallbackIcon}
                    />

                    <Text style={styles.message}>
                        A confirmation email has been sent to:
                    </Text>
                    <Text style={styles.email}>{email}</Text>
                    <Text style={styles.instructions}>
                        Please check your inbox and follow the instructions to
                        verify your account.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleCloseModal}
                    >
                        <Text style={styles.buttonText}>Got it</Text>
                    </TouchableOpacity>

                    <Text style={styles.note}>
                        Don't see the email? Check your spam folder or try
                        again.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
    },
    options_container: {
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        width: screenWidth, 
        alignSelf: "stretch",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    closeButton: {
        padding: 5,
    },
    content: {
        alignItems: "center",
        marginBottom: 20,
        width: "100%",
    },
    fallbackIcon: {
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        width: "100%",
    },
    email: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4F46E5",
        textAlign: "center",
        marginBottom: 4,
        width: "100%",
    },
    instructions: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
        width: "100%",
    },
    footer: {
        alignItems: "center",
        width: "100%",
    },
    button: {
        backgroundColor: "#4F46E5",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    note: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        width: "100%",
    },
});
