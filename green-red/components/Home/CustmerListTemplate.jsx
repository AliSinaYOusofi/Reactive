import React from 'react'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native';

export default function CustomerListTemplate({usernameShortCut, username, totalAmount, transaction_type, currency, at, border_color}) {
    
    const navigator = useNavigation();
    
    const handleCustomerViewClick = () => {
        navigator.navigate("CustomerData", {username})    
    }
    return (
        <>

            <Pressable onPress={handleCustomerViewClick} style={[styles.container, {borderWidth: 1, borderRadius: 5, borderColor: border_color}]}>
                
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
            </Pressable>
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