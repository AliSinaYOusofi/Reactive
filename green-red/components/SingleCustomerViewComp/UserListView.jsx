import React, { useState } from 'react'
import { Pressable, View, Text, StyleSheet, Modal } from 'react-native'
import ShowTransactionDetailsModal from './ShowTransactionDetailsModal'

export default function UserListView({username, amount, currency, transaction_type, transaction_date, email, phone}) {

    const [modal, setModal] = useState(false)

    return (
        <>
            <Pressable onPress={() => setModal(true)} style={[styles.container, {borderWidth: 1, borderRadius: 5, borderColor: transaction_type === 'received' ? 'green' : 'red'}]}>
                
                <View style={styles.username_and_shortcut_container}>
                    <View style={styles.usernameShortCutStyle}>
                        <Text >{username[0]}{username[1]}</Text>
                    </View>
                    <View>
                        <Text> {username} </Text>
                    </View>
                </View>

                <View>
                    <Text>  {amount} {currency} </Text>
                </View>                
            </Pressable>

            <Modal
                visible={modal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setModal(!modal)}
            >
                <ShowTransactionDetailsModal 
                    username={username}
                    amount={amount}
                    currency={currency}
                    transaction_type={transaction_type}
                    transaction_date={transaction_date}
                    email={email}
                    phone={phone}
                    closeModal={setModal}
                />
            </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
    },
    
    usernameShortCutStyle: {
        backgroundColor: "#F8F8FF", // the bg-color
        borderRadius: 50,
        padding: 8
    },
    
    hr: {

        borderBottomColor: 'gray',
        borderBottomWidth: 0.4,
        marginVertical: 10, // Adjust as needed for spacing
    },

    username_and_shortcut_container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10
    },
    
    username: {

    }
})