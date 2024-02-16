import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default function CustomerListTemplate({usernameShortCut, username, totalAmount, transaction_type, currency, at}) {
    
    return (
        <>

            <View style={[styles.container, {borderWidth: 1, borderRadius: 5, borderColor: transaction_type !== "paid" ? "green" : 'red'}]}>
                
                <View style={styles.username_and_shortcut_container}>
                    <View style={styles.usernameShortCutStyle}>
                        <Text >{usernameShortCut}</Text>
                    </View>
                    <View>
                        <Text> {username} </Text>
                    </View>
                </View>


                <View>
                    <Text>  {totalAmount} {currency} </Text>
                </View>                
            </View>
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