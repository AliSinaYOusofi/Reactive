import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';

const AboutScreen = () => {
    const appSummary = "PairPay is a financial management app that helps you track your transactions and manage your finances easily. With OurApp, you can record transactions, view reports, and stay on top of your finances effortlessly.";

    const handleRateApp = () => {
        const packageName = 'your-package-name';
        Linking.openURL(`market://details?id=${packageName}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.summary}>{appSummary}</Text>
            <Pressable onPress={handleRateApp} style={styles.rateButton}>
                
                <Text style={styles.rateButtonText}>Rate OurApp</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white'
    },
    summary: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    rateButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rateButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
});

export default AboutScreen;
