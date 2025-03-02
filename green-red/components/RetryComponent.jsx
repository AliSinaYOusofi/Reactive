import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";

export default function RetryComponent({
    setRefresh,
    setError,
    errorMessage = "Failed to fetch data",
}) {
    const handleRetry = () => {
        setRefresh((prev) => !prev);
        setError(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Svg
                        width={40}
                        height={40}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FF6B6B"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <Path d="M12 9v4" />
                        <Path d="M12 17h.01" />
                        <Path d="M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
                    </Svg>
                </View>
                <Text style={styles.title}>Oops! Something went wrong</Text>
                <Text style={styles.message}>{errorMessage}</Text>
                <TouchableOpacity onPress={handleRetry} style={styles.button}>
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <Path d="M23 4v6h-6" />
                        <Path d="M21 10a9 9 0 1 1-3-7.7l3 3" />
                    </Svg>
                    <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        
        padding: 16,
    },
    card: {
        backgroundColor: "white",
        padding: 32,
        borderRadius: 16,
        alignItems: "center",
        maxWidth: 320,
        width: "100%",
    },
    iconContainer: {
        backgroundColor: "#FFF5F5",
        borderRadius: 50,
        padding: 16,
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2D3748",
        marginBottom: 12,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: "#718096",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 24,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4299E1",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        elevation: 2,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
