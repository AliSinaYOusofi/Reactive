import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TotalExpenses(
    {
        totalAmountToGive,
        totalAmountToTake,
        currency,
    }) 
    {
    const netAmount = totalAmountToGive - totalAmountToTake;
    const isOwed = netAmount < 0;

    return (
        <View style={styles.container}>
            
            <View style={styles.item}>
                <MaterialCommunityIcons 
                    name="arrow-top-right" 
                    size={28} 
                    color="#E46C62" 
                />
                <Text style={[styles.text, styles.paidText]}>
                    Total Paid: {totalAmountToTake} {currency}
                </Text>
            </View>

            <View style={styles.item}>
                <MaterialCommunityIcons 
                    name="arrow-bottom-left" 
                    size={28} 
                    color="#62B485" 
                />
                <Text style={[styles.text, styles.receivedText]}>
                    Total Received: {totalAmountToGive} {currency}
                </Text>
            </View>
            
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                    {isOwed ? 'You are owed' : 'You owe'} {Math.abs(netAmount)} {currency}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF', // Light background
        borderRadius: 12,
        padding: 20,
        margin: 10, // Increased margin for better spacing
        height: 180,
        width: "90%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4, // For Android shadow
        justifyContent: 'space-around', // Distribute space evenly
        marginRight: 50
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
        color: '#333333', // Darker text for readability
    },
    paidText: {
        color: '#E46C62', // Consistent red color
    },
    receivedText: {
        color: '#62B485', // Consistent green color
    },
    totalContainer: {
        backgroundColor: '#34495E', // Darker, more modern background
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 18,
        fontWeight: '600',
        color: "#FFFFFF",
    },
});
