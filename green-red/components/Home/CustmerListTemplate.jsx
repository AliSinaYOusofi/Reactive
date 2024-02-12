import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default function CustomerListTemplate({usernameShortCut, username, totalAmount}) {
    
    return (
        <>

            <View style={styles.container}>
                
                <View style={styles.usernameShortCutStyle}>
                    <Text>{usernameShortCut}</Text>
                </View>

                <View>
                    <Text> {username} </Text>
                </View>

                <View>
                    <Text>  {totalAmount} </Text>
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
        backgroundColor: "#f5f5f5"
    },
    
    usernameShortCutStyle: {
        backgroundColor: "#BDBDBD",
        borderRadius: 50,
        padding: 8
    },
    
    hr: {

        borderBottomColor: 'gray',
        borderBottomWidth: 0.4,
        marginVertical: 10, // Adjust as needed for spacing
    },
})