import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
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
                <ArrowUpRight 
                    name="arrow-top-right" 
                    size={28} 
                    color="#E46C62" 
                />
                <Text style={[styles.text, styles.paidText]}>
                    Total Paid: {totalAmountToTake} {currency}
                </Text>
            </View>

            <View style={styles.item}>
                <ArrowDownLeft 
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
                    {isOwed ? 'Must Receive' : 'Must Pay'} {Math.abs(netAmount)} {currency}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 20,
        margin: 10,
        height: 180,
        width: "90%",
        backgroundColor: "#f8f9fa",
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
        color: '#333333', 
    },
    paidText: {
        color: '#E46C62', 
    },
    receivedText: {
        color: '#62B485',
    },
    totalContainer: {
        backgroundColor: '#37371F', 
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginTop:20,
        color: "black"
    },
    totalText: {
        fontSize: 18,
        fontWeight: '600',
        color: "white",
    },
});
