import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function NoExpenseTotalFound() {

    return (
        <View style={styles.container}>
            <Text style={{color: "white"}}>No records found to calculate</Text>
            <Text style={{color: "white"}}>Add a new customer by clicking the button </Text>
            <Text style={{color: "white"}}>at the bottom</Text>
        </View>
    )
}

const styles = StyleSheet.create( {
    container: {
        
        padding: 20,
        backgroundColor: "#f8f9fa", 
        width: "100%",
        borderRadius: 10
    }
})
