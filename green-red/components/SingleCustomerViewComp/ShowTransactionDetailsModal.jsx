import React, { useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { formatDistanceToNowStrict } from 'date-fns';
import DateDiffDetails from './DateDiffDetails';
import * as Clipboard from 'expo-clipboard';
import Animated, { 
    FadeIn, 
    BounceInDown, 
    ZoomOut, 
    SlideInDown, 
    SlideOutDown, 
    FadeInLeft
} from 'react-native-reanimated';
import { ClipboardCheck, ClipboardCopy, X } from 'lucide-react-native';

export default function ShowTransactionDetailsModal({ username, amount, currency, transaction_type, transaction_date, closeModal }) {
    const [copied, setCopied] = useState(false);
    
    const copy_to_clipboard = async () => {
        setCopied(true);
        const content = `
${transaction_type.toUpperCase()}
${amount} ${currency}
${transaction_type !== 'received' ? 'To' : 'From'}: ${username}
On: ${transaction_date} ${transaction_date ? formatDistanceToNowStrict(new Date(transaction_date), { addSuffix: true }) : 'N/A'}
        `;
        await Clipboard.setStringAsync(content);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Animated.View 
            style={styles.modalContainer} 
            entering={BounceInDown.springify()} 
            exiting={ZoomOut.duration(400)} 
        >
            <Animated.View entering={FadeIn.duration(600).delay(200)} style={styles.all_text_container}>
                <Animated.Text entering={FadeInLeft.duration(400)}  style={[styles.transaction_type_, { color: transaction_type === "received" ? "#4CAF50" : "#F44336" }]}>
                    {transaction_type}
                </Animated.Text>
                
                <Animated.View entering={FadeIn.duration(500).delay(400)}  style={styles.two_texts}>
                    <Text style={styles.amount}>{amount}</Text>
                    <Text style={styles.currency}>{currency}</Text>
                </Animated.View>
                
                <Animated.View entering={FadeIn.duration(400).delay(500)} style={styles.row}>
                    <Text style={styles.label}>{transaction_type !== 'received' ? 'To' : 'From'}:</Text>
                    <Text style={styles.value}>{username}</Text>
                </Animated.View>

                <Animated.View entering={FadeIn.duration(400).delay(600)} style={styles.row}>
                    <Text style={styles.label}>On:</Text>
                    <Text style={[styles.value]}>
                        {transaction_date ? <DateDiffDetails date={transaction_date} /> : 'N/A'}
                    </Text>
                </Animated.View>
                
                <Pressable onPress={() => closeModal(false)} style={[styles.pressable, styles.pressable_close]}>
                    <X  size={24} color="black" />
                </Pressable>
                
                <Pressable onPress={copy_to_clipboard} style={[styles.pressable, styles.pressable_clipboard]}>
                    {
                        copied
                        ?
                        <ClipboardCheck size={24} color="black"/>
                        :
                        <ClipboardCopy size={24} color="black"/>
                    }
                    
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    all_text_container: {
        backgroundColor: "black",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        alignItems: 'stretch',
    },
    transaction_type_: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 15,
    },
    two_texts: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: 20,
    },
    amount: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        marginRight: 5,
    },
    currency: {
        fontSize: 24,
        color: "white",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    label: {
        fontSize: 18,
        color: "#B0BEC5",
        flex: 1,
    },
    value: {
        fontSize: 18,
        color: "white",
        fontWeight: "500",
        flex: 2,
        textAlign: 'right',
    },
    pressable: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 50,
    },
    pressable_close: {
        top: 10,
        right: 10,
    },
    pressable_clipboard: {
        top: 10,
        right: 60,
    },
    date_diff: {
        color: "gray",
        fontSize: 15
    }
});
