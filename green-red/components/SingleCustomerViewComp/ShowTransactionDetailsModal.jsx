import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNowStrict } from 'date-fns';
import DateDiffDetails from './DateDiffDetails';
import * as Clipboard from 'expo-clipboard';

export default function ShowTransactionDetailsModal({username, amount, currency, transaction_type, transaction_date, email, phone, closeModal}) {
    
    const [copied, setCopied] = useState(false)
    const copy_to_cliboard = async () => {
        setCopied(true)

        const content = `
${transaction_type.toUpperCase()}
${amount} ${currency}
${transaction_type !== 'received' ? 'To' : 'From'}: ${username}
On: ${transaction_date} ${transaction_date ? formatDistanceToNowStrict(new Date(transaction_date), { addSuffix: true }) : 'N/A'}
Email: ${email || 'N/A'}
Phone: ${phone || 'N/A'}
        `;
        await Clipboard.setStringAsync(content);

        setTimeout( () => setCopied(false), 2000)
    }

    return (
        <View style={styles.modalContainer}>

            <View style={styles.all_text_container}>

                <Text style={[styles.transaction_type_, {color: transaction_type === "received" ? "green" : "red"}]}>{transaction_type}</Text>
                
                <View style={styles.two_texts}>
                    <Text style={styles.amount}>{amount}</Text>
                    <Text style={{color: "white"}}>{currency}</Text>
                </View>
                
                <View style={styles.tow}>
                    <Text style={styles.color}> {transaction_type !== 'received' ? 'To' : 'From'} </Text>
                    <Text style={styles.username}>{username}</Text>
                </View>

                <View style={styles.tow}>
                    <Text style={styles.color}>On</Text>
                    <Text style={styles.transaction_date}> {transaction_date ? <DateDiffDetails date={transaction_date}/> : null}</Text>
                </View>
                
                <Pressable onPress={() => closeModal(false)} style={[styles.pressable, styles.pressable_close]}>
                    <Ionicons name="close-outline" size={24} color="black" />
                </Pressable>
                
                <Pressable onPress={copy_to_cliboard} style={[styles.pressable, styles.pressable_clipboard]}>
                    {
                        !copied ?
                        <Ionicons name="clipboard-outline" size={24} color="black" />
                        :
                        <Ionicons name="checkmark-circle-outline" size={24} color="black" />
                    }
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
        position: "relative",
        color: "white"
    },
    all_text_container: {
        backgroundColor: "#0f0f0f",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        alignItems: 'flex-start',
        color: "white"
    },
    transaction_type_: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'center',
        textTransform: 'uppercase',
        color: "white"
    },
    two_texts: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        color: "white"
    },
    tow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        color: "white"
    },
    amount: {
        fontSize: 25,
        fontWeight: "bold",
        marginRight: 5,
        color: "white"
    },

    username: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold"
    },

    transaction_date: {
        fontSize: 20,
        color: "white",
    },

    email_and_phone: {
        fontSize: 20,
        color: "white",
        alignSelf: "center",
    },

    pressable: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50,
        color: "white"
    },

    pressable_close: {
        top: 10,
        right: 20,
    },
    
    pressable_clipboard: {
        top: 10,
        right: 60,
    },

    color: {
        color: "white",
        fontSize: 20,
    }
});
 