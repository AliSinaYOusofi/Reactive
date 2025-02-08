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
                <MaterialCommunityIcons name="arrow-top-right" size={24} color="red" />
                <Text style={styles.text}>Total Paid: {totalAmountToTake} {currency}</Text>
            </View>

            <View style={styles.item}>
                <MaterialCommunityIcons name="arrow-bottom-left" size={24} color="green" />
                <Text style={styles.text}>Total Received: {totalAmountToGive} {currency}</Text>
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
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 20,
        margin: 5,
        height: 230,
        width: "85%",
        
        
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    text: {
        marginLeft: 10,
        fontSize: 16,
    },
    totalContainer: {
        backgroundColor: '#293038',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "white"
    },
});
