import React from 'react'
import { View } from 'react-native'

export default function SImpleToast() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 20,
        marginVertical: 40,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});