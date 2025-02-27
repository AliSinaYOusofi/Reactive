import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";

export default function RetryComponent({  setRefresh, setError, errorMessage="Failed to fetch data" }) {
    const handleRetry = () => {
        setRefresh((prev) => !prev);
        setError(false)
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Svg
                    width={64}
                    height={64}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="red"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <Path d="M12 9v4" />
                    <Path d="M12 17h.01" />
                    <Path d="M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
                </Svg>
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
        backgroundColor: "white",
        padding: 16,
    },
    card: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        borderWidth: 1,
        borderColor: "gray",

    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginTop: 12,
    },
    message: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 16,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2563eb",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
