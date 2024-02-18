import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default function ShowTransactionDetailsModal({username, amount, currency, transaction_type, transaction_date, email, phone, closeModal}) {
    
    return (
        <View style={styles.modalContainer}>

            <View style={styles.all_text_container}>

               
                <Text style={styles.transaction_type_}>{transaction_type}</Text>
                
                
                <View style={styles.two_texts}>
                    <Text style={styles.amount}>{amount}</Text>
                    <Text>{currency}</Text>
                </View>
                
                <View style={styles.tow}>
                    <Text> {transaction_type !== 'received' ? 'TO' : 'FROM'} </Text>
                    <Text style={styles.username}>{username}</Text>
                </View>

                <View style={styles.tow}>
                    <Text>ON</Text>
                    <Text style={styles.transaction_date}> {transaction_date ? transaction_date?.split(" ")[0] : null}</Text>
                </View>

                <View style={styles.tow}>
                    <Text>Email:</Text>
                    <Text style={styles.email_and_phone}> {email || "N/A"}</Text>
                </View>

                <View style={styles.tow}>
                    <Text>Phone:</Text>
                    <Text style={styles.email_and_phone}> {phone || "N/A"}</Text>
                </View>
                
                <Pressable onPress={() => closeModal(false)} style={styles.pressable}>
                    <Ionicons name="close-outline" size={24} color="black" />
                </Pressable>
            </View>

            
        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: "relative"
    },
    all_text_container: {
        backgroundColor: "#F8F8FF",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        alignItems: 'flex-start',
    },
    transaction_type_: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    two_texts: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    tow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    amount: {
        fontSize: 25,
        fontWeight: "bold",
        marginRight: 5,
    },

    username: {
        fontSize: 20,
    },

    transaction_date: {
        fontSize: 20,
    },

    email_and_phone: {
        fontSize: 20,
    },

    pressable: {
        position: 'absolute',
        top: 10,
        right: 20,
        zIndex: 1,
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50
    }
});
 